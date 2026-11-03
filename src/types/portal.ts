export type UserRole = 'client' | 'manager' | 'supervisor' | 'admin';

export type DocumentCategory = 'achats' | 'ventes' | 'banque' | 'frais' | 'divers';

export type DocumentStatus = 'recu' | 'en_verification' | 'accepte' | 'a_completer' | 'traite';

export type ScanStatus = 'quarantaine' | 'analyse_conforme' | 'infecte_rejet';

export interface OcrExtractedData {
  vendorName: string;
  invoiceNumber: string;
  date: string; // YYYY-MM-DD
  amountHtEur: number;
  vatRatePercent: number;
  vatAmountEur: number;
  totalTtcEur: number;
  confidenceScore: number; // 0 to 100
  isDuplicateDetected: boolean;
  duplicateReason?: string;
  duplicateOfDocId?: string;
  isHumanValidated?: boolean;
}

export interface DocumentAuditEntry {
  id: string;
  action: string;
  authorName: string;
  authorRole: UserRole;
  timestamp: string;
  details?: string;
}

export interface PortalDocument {
  id: string;
  companyId: string;
  uploadedByUserId: string;
  uploadedByUserName: string;
  category: DocumentCategory;
  filename: string;
  originalFilename: string;
  fileType: 'pdf' | 'png' | 'jpg';
  fileSizeKb: number;
  status: DocumentStatus;
  scanStatus?: ScanStatus;
  sha256Checksum?: string;
  ocrData: OcrExtractedData;
  manualCorrection?: Partial<OcrExtractedData>;
  notes?: string;
  missingInfoReason?: string;
  createdAt: string;
  updatedAt: string;
  history: DocumentAuditEntry[];
  storagePath: string; // Private path or gdrive:<fileId>
  storageProvider?: 'hostinger' | 'google_drive';
  isArchived?: boolean;
}

export interface CompanyDossier {
  id: string;
  legalName: string;
  legalForm: 'SRL' | 'SPRL' | 'BVBA' | 'Indépendant' | 'SA' | 'SC';
  vatNumber: string; // e.g. BE 0824.512.390
  bceNumber: string;
  address: string;
  city: string;
  postalCode: string;
  assignedManagerId: string;
  assignedManagerName: string;
  clientUserIds: string[];
  contactEmail: string;
  contactPhone: string;
  accountingRegime: 'Régime Trimestriel' | 'Régime Mensuel' | 'Franchise';
  fiscalYearEnd: string; // e.g. "31/12"
  status: 'actif' | 'en_constitution' | 'clôture';
}

export interface MissingDocumentRequest {
  id: string;
  companyId: string;
  requestedByUserId: string;
  requestedByUserName: string;
  title: string;
  description: string;
  period: string; // e.g. "Février 2026"
  urgency: 'normale' | 'urgente';
  status: 'en_attente' | 'resolue';
  resolvedDocId?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface PortalMessage {
  id: string;
  companyId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  attachedDocId?: string;
  timestamp: string;
  isRead: boolean;
}

export interface PortalUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  assignedCompanyIds: string[];
  status: 'actif' | 'en_attente_invitation' | 'suspendu';
  mfaEnabled: boolean;
  inviteToken?: string;
  inviteExpiresAt?: string;
  lastLoginAt?: string;
  createdAt: string;
  recoveryCodesRemaining?: number;
}

export interface SecurityAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  status: 'succes' | 'echec' | 'alerte';
  details: string;
}
