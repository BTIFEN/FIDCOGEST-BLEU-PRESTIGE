export type PageTab =
  | 'home'
  | 'about'
  | 'team'
  | 'services'
  | 'creation'
  | 'fiscalite'
  | 'ecompta'
  | 'tools'
  | 'news'
  | 'contact'
  | 'mentions'
  | 'admin';

export type Language = 'fr' | 'nl' | 'en';

export interface TaxDeadline {
  id: string;
  title: string;
  dueDate: string; // e.g. "2026-04-20"
  period: 'Mensuelle' | 'Trimestrielle' | 'Annuelle';
  category: 'TVA' | 'ISOC' | 'IPP' | 'Fiches 281' | 'Cotisations Sociales' | 'BNB';
  description: string;
  isUrgent?: boolean;
}

export interface SubService {
  name: string;
  details: string;
}

export interface ServicePole {
  id: string;
  title: string;
  shortTitle?: string;
  subtitle?: string;
  tagline?: string;
  iconName?: string;
  description: string;
  keyFeatures?: string[];
  subServices?: SubService[];
  suitedFor?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  title?: string;
  itaaNumber?: string;
  accreditation?: string;
  bio: string;
  specialties: string[];
  email: string;
  location: string;
}

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  date: string;
  category: 'Fiscalité' | 'Comptabilité' | 'Facturation Électronique' | 'Création d\'entreprise';
  summary: string;
  content: string;
  author: string;
  readTime: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  roleCompany: string;
  companyType: 'SRL' | 'Indépendant' | 'Profession Libérale' | 'Starter';
  quote: string;
  rating: number;
  location: string;
}

export interface BookingData {
  motif: 'Premier contact / Création' | 'Bilan annuel & Clôture' | 'Conseil fiscal ponctuel' | 'Remise de documents / TVA';
  modality: 'En cabinet (Ganshoren)' | 'Visioconférence (Meet/Teams)' | 'Téléphonique';
  expertId?: string;
  date: string;
  timeSlot: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  companyName?: string;
  notes?: string;
}

export interface UploadedDocResult {
  id: string;
  filename: string;
  docType: string;
  vendorName: string;
  totalAmountEur: number;
  vatAmountEur: number;
  vatRatePercent: number;
  invoiceDate: string;
  recommendedCategory: string;
  deductibilityRate: string;
  status: 'Analysé' | 'En attente validation' | 'Comptabilisé';
}

export interface DivergenceItem {
  field: string;
  sourceHistorique: string;
  valeurPrototype: string;
  statut: 'VALIDÉ_OFFICIEL' | 'CORRIGÉ_VERS_HISTORIQUE' | 'VALIDÉ_HISTORIQUE' | 'ENRICHI_AVEC_BASECONE';
  notes: string;
}

export interface CabinetHeadquarters {
  address: string;
  postalCode: string;
  city: string;
  country: string;
  googleMapsUrl: string;
}

export interface CabinetIdentity {
  name: string;
  legalForm: string;
  foundingYear: number;
  foundingDate: string;
  bceNumber: string;
  vatNumber: string;
  peppolIdentifier: string;
  headquarters: CabinetHeadquarters;
  phone: string;
  mobile: string;
  email: string;
  secondaryEmail: string;
  openingHours: string;
  officialAccreditation: string;
  accreditationStatus: string;
  primaryTool: string;
  verificationNotice: string;
}

export interface CabinetConfig {
  cabinet: CabinetIdentity;
  divergenceAudit: DivergenceItem[];
  team: TeamMember[];
  services: ServicePole[];
  presentationCabinet: {
    title: string;
    subtitle: string;
    experienceYears: number;
    piliers: { titre: string; texte: string }[];
  };
}
