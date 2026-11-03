import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import {
  CompanyDossier,
  PortalDocument,
  MissingDocumentRequest,
  PortalMessage,
  SecurityAuditLog,
  UserRole
} from '../types/portal';
import {
  SEED_COMPANIES,
  SEED_DOCUMENTS,
  SEED_MISSING_REQUESTS,
  SEED_MESSAGES,
  SEED_SECURITY_LOGS
} from '../data/portalSeedData';
import { hashPassword, verifyPassword } from './security';
import { assertPrivateStorageDirectory } from './privateStorage';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin configurable pour le volume persistant Hostinger (ex. /home/uXXXX/portal_storage)
export const DATA_DIRECTORY = process.env.PERSISTENT_STORAGE_DIR || path.resolve(__dirname, '../../data');
export const DB_FILE_PATH = path.join(DATA_DIRECTORY, 'portal-database-v2.json');
export const VAULT_DIRECTORY = path.join(DATA_DIRECTORY, 'vault_storage');

export interface StoredUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  assignedCompanyIds: string[];
  status: 'actif' | 'en_attente_invitation' | 'suspendu';
  mfaEnabled: boolean;
  mfaSecretEncrypted?: { ciphertext: string; iv: string; authTag: string };
  recoveryCodesHashed?: string[];
  passwordHash?: string;
  passwordSalt?: string;
  inviteToken?: string;
  inviteExpiresAt?: string;
  lastLoginAt?: string;
  createdAt: string;
}

export interface StoredSession {
  token: string;
  userId: string;
  createdAt: number;
  expiresAt: number;
  ip: string;
  userAgent: string;
}

export interface DatabaseState {
  version: number;
  schema_migrations: Array<{ version: number; appliedAt: string; description: string }>;
  users: StoredUser[];
  sessions: StoredSession[];
  companies: CompanyDossier[];
  documents: PortalDocument[];
  missingRequests: MissingDocumentRequest[];
  messages: PortalMessage[];
  auditLogs: SecurityAuditLog[];
}

class PersistentDatabase {
  private state: DatabaseState;
  private isLoaded = false;

  constructor() {
    this.ensureDirectories();
    this.state = this.loadOrInit();
    this.runMigrations();
    this.revokeExposedDemoCredentials();
  }

  private ensureDirectories() {
    if (process.env.PERSISTENT_STORAGE_DIR) assertPrivateStorageDirectory();
    if (!fs.existsSync(DATA_DIRECTORY)) {
      fs.mkdirSync(DATA_DIRECTORY, { recursive: true, mode: 0o700 });
    }
    if (!fs.existsSync(VAULT_DIRECTORY)) {
      fs.mkdirSync(VAULT_DIRECTORY, { recursive: true, mode: 0o700 });
    }
  }

  private loadOrInit(): DatabaseState {
    if (fs.existsSync(DB_FILE_PATH)) {
      try {
        const raw = fs.readFileSync(DB_FILE_PATH, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.version === 'number' && Array.isArray(parsed.users)) {
          this.isLoaded = true;
          return parsed;
        }
      } catch (err) {
        console.error('[Database] Erreur lecture fichier BDD, création d’un snapshot de secours:', err);
        const backupPath = `${DB_FILE_PATH}.corrupt.${Date.now()}`;
        try {
          fs.copyFileSync(DB_FILE_PATH, backupPath);
        } catch (_) {}
      }
    }

    // No automatic demonstration users in production.
    const fixtureMode = process.env.NODE_ENV === 'test' && process.env.FIDCOGEST_TEST_FIXTURES === 'true';
    const initialState: DatabaseState = {
      version: 2,
      schema_migrations: [{ version: 2, appliedAt: new Date().toISOString(), description: 'Initialisation sans comptes publics de demonstration' }],
      users: [],
      sessions: [],
      companies: fixtureMode ? SEED_COMPANIES : [],
      documents: fixtureMode ? SEED_DOCUMENTS : [],
      missingRequests: fixtureMode ? SEED_MISSING_REQUESTS : [],
      messages: fixtureMode ? SEED_MESSAGES : [],
      auditLogs: fixtureMode ? SEED_SECURITY_LOGS : []
    };

    this.save(initialState);
    this.isLoaded = true;
    return initialState;
  }

