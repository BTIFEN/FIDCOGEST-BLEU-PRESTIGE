export type PageTab = 'home' | 'about' | 'services' | 'tools' | 'news' | 'contact';

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

export interface ServicePole {
  id: string;
  title: string;
  subtitle: string;
  iconName: string;
  description: string;
  keyFeatures: string[];
  suitedFor: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  itaaNumber: string;
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
  modality: 'En cabinet (Bruxelles)' | 'En cabinet (Mons)' | 'Visioconférence (Meet/Teams)' | 'Téléphonique';
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
