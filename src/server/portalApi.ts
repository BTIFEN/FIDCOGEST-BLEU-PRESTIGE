import express from 'express';
import crypto from 'crypto';
import { db, StoredUser } from './db';
import { runPrivateBootstrap } from './privateBootstrap';
import {
  inspectFileContent,
  verifyPassword,
  hashPassword,
  verifyTotpCode,
  generateTotpCode,
  generateBase32Secret,
  encryptData,
  decryptData,
  generateRecoveryCodes,
  verifyAndConsumeRecoveryCode
} from './security';
import { savePortalDocument, readPortalDocument, registerStorageAdminRoutes } from './storageProviders';
import { analyzeInvoiceDocument } from './ocr';
import {
  PortalDocument,
  MissingDocumentRequest,
  PortalMessage,
  DocumentCategory,
  DocumentStatus,
  UserRole
} from '../types/portal';

export function setupPortalApi(app: express.Express) {
  try {
    const state = runPrivateBootstrap(db);
    if (state !== 'disabled') console.info('[Portal bootstrap]', state);
  } catch {
    console.error('[Portal bootstrap] Refus sécurisé. Inspection privée requise.');
  }
  const router = express.Router();
  router.use((_req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });

  // Helper pour vérifier le Bearer Token de session
  const authenticateSession = (req: express.Request): { user: StoredUser; token: string } | null => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }
    const token = authHeader.substring(7).trim();
    if (!token) return null;

    const session = db.getSession(token);
    if (!session) return null;

    const user = db.getUserById(session.userId);
    if (!user || user.status === 'suspendu') return null;

    return { user, token };
  };

  const getClientIp = (req: express.Request): string => {
    const forwarded = req.headers['x-forwarded-for'];
    if (typeof forwarded === 'string') {
      return forwarded.split(',')[0].trim();
    }
    return req.socket.remoteAddress || '127.0.0.1';
  };

  // Helper de contrôle d'autorisation entreprise
  const canAccessCompany = (user: StoredUser, companyId: string): boolean => {
    if (user.role === 'admin' || user.role === 'supervisor') return true;
    return user.assignedCompanyIds.includes(companyId);
  };

  // -------------------------------------------------------------------------
  // 1. AUTHENTIFICATION SÉCURISÉE & MFA RFC 6238 (ZÉRO CODE DÉMO)
  // -------------------------------------------------------------------------

  // Map temporaire des challenges MFA en cours (expiration 10 minutes)
  const mfaChallenges = new Map<string, { userId: string; expiresAt: number }>();

  router.post('/auth/login', (req, res) => {
    const { email, password } = req.body;
    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'unknown';

    if (!email || !password) {
      return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    const user = db.getUserByEmail(email);
    if (!user) {
      db.addAuditLog('unknown', email, 'anonymous', 'Échec connexion', ip, userAgent, 'echec', 'Identifiant introuvable.');
      return res.status(401).json({ error: 'Identifiants invalides.' });
    }

    if (user.status === 'suspendu') {
      db.addAuditLog(user.id, user.fullName, user.role, 'Connexion refusée', ip, userAgent, 'alerte', 'Compte suspendu.');
      return res.status(403).json({ error: 'Compte suspendu. Veuillez contacter le cabinet Fidcogest.' });
    }

    if (user.status === 'en_attente_invitation') {
      return res.status(400).json({ error: 'Votre compte doit être activé via le lien d’invitation reçu par e-mail.' });
    }

    // Vérification du mot de passe
    if (!user.passwordHash || !user.passwordSalt) return res.status(401).json({ error: 'Identifiants invalides.' });
    if (user.passwordHash && user.passwordSalt) {
      const isValid = verifyPassword(password, user.passwordHash, user.passwordSalt);
      if (!isValid) {
        db.addAuditLog(user.id, user.fullName, user.role, 'Échec mot de passe', ip, userAgent, 'echec', 'Mot de passe erroné.');
        return res.status(401).json({ error: 'Identifiants invalides.' });
      }
    }

    if (!user.mfaEnabled || !user.mfaSecretEncrypted) return res.status(403).json({ error: 'Double authentification non configurée.' });

    // Émission du challenge MFA temporaire
    const challengeToken = crypto.randomBytes(24).toString('hex');
    mfaChallenges.set(challengeToken, {
      userId: user.id,
      expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes
    });

    db.addAuditLog(user.id, user.fullName, user.role, 'Challenge MFA émis', ip, userAgent, 'succes', 'Challenge TOTP 2FA initié.');

    return res.json({
      requireMfa: user.mfaEnabled,
      challengeToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      },
      message: 'Veuillez saisir votre code d’authentification TOTP (Google Authenticator / SMS).'
    });
  });

  router.post('/auth/verify-mfa', (req, res) => {
    const { challengeToken, totpCode, recoveryCode } = req.body;
    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'unknown';

    if (!challengeToken) {
      return res.status(400).json({ error: 'Challenge MFA manquant ou expiré.' });
    }

    const challenge = mfaChallenges.get(challengeToken);
    if (!challenge || Date.now() > challenge.expiresAt) {
      mfaChallenges.delete(challengeToken);
      return res.status(401).json({ error: 'Le challenge de sécurité a expiré. Veuillez vous reconnecter.' });
    }

    const user = db.getUserById(challenge.userId);
    if (!user || user.status !== 'actif') {
      return res.status(401).json({ error: 'Session MFA invalide.' });
    }

    let isMfaValid = false;

    // 1. Vérification par code TOTP RFC 6238
    if (totpCode && user.mfaSecretEncrypted) {
      const secretBase32 = decryptData(user.mfaSecretEncrypted).toString('utf-8');
      isMfaValid = verifyTotpCode(secretBase32, totpCode);
    }

    // 2. Vérification par code de secours d'urgence
    if (!isMfaValid && recoveryCode && user.recoveryCodesHashed) {
      const result = verifyAndConsumeRecoveryCode(recoveryCode, user.recoveryCodesHashed);
      if (result.valid) {
        isMfaValid = true;
        user.recoveryCodesHashed = result.remainingHashed;
        db.saveUser(user);
        db.addAuditLog(user.id, user.fullName, user.role, 'Code secours utilisé', ip, userAgent, 'alerte', 'Connexion via code de récupération d’urgence.');
      }
    }

    if (!isMfaValid) {
      db.addAuditLog(user.id, user.fullName, user.role, 'Échec validation MFA', ip, userAgent, 'echec', 'Code TOTP erroné.');
      return res.status(401).json({ error: 'Code de sécurité invalide ou expiré.' });
    }

    // Challenge validé : suppression du challenge
    mfaChallenges.delete(challengeToken);

    // Création de la session serveur réelle
    const session = db.createSession(user.id, ip, userAgent);
    user.lastLoginAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    db.saveUser(user);

    db.addAuditLog(user.id, user.fullName, user.role, 'Session établie', ip, userAgent, 'succes', 'Authentification complète avec MFA validée.');

    return res.json({
      success: true,
      token: session.token,
      expiresAt: session.expiresAt,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        assignedCompanyIds: user.assignedCompanyIds,
        mfaEnabled: user.mfaEnabled,
        recoveryCodesRemaining: user.recoveryCodesHashed?.length || 0
      }
    });
  });

  router.get('/auth/session', (req, res) => {
    const auth = authenticateSession(req);
    if (!auth) {
      return res.status(401).json({ error: 'Session non authentifiée ou expirée.' });
    }

    return res.json({
      authenticated: true,
      user: {
        id: auth.user.id,
        email: auth.user.email,
        fullName: auth.user.fullName,
        role: auth.user.role,
        assignedCompanyIds: auth.user.assignedCompanyIds,
        mfaEnabled: auth.user.mfaEnabled,
        recoveryCodesRemaining: auth.user.recoveryCodesHashed?.length || 0
      }
    });
  });

  router.post('/auth/logout', (req, res) => {
    const auth = authenticateSession(req);
    if (auth) {
      db.revokeSession(auth.token);
      db.addAuditLog(auth.user.id, auth.user.fullName, auth.user.role, 'Déconnexion', getClientIp(req), req.headers['user-agent'] || '', 'succes', 'Session révoquée.');
    }
    return res.json({ success: true, message: 'Déconnexion réussie.' });
  });

  // Configuration ou réinitialisation du MFA (génération QR code URI et codes de secours)
  router.post('/auth/setup-mfa', (req, res) => {
    const auth = authenticateSession(req);
    if (!auth) {
      return res.status(401).json({ error: 'Non authentifié.' });
    }

    const secretBase32 = generateBase32Secret(20);
    const { plainCodes, hashedCodes } = generateRecoveryCodes(10);

    auth.user.mfaSecretEncrypted = encryptData(secretBase32);
    auth.user.recoveryCodesHashed = hashedCodes;
    auth.user.mfaEnabled = true;
    db.saveUser(auth.user);

    const otpauthUri = `otpauth://totp/FIDCOGEST:${encodeURIComponent(auth.user.email)}?secret=${secretBase32}&issuer=FIDCOGEST&algorithm=SHA1&digits=6&period=30`;

    db.addAuditLog(auth.user.id, auth.user.fullName, auth.user.role, 'Configuration MFA', getClientIp(req), req.headers['user-agent'] || '', 'succes', 'Nouveau secret TOTP RFC 6238 généré.');

    return res.json({
      success: true,
      secretBase32,
      otpauthUri,
      recoveryCodes: plainCodes,
      message: 'Scannez le QR Code dans Google Authenticator ou saisissez la clé manuelle.'
    });
  });

  // -------------------------------------------------------------------------
  // 2. ENTREPRISES & DOSSIERS (AUTORISATION SERVEUR STRICTE)
  // -------------------------------------------------------------------------

  router.get('/companies', (req, res) => {
    const auth = authenticateSession(req);
    if (!auth) {
      return res.status(401).json({ error: 'Authentification requise.' });
    }

    let allowed = db.getCompanies();
    if (auth.user.role === 'client' || auth.user.role === 'manager') {
      allowed = allowed.filter((c) => auth.user.assignedCompanyIds.includes(c.id));
    }

    return res.json({ companies: allowed });
  });

  router.get('/companies/:id', (req, res) => {
    const auth = authenticateSession(req);
    if (!auth) {
      return res.status(401).json({ error: 'Authentification requise.' });
    }

    const company = db.getCompanyById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: 'Entreprise introuvable.' });
    }

    if (!canAccessCompany(auth.user, company.id)) {
      db.addAuditLog(auth.user.id, auth.user.fullName, auth.user.role, 'Accès entreprise refusé (403)', getClientIp(req), req.headers['user-agent'] || '', 'alerte', `Tentative non autorisée sur ${company.id}`);
      return res.status(403).json({ error: 'Accès interdit à ce dossier entreprise.' });
    }

    return res.json({ company });
  });

  // -------------------------------------------------------------------------
  // 3. DOCUMENTS, TÉLÉVERSEMENT SÉCURISÉ, ANTIVIRUS & OCR RÉEL
  // -------------------------------------------------------------------------

  router.get('/documents', (req, res) => {
    const auth = authenticateSession(req);
    if (!auth) {
      return res.status(401).json({ error: 'Authentification requise.' });
    }

    const { companyId, category, status, search } = req.query;
    let docs = db.getDocuments();

    // Isolation par utilisateur
    if (auth.user.role === 'client' || auth.user.role === 'manager') {
      docs = docs.filter((d) => auth.user.assignedCompanyIds.includes(d.companyId));
    }

    if (companyId) {
      if (!canAccessCompany(auth.user, companyId as string)) {
        return res.status(403).json({ error: 'Accès non autorisé à cette entreprise.' });
      }
      docs = docs.filter((d) => d.companyId === companyId);
    }
    if (category) {
      docs = docs.filter((d) => d.category === category);
    }
    if (status) {
      docs = docs.filter((d) => d.status === status);
    }
    if (search) {
      const q = (search as string).toLowerCase();
      docs = docs.filter((d) =>
        d.filename.toLowerCase().includes(q) ||
        d.ocrData.vendorName.toLowerCase().includes(q) ||
        d.ocrData.invoiceNumber.toLowerCase().includes(q)
      );
    }

    return res.json({ documents: docs });
  });

  router.post('/documents/upload', async (req, res) => {
    const auth = authenticateSession(req);
    if (!auth) {
      return res.status(401).json({ error: 'Authentification requise pour téléverser.' });
    }

    const { companyId, category, filename, base64Payload } = req.body;
    const ip = getClientIp(req);
    const userAgent = req.headers['user-agent'] || 'unknown';

    if (!companyId || !filename || !category) {
      return res.status(400).json({ error: 'Champs requis manquants (companyId, filename, category).' });
    }

    if (!canAccessCompany(auth.user, companyId)) {
      db.addAuditLog(auth.user.id, auth.user.fullName, auth.user.role, 'Téléversement refusé (403)', ip, userAgent, 'alerte', `Tentative téléversement sur ${companyId}`);
      return res.status(403).json({ error: 'Accès non autorisé à cette entreprise.' });
    }

    // Récupération du buffer binaire réel
    let fileBuffer: Buffer;
    if (typeof base64Payload !== 'string' || !base64Payload) {
      return res.status(400).json({ error: 'Le contenu réel du fichier est obligatoire.' });
    }
    const cleanBase64 = base64Payload.replace(/^data:[^;]+;base64,/, '');
    if (!/^[A-Za-z0-9+/]+={0,2}$/.test(cleanBase64) || cleanBase64.length > 14_000_000) {
      return res.status(400).json({ error: 'Fichier encodé invalide ou trop volumineux.' });
    }
    fileBuffer = Buffer.from(cleanBase64, 'base64');

    // 1. Analyse antivirus et contrôle des Magic Bytes réels
    const scanResult = inspectFileContent(fileBuffer, filename);
    if (!scanResult.isValid || scanResult.isMalwareDetected) {
      db.addAuditLog(
        auth.user.id,
        auth.user.fullName,
        auth.user.role,
        'Fichier rejeté / Alerte Antivirus',
        ip,
        userAgent,
        'alerte',
        `Rejet fichier ${filename}: ${scanResult.rejectionReason} (${scanResult.malwareThreatName || 'Non conforme'})`
      );
      return res.status(422).json({
        error: scanResult.rejectionReason || 'Fichier refusé par le scanner de sécurité.',
        isMalwareDetected: scanResult.isMalwareDetected,
        threatName: scanResult.malwareThreatName
      });
    }

    // 2. Chiffrement au repos et stockage privé
    let storedVault;
    try {
      storedVault = await savePortalDocument(companyId, filename, fileBuffer);
    } catch (err:any) {
      return res.status(503).json({error:err.message || 'Stockage documentaire indisponible.'});
    }

    // 3. Analyse OCR serveur réelle (Gemini 2.5 Flash Vision)
    const ocrExtraction = await analyzeInvoiceDocument(fileBuffer, scanResult.detectedMime, filename);

    // 4. Détection des doublons
    const existingInvoices = db.getDocuments().filter((d) => d.companyId === companyId);
    const duplicateMatch = existingInvoices.find(
      (d) =>
        d.ocrData.invoiceNumber === ocrExtraction.invoiceNumber ||
        (d.ocrData.vendorName.toLowerCase() === ocrExtraction.vendorName.toLowerCase() &&
          Math.abs(d.ocrData.totalTtcEur - ocrExtraction.totalTtcEur) < 0.05)
    );

    const isDuplicate = !!duplicateMatch;
    const duplicateReason = isDuplicate
      ? `Alerte anti-doublon : Facture similaire #${duplicateMatch.ocrData.invoiceNumber} (${duplicateMatch.ocrData.totalTtcEur} €) déjà enregistrée le ${duplicateMatch.createdAt}.`
      : undefined;

    const newDoc: PortalDocument = {
      id: storedVault.docId,
      companyId,
      uploadedByUserId: auth.user.id,
      uploadedByUserName: auth.user.fullName,
      category: category as DocumentCategory,
      filename,
      originalFilename: filename,
      fileType: scanResult.detectedExtension,
      fileSizeKb: Math.round(scanResult.fileSizeBytes / 1024),
      status: 'recu',
      scanStatus: 'analyse_conforme',
      sha256Checksum: scanResult.sha256Checksum,
      ocrData: {
        ...ocrExtraction,
        isDuplicateDetected: isDuplicate,
        duplicateReason,
        duplicateOfDocId: duplicateMatch?.id
      },
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      storagePath: storedVault.storagePath,
      storageProvider: storedVault.provider,
      history: [
        {
          id: `hist-${Date.now()}`,
          action: 'Dépôt sécurisé (Antivirus conforme & Chiffré AES-256)',
          authorName: auth.user.fullName,
          authorRole: auth.user.role,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
          details: `Checksum SHA-256 : ${scanResult.sha256Checksum.substring(0, 16)}...`
        }
      ]
    };

    db.saveDocument(newDoc);
    db.addAuditLog(
      auth.user.id,
      auth.user.fullName,
      auth.user.role,
      'Dépôt document validé',
      ip,
      userAgent,
      'succes',
      `Fichier ${filename} stocké dans le coffre privé. ID: ${newDoc.id}`
    );

    return res.status(201).json({ document: newDoc });
  });

  // Téléchargement sécurisé et déchiffrement à la volée (Zéro URL publique)
  router.get('/documents/:id/download', async (req, res) => {
    const auth = authenticateSession(req);
    if (!auth) {
      return res.status(401).json({ error: 'Authentification requise pour télécharger.' });
    }

    const doc = db.getDocumentById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: 'Fichier non trouvé.' });
    }

    if (!canAccessCompany(auth.user, doc.companyId)) {
      db.addAuditLog(auth.user.id, auth.user.fullName, auth.user.role, 'Téléchargement interdit (403)', getClientIp(req), req.headers['user-agent'] || '', 'alerte', `Tentative téléchargement doc ${doc.id}`);
      return res.status(403).json({ error: 'Accès non autorisé à cette pièce confidentielle.' });
    }

    try {
      const decrypted = await readPortalDocument(doc.storagePath);

      db.addAuditLog(
        auth.user.id,
        auth.user.fullName,
        auth.user.role,
        'Téléchargement binaire sécurisé',
        getClientIp(req),
        req.headers['user-agent'] || '',
        'succes',
        `Document ${doc.filename} déchiffré et transmis.`
      );

      res.setHeader('Content-Type', doc.fileType === 'pdf' ? 'application/pdf' : doc.fileType === 'png' ? 'image/png' : 'image/jpeg');
      res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(doc.filename)}"`);
      res.setHeader('X-Content-Type-Options', 'nosniff');
      res.setHeader('Cache-Control', 'private, no-store, max-age=0');
      return res.send(decrypted.buffer);
    } catch (err: any) {
      console.error('[Vault Download] Erreur déchiffrement:', err);
      return res.status(500).json({ error: 'Impossible de déchiffrer le document stocké.' });
    }
  });

  // Validation manuelle par le gestionnaire / expert ITAA
  router.put('/documents/:id/validate', (req, res) => {
    const auth = authenticateSession(req);
    if (!auth || auth.user.role === 'client') {
      return res.status(403).json({ error: 'Seuls les gestionnaires et associés ITAA peuvent valider les pièces.' });
    }

    const doc = db.getDocumentById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'Document introuvable.' });

    if (!canAccessCompany(auth.user, doc.companyId)) {
      return res.status(403).json({ error: 'Non autorisé sur ce dossier.' });
    }

    const { status, correctedOcr, notes, missingInfoReason } = req.body;
    if (status) doc.status = status as DocumentStatus;
    if (correctedOcr) {
      doc.ocrData = { ...doc.ocrData, ...correctedOcr, isHumanValidated: true };
      doc.manualCorrection = correctedOcr;
    }
    if (notes !== undefined) doc.notes = notes;
    if (missingInfoReason !== undefined) doc.missingInfoReason = missingInfoReason;

    doc.updatedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    doc.history.push({
      id: `hist-${Date.now()}`,
      action: `Validation humaine effectuée : ${status?.toUpperCase()}`,
      authorName: auth.user.fullName,
      authorRole: auth.user.role,
      timestamp: doc.updatedAt,
      details: notes || 'Vérification métadonnées et TVA conforme ITAA.'
    });

    db.saveDocument(doc);
    db.addAuditLog(auth.user.id, auth.user.fullName, auth.user.role, 'Validation comptable', getClientIp(req), req.headers['user-agent'] || '', 'succes', `Doc ${doc.id} validé au statut ${doc.status}`);

    return res.json({ document: doc });
  });

  // -------------------------------------------------------------------------
  // 4. DEMANDES DE PIÈCES & MESSAGERIE
  // -------------------------------------------------------------------------

  router.get('/missing-requests', (req, res) => {
    const auth = authenticateSession(req);
    if (!auth) return res.status(401).json({ error: 'Authentification requise.' });

    let requests = db.getMissingRequests();
    if (auth.user.role === 'client' || auth.user.role === 'manager') {
      requests = requests.filter((r) => auth.user.assignedCompanyIds.includes(r.companyId));
    }
    return res.json({ requests });
  });

  router.post('/missing-requests', (req, res) => {
    const auth = authenticateSession(req);
    if (!auth || auth.user.role === 'client') {
      return res.status(403).json({ error: 'Action réservée aux gestionnaires.' });
    }

    const { companyId, title, description, period, urgency } = req.body;
    if (!companyId || !title) {
      return res.status(400).json({ error: 'Titre et entreprise requis.' });
    }

    const newReq: MissingDocumentRequest = {
      id: `req-${Date.now()}`,
      companyId,
      requestedByUserId: auth.user.id,
      requestedByUserName: auth.user.fullName,
      title,
      description: description || '',
      period: period || 'En cours',
      urgency: urgency === 'urgente' ? 'urgente' : 'normale',
      status: 'en_attente',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };

    db.saveMissingRequest(newReq);
    db.addAuditLog(auth.user.id, auth.user.fullName, auth.user.role, 'Demande pièce créée', getClientIp(req), req.headers['user-agent'] || '', 'succes', `Demande "${title}" pour ${companyId}`);

    return res.status(201).json({ request: newReq });
  });

  router.put('/missing-requests/:id/resolve', (req, res) => {
    const auth = authenticateSession(req);
    if (!auth) return res.status(401).json({ error: 'Non authentifié.' });

    const reqItem = db.getMissingRequests().find((r) => r.id === req.params.id);
    if (!reqItem) return res.status(404).json({ error: 'Demande non trouvée.' });

    reqItem.status = 'resolue';
    reqItem.resolvedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    reqItem.resolvedDocId = req.body.resolvedDocId;
    db.saveMissingRequest(reqItem);

    return res.json({ success: true, request: reqItem });
  });

  router.get('/messages', (req, res) => {
    const auth = authenticateSession(req);
    if (!auth) return res.status(401).json({ error: 'Non authentifié.' });

    const { companyId } = req.query;
    if (!companyId || !canAccessCompany(auth.user, companyId as string)) {
      return res.status(403).json({ error: 'Accès interdit aux messages de cette entreprise.' });
    }

    const msgs = db.getMessages().filter((m) => m.companyId === companyId);
    return res.json({ messages: msgs });
  });

  router.post('/messages', (req, res) => {
    const auth = authenticateSession(req);
    if (!auth) return res.status(401).json({ error: 'Non authentifié.' });

    const { companyId, content, attachedDocId } = req.body;
    if (!companyId || !content || !canAccessCompany(auth.user, companyId)) {
      return res.status(403).json({ error: 'Non autorisé sur ce dossier.' });
    }

    const newMsg: PortalMessage = {
      id: `msg-${Date.now()}`,
      companyId,
      authorId: auth.user.id,
      authorName: auth.user.fullName,
      authorRole: auth.user.role,
      content,
      attachedDocId,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 16),
      isRead: false
    };

    db.addMessage(newMsg);
    return res.status(201).json({ message: newMsg });
  });

  // -------------------------------------------------------------------------
  // 5. ADMINISTRATION DU CABINET, SAUVEGARDES & AUDIT IMMUABLE
  // -------------------------------------------------------------------------

  router.get('/admin/users', (req, res) => {
    const auth = authenticateSession(req);
    if (!auth || (auth.user.role !== 'admin' && auth.user.role !== 'supervisor')) {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs.' });
    }

    // Exclure les condensats de mots de passe et secrets bruts des retours API
    const sanitized = db.getUsers().map((u) => ({
      id: u.id,
      email: u.email,
      fullName: u.fullName,
      role: u.role,
      phone: u.phone,
      assignedCompanyIds: u.assignedCompanyIds,
      status: u.status,
      mfaEnabled: u.mfaEnabled,
      recoveryCodesRemaining: u.recoveryCodesHashed?.length || 0,
      createdAt: u.createdAt,
      lastLoginAt: u.lastLoginAt
    }));

    return res.json({ users: sanitized });
  });

  router.get('/admin/audit-logs', (req, res) => {
    const auth = authenticateSession(req);
    if (!auth || (auth.user.role !== 'admin' && auth.user.role !== 'supervisor')) {
      return res.status(403).json({ error: 'Accès réservé aux administrateurs.' });
    }
    return res.json({ logs: db.getAuditLogs().slice(0, 200) });
  });

  // Sauvegarde chiffrée
  router.get('/admin/backup', (req, res) => {
    const auth = authenticateSession(req);
    if (!auth || auth.user.role !== 'admin') {
      return res.status(403).json({ error: 'Sauvegarde réservée au rôle administrateur.' });
    }

    const backup = db.exportBackup();
    db.addAuditLog(auth.user.id, auth.user.fullName, auth.user.role, 'Sauvegarde système', getClientIp(req), req.headers['user-agent'] || '', 'succes', `Instantané exporté. Checksum: ${backup.checksum.substring(0, 16)}`);

    return res.json(backup);
  });

  // Restauration de test
  router.post('/admin/restore', (req, res) => {
    const auth = authenticateSession(req);
    if (!auth || auth.user.role !== 'admin') {
      return res.status(403).json({ error: 'Restauration réservée au rôle administrateur.' });
    }

    const { backupJson, expectedChecksum } = req.body;
    if (!backupJson) return res.status(400).json({ error: 'Payload de sauvegarde manquant.' });

    const result = db.restoreFromBackup(backupJson, expectedChecksum);
    db.addAuditLog(auth.user.id, auth.user.fullName, auth.user.role, 'Restauration système', getClientIp(req), req.headers['user-agent'] || '', result.success ? 'succes' : 'echec', result.message);

    return res.json(result);
  });

  // Export comptable belge (journal conforme)
  router.get('/export/accounting', (req, res) => {
    const auth = authenticateSession(req);
    if (!auth || auth.user.role === 'client') {
      return res.status(403).json({ error: 'Export réservé aux gestionnaires.' });
    }

    const { companyId, format } = req.query;
    const docs = db.getDocuments().filter((d) => (!companyId ? true : d.companyId === companyId));

    if (format === 'csv') {
      let csv = 'NumeroPiece;DateEcriture;Journal;CompteGeneralPCMN;Libelle;MontantDebit;MontantCredit;TauxTVABelge;MontantTVA;NumeroBCE\n';
      docs.forEach((d) => {
        const pcmnAccount = d.category === 'achats' ? '600000' : d.category === 'ventes' ? '700000' : d.category === 'frais' ? '610000' : '550000';
        csv += `"${d.id}";"${d.ocrData.date}";"${d.category.toUpperCase()}";"${pcmnAccount}";"${d.ocrData.vendorName} - ${d.ocrData.invoiceNumber}";"${d.ocrData.amountHtEur}";"0.00";"${d.ocrData.vatRatePercent}%";"${d.ocrData.vatAmountEur}";"${d.companyId}"\n`;
      });
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', 'attachment; filename="Fidcogest_Journal_PCMN_Belge.csv"');
      return res.send(csv);
    }

    return res.json({
      exportTimestamp: new Date().toISOString(),
      generator: 'Fidcogest Belgian Accounting Bridge V1',
      standard: 'PCMN-Belgique-ITAA',
      recordsCount: docs.length,
      records: docs.map((d) => ({
        id: d.id,
        companyId: d.companyId,
        date: d.ocrData.date,
        journal: d.category,
        vendor: d.ocrData.vendorName,
        invoiceNumber: d.ocrData.invoiceNumber,
        amountHtEur: d.ocrData.amountHtEur,
        vatRatePercent: d.ocrData.vatRatePercent,
        vatAmountEur: d.ocrData.vatAmountEur,
        totalTtcEur: d.ocrData.totalTtcEur,
        isHumanValidated: d.ocrData.isHumanValidated ?? false,
        status: d.status
      }))
    });
  });

  registerStorageAdminRoutes(app, authenticateSession, (id) => db.getCompanyById(id));
  app.use('/api/portal', router);
  console.log('[Fidcogest Portal V2] API sécurisée initialisée avec sessions Bearer, TOTP RFC 6238 et coffre chiffré.');
}