  /**
   * Sauvegarde transactionnelle atomique (Write-Ahead)
   * Écrit d'abord dans un fichier temporaire .tmp avant de remplacer de manière atomique
   */
  public save(stateToSave = this.state): void {
    this.ensureDirectories();
    const tempFile = `${DB_FILE_PATH}.${crypto.randomBytes(6).toString('hex')}.tmp`;
    try {
      fs.writeFileSync(tempFile, JSON.stringify(stateToSave, null, 2), { encoding: 'utf-8', mode: 0o600, flag: 'wx' });
      fs.renameSync(tempFile, DB_FILE_PATH);
    } catch (err) {
      if (fs.existsSync(tempFile)) {
        try {
          fs.unlinkSync(tempFile);
        } catch (_) {}
      }
      console.error('[Database] Échec critique écriture atomique sur disque:', err);
      throw err;
    }
  }

  private runMigrations() {
    let currentVersion = this.state.version || 1;

    // Migration V2 : Renforcement des métadonnées cryptographiques et quarantaine
    if (currentVersion < 2) {
      this.state.documents.forEach((doc) => {
        if (!doc.storagePath) {
          doc.storagePath = `/vault_storage/${doc.companyId}/${doc.id}.enc`;
        }
      });
      this.state.schema_migrations.push({
        version: 2,
        appliedAt: new Date().toISOString(),
        description: 'Ajout des statuts de quarantaine antivirus et chiffrement binaire au repos'
      });
      this.state.version = 2;
      this.save();
      console.log('[Database] Migration V2 appliquée avec succès.');
    }
  }

  private revokeExposedDemoCredentials(): void {
    const oldIds = new Set(['usr-client-1', 'usr-client-2', 'usr-manager-1', 'usr-supervisor-1', 'usr-admin-1']);
    const exposedPassword = process.env.PORTAL_REVOKE_EXPOSED_PASSWORD;
    const affected = new Set<string>();
    let updated = false;
    for (const user of this.state.users) {
      let compromised = oldIds.has(user.id);
      if (!compromised && exposedPassword && user.passwordHash && user.passwordSalt) {
        try { compromised = verifyPassword(exposedPassword, user.passwordHash, user.passwordSalt); }
        catch { compromised = false; }
      }
      if (!compromised) continue;
      affected.add(user.id);
      const replacement = hashPassword(crypto.randomBytes(48).toString('hex'));
      user.passwordHash = replacement.hash;
      user.passwordSalt = replacement.salt;
      user.status = 'suspendu';
      user.mfaSecretEncrypted = undefined;
      user.recoveryCodesHashed = [];
      user.inviteToken = undefined;
      user.inviteExpiresAt = undefined;
      updated = true;
    }
    const count = this.state.sessions.length;
    this.state.sessions = this.state.sessions.filter(session => !affected.has(session.userId));
    if (updated || count !== this.state.sessions.length) {
      this.save();
      console.warn('[FIDCOGEST] Exposed demonstration identities suspended and sessions revoked.');
    }
  }

  // --- Accesseurs Sécurisés ---

  public getUsers(): StoredUser[] {
    return this.state.users;
  }

  public getUserById(id: string): StoredUser | undefined {
    return this.state.users.find((u) => u.id === id);
  }

  public getUserByEmail(email: string): StoredUser | undefined {
    return this.state.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  }

