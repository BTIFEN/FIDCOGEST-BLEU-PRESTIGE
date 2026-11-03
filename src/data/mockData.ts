import { TaxDeadline, ServicePole, TeamMember, NewsArticle, Testimonial } from '../types';
import cabinetContent from '../../data/cabinet-content.json';

export const TAX_DEADLINES_2026: TaxDeadline[] = [
  {
    id: 'tva-m3',
    title: 'Déclaration TVA - Mars 2026 (Mensuel)',
    dueDate: '2026-04-20',
    period: 'Mensuelle',
    category: 'TVA',
    description: 'Dépôt de la déclaration périodique TVA du mois de mars et paiement du solde dû.',
    isUrgent: true
  },
  {
    id: 'tva-q1',
    title: 'Déclaration TVA - 1er Trimestre 2026',
    dueDate: '2026-04-20',
    period: 'Trimestrielle',
    category: 'TVA',
    description: 'Dépôt de la déclaration périodique TVA du 1er trimestre pour les assujettis trimestriels.',
    isUrgent: true
  },
  {
    id: 'isoc-va1',
    title: '1er Versement Anticipé ISOC (VA1)',
    dueDate: '2026-04-10',
    period: 'Trimestrielle',
    category: 'ISOC',
    description: 'Premier versement anticipé d\'Impôt des Sociétés pour bénéficier de la bonification maximale (éviter majoration de 6.75%).',
    isUrgent: true
  },
  {
    id: 'fiches-281',
    title: 'Envoi des Fiches 281.50 (Commissions & Honoraires)',
    dueDate: '2026-06-29',
    period: 'Annuelle',
    category: 'Fiches 281',
    description: 'Transmission à l\'administration fiscale des fiches 281.50 relatives aux honoraires versés aux tiers en 2025.'
  },
  {
    id: 'isoc-va2',
    title: '2ème Versement Anticipé ISOC (VA2)',
    dueDate: '2026-07-10',
    period: 'Trimestrielle',
    category: 'ISOC',
    description: 'Deuxième échéance de versement anticipé pour l\'exercice d\'imposition 2027.'
  },
  {
    id: 'ipp-decl',
    title: 'Déclaration IPP 2026 (Revenus 2025)',
    dueDate: '2026-07-15',
    period: 'Annuelle',
    category: 'IPP',
    description: 'Date limite de dépôt de la déclaration d\'Impôt des Personnes Physiques (Mandataires / Indépendants via MyMinfin).'
  },
  {
    id: 'bnb-comptes',
    title: 'Dépôt des Comptes Annuels à la BNB',
    dueDate: '2026-07-31',
    period: 'Annuelle',
    category: 'BNB',
    description: 'Dépôt officiel du bilan et des comptes annuels à la Banque Nationale de Belgique pour les sociétés clôturant au 31/12.'
  },
  {
    id: 'cotis-q2',
    title: 'Cotisations Sociales Indépendants - Q2 2026',
    dueDate: '2026-06-30',
    period: 'Trimestrielle',
    category: 'Cotisations Sociales',
    description: 'Paiement de la cotisation sociale trimestrielle auprès de votre caisse d\'assurances sociales.'
  }
];

// All 7 official historical service poles from https://www.fidcogest.be
export const SERVICE_POLES: ServicePole[] = (cabinetContent.services as ServicePole[]) || [];

// Real verified team from https://www.fidcogest.be and BCE
export const TEAM_MEMBERS: TeamMember[] = (cabinetContent.team as TeamMember[]) || [];