  public saveUser(user: StoredUser): void {
    const idx = this.state.users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      this.state.users[idx] = user;
    } else {
      this.state.users.push(user);
    }
    this.save();
  }

  // --- Sessions Sécurisées ---

  public createSession(userId: string, ip: string, userAgent: string): StoredSession {
    // Session token 256-bit cryptographique
    const token = crypto.randomBytes(32).toString('hex');
    const now = Date.now();
    const expiresAt = now + 2 * 60 * 60 * 1000; // 2 heures d'inactivité

    const session: StoredSession = {
      token,
      userId,
      createdAt: now,
      expiresAt,
      ip,
      userAgent
    };

    // Nettoyage des anciennes sessions expirées
    this.state.sessions = this.state.sessions.filter((s) => s.expiresAt > now);
    this.state.sessions.push(session);
    this.save();

    return session;
  }

  public getSession(token: string): StoredSession | undefined {
    const session = this.state.sessions.find((s) => s.token === token);
    if (!session) return undefined;

    // Vérifier l'expiration
    if (Date.now() > session.expiresAt) {
      this.state.sessions = this.state.sessions.filter((s) => s.token !== token);
      this.save();
      return undefined;
    }

    // Prolonger la session lors d'une activité active (rolling session max 2h)
    session.expiresAt = Date.now() + 2 * 60 * 60 * 1000;
    return session;
  }

  public revokeSession(token: string): void {
    this.state.sessions = this.state.sessions.filter((s) => s.token !== token);
    this.save();
  }

  // --- Entreprises & Documents ---

  public getCompanies(): CompanyDossier[] {
    return this.state.companies;
  }

  public getCompanyById(id: string): CompanyDossier | undefined {
    return this.state.companies.find((c) => c.id === id);
  }

  public getDocuments(): PortalDocument[] {
    return this.state.documents;
  }

  public getDocumentById(id: string): PortalDocument | undefined {
    return this.state.documents.find((d) => d.id === id);
  }

  public saveDocument(doc: PortalDocument): void {
    const idx = this.state.documents.findIndex((d) => d.id === doc.id);
    if (idx !== -1) {
      this.state.documents[idx] = doc;
    } else {
      this.state.documents.unshift(doc);
    }
    this.save();
  }

  public deleteDocument(id: string): boolean {
    const initialLen = this.state.documents.length;
    this.state.documents = this.state.documents.filter((d) => d.id !== id);
    if (this.state.documents.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }

  // --- Demandes de Pièces & Messages ---

  public getMissingRequests(): MissingDocumentRequest[] {
    return this.state.missingRequests;
  }

  public saveMissingRequest(req: MissingDocumentRequest): void {
    const idx = this.state.missingRequests.findIndex((r) => r.id === req.id);
    if (idx !== -1) {
      this.state.missingRequests[idx] = req;
    } else {
      this.state.missingRequests.unshift(req);
    }
    this.save();
  }

  public getMessages(): PortalMessage[] {
    return this.state.messages;
  }

  public addMessage(msg: PortalMessage): void {
    this.state.messages.push(msg);
    this.save();
  }

  // --- Journal d'Audit Immuable (Append-Only) ---

  public getAuditLogs(): SecurityAuditLog[] {
    return this.state.auditLogs;
  }

  /**
   * Ajoute un événement d'audit irrévocable (aucun delete API exposé)
   */
  public addAuditLog(
    userId: string,
    userName: string,
    userRole: string,
    action: string,
    ip: string,
    userAgent: string,
    status: 'succes' | 'echec' | 'alerte',
    details: string
  ): SecurityAuditLog {
    const log: SecurityAuditLog = {
      id: `log-${Date.now()}-${crypto.randomBytes(3).toString('hex')}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      userId,
      userName,
      userRole,
      action,
      ipAddress: ip,
      userAgent,
      status,
      details
    };
    this.state.auditLogs.unshift(log);
    // Conservation de l'historique sans purge destructive
    if (this.state.auditLogs.length > 2000) {
      this.state.auditLogs = this.state.auditLogs.slice(0, 2000);
    }
    this.save();
    return log;
  }

  // --- Sauvegardes & Restauration ---

  public exportBackup(): { backupJson: string; checksum: string; timestamp: string } {
    const snapshot = JSON.stringify(this.state, null, 2);
    const checksum = crypto.createHash('sha256').update(snapshot).digest('hex');
    const timestamp = new Date().toISOString();
    return {
      backupJson: snapshot,
      checksum,
      timestamp
    };
  }

  public restoreFromBackup(backupJson: string, expectedChecksum?: string): { success: boolean; message: string } {
    try {
      const parsed = JSON.parse(backupJson);
      if (!parsed || !parsed.version || !Array.isArray(parsed.users) || !Array.isArray(parsed.documents)) {
        return { success: false, message: 'Format de sauvegarde invalide ou corrompu.' };
      }

      if (expectedChecksum) {
        const computed = crypto.createHash('sha256').update(backupJson).digest('hex');
        if (computed !== expectedChecksum) {
          return { success: false, message: 'Échec de vérification du Checksum SHA-256.' };
        }
      }

      this.state = parsed;
      this.save();
      return { success: true, message: `Restauration réussie (${parsed.documents.length} documents, ${parsed.users.length} comptes).` };
    } catch (err: any) {
      return { success: false, message: `Erreur de désérialisation de la sauvegarde: ${err.message}` };
    }
  }
}

export const db = new PersistentDatabase();