// Conformité & Déontologie ITAA : Aucun faux avis ou témoignage non authentifié
export const TESTIMONIALS: Testimonial[] = [];

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: 'peppol-2026-belgique',
    title: 'Facturation électronique B2B obligatoire dès le 1er janvier 2026 en Belgique : Comment préparer votre entreprise ?',
    slug: 'facturation-electronique-peppol-2026-belgique',
    date: '10 Octobre 2026',
    category: 'Facturation Électronique',
    summary: 'La Belgique impose la facturation électronique structurée via le réseau Peppol pour toutes les transactions B2B. Découvrez le calendrier officiel, les déductions fiscales pour investissement et la checklist de conformité Fidcogest.',
    content: `Dès le 1er janvier 2026, l'envoi de simples factures au format PDF par email ne sera plus conforme pour les transactions B2B entre assujettis TVA belges. La loi impose l'échange de factures électroniques structurées au format XML UBL via le réseau sécurisé Peppol.

### Ce que cela change concrètement pour votre entreprise :
1. **Format obligatoire** : Envoi et réception automatisés de factures électroniques structurées conformes Peppol.
2. **Déduction fiscale avantageuse** : Déduction majorée pour l'acquisition d'outils de facturation électronique et frais de conseil associés.
3. **Période de transition** : Le cabinet Fidcogest prépare l'ensemble de ses clients à cette échéance réglementaire.

N'attendez pas l'échéance : contactez notre cabinet à Ganshoren pour activer votre canal conforme Peppol.`,
    author: 'Paul Holl Mpeck, Expert-Comptable certifié ITAA',
    readTime: '4 min'
  },
  {
    id: 'remuneration-dirigeant-2026',
    title: 'SRL : Quel est le seuil de rémunération dirigeant idéal en 2026 pour bénéficier du taux réduit ISOC à 20% ?',
    slug: 'remuneration-dirigeant-taux-reduit-isoc-2026',
    date: '28 Septembre 2026',
    category: 'Fiscalité',
    summary: 'Analyse comparative entre rémunération mensuelle et distribution de dividendes sous le régime VVPR-bis à 15%. Évitez les erreurs fiscales courantes et optimisez votre taux de pression fiscale effectif.',
    content: `En Belgique, le taux ordinaire de l'Impôt des Sociétés (ISOC) s'élève à 25%. Néanmoins, les petites sociétés peuvent bénéficier d'un taux réduit de 20% sur la première tranche de 100.000 € de bénéfice imposable, à condition de verser une rémunération minimale à au moins un dirigeant d'entreprise.

### Les conditions clés à respecter :
- **Seuil légal** : Rémunération brute minimale de 45.000 €/an (ou égale au résultat imposable de la société si celui-ci est inférieur à 45.000 €).
- **Régime VVPR-bis** : Après 3 ans de détention des actions souscrites lors de la constitution, les dividendes peuvent être distribués avec un précompte mobilier réduit à 15% (au lieu de 30%).
- **Arbitrage intelligent** : Nos experts calculent au centime près le point de bascule entre cotisations sociales/IPP sur salaire et versement d'ISOC + dividendes.`,
    author: 'Paul Holl Mpeck, Conseil Fiscal certifié ITAA',
    readTime: '6 min'
  },
  {
    id: 'passage-en-societe-checklist',
    title: 'Création de société (SRL) : Les étapes indispensables et l\'obligation du Plan Financier Légal',
    slug: 'creation-srl-plan-financier-legal-belgique',
    date: '14 Septembre 2026',
    category: 'Création d\'entreprise',
    summary: 'Le Code des Sociétés et des Associations (CSA) a supprimé le capital minimum requis pour la SRL mais a renforcé la responsabilité des fondateurs à travers le Plan Financier Légal.',
    content: `Créer une SRL offre l'avantage majeur de séparer le patrimoine personnel du patrimoine professionnel. Cependant, les fondateurs engagent leur responsabilité personnelle pendant 3 ans si la société fait faillite en raison d'un capital de départ manifestement insuffisant.

### Les étapes encadrées par Fidcogest :
1. **Élaboration du Plan Financier Légal** rédigé et attesté par un expert-comptable certifié ITAA.
2. **Ouverture du compte bancaire professionnel** et attestation de dépôt.
3. **Passage de l'acte constitutif par-devant Notaire**.
4. **Immatriculation auprès de la Banque-Carrefour des Entreprises (BCE)**.
5. **Activation du numéro de TVA** et affiliation à la caisse d'assurances sociales.`,
    author: 'Paul Holl Mpeck, Expert-Comptable certifié ITAA',
    readTime: '5 min'
  }
];

export const PRACTICAL_GUIDES = [
  {
    id: 'guide-frais-deductibles',
    title: 'Guide des Frais Professionnels Déductibles 2026',
    format: 'PDF (28 pages)',
    description: 'La liste exhaustive et actualisée des charges déductibles en Belgique : voiture de société, frais de bureau à domicile, restaurant, téléphone, matériel informatique et cadeaux d\'affaires.',
    filename: 'Fidcogest_Guide_Frais_Deductibles_2026.pdf'
  },
  {
    id: 'checklist-starter',
    title: 'Checklist du Créateur d\'Entreprise & Plan Financier',
    format: 'PDF + Tableur',
    description: 'Modèle interactif et liste de vérification étape par étape pour réussir la constitution de votre SRL ou le lancement de votre activité d\'indépendant.',
    filename: 'Fidcogest_Checklist_Starter_2026.pdf'
  },
  {
    id: 'guide-cloture-comptable',
    title: 'Guide de Préparation à la Clôture et Bilan BNB',
    format: 'PDF Checklist',
    description: 'Comment rassembler et vérifier vos pièces justificatives (inventaire, relevés de compte au 31/12, pièces de trésorerie) pour accélérer le dépôt du bilan annuel.',
    filename: 'Fidcogest_Guide_Cloture_Comptable.pdf'
  }
];

export const SOFTWARE_GATEWAYS = [
  {
    id: 'portail-client',
    name: 'Portail Client Sécurisé Fidcogest',
    category: 'Transmission Dématérialisée',
    description: 'Espace sécurisé de dépôt numérique des pièces comptables, factures d\'achat et justificatifs pour un encodage sans papier et un archivage certifié 10 ans.',
    badge: 'Plateforme Sécurisée'
  },
  {
    id: 'peppol',
    name: 'Réseau Peppol B2B',
    category: 'Facturation Électronique Structurée',
    description: 'Identifiant PEPPOL officiel de Fidcogest (0208:0899441309) pour l\'échange automatisé de factures XML UBL conformes à l\'obligation 2026.',
    badge: 'Norme Légale 2026'
  },
  {
    id: 'exact',
    name: 'Exact Online',
    category: 'Gestion Comptable ERP',
    description: 'Progiciel de gestion intégré pour PME avec synchronisation des écritures comptables.',
    badge: 'Connexion Partenaire'
  },
  {
    id: 'myminfin',
    name: 'MyMinfin (SPF Finances)',
    category: 'Portail Officiel État Belge',
    description: 'Accès direct aux avis d\'imposition, attestations de non-dette fiscale et mandats d\'expert-comptable certifié.',
    badge: 'Lien Officiel SPF'
  }
];
