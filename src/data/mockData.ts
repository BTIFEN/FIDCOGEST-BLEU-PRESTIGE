import { TaxDeadline, ServicePole, TeamMember, NewsArticle, Testimonial } from '../types';

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
    description: 'Premier versement anticipé d\'Impôt des Sociétés pour bénéficier du bonification maximale (eviter majoration de 6.75%).',
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

export const SERVICE_POLES: ServicePole[] = [
  {
    id: 'comptabilite',
    title: 'Comptabilité Générale & Analytique',
    subtitle: 'Tenue, encodage, déclarations et bilans annuels BNB',
    iconName: 'Calculator',
    description: 'Gestion rigoureuse et numérisée de votre comptabilité conformément aux normes du Plan Comptable Minimum Normalisé (PCMN) belge.',
    keyFeatures: [
      'Encodage automatisé des factures via réseau Peppol & OCR',
      'Déclarations périodiques TVA et listing clients annuel',
      'Clôture des comptes, bilan officiel et annexe BNB',
      'Préparation et envoi des fiches 281.10 et 281.50'
    ],
    suitedFor: 'Sociétés (SRL, SA), Indépendants en personne physique, ASBL et professions libérales.'
  },
  {
    id: 'fiscalite',
    title: 'Fiscalité Stratégique & Optimisation',
    subtitle: 'IPP, ISOC, optimisation de rémunération et défense fiscale',
    iconName: 'TrendingUp',
    description: 'Conseil fiscal proactif pour maximiser vos revenus nets en toute légalité et sécuriser la situation fiscale de votre entreprise.',
    keyFeatures: [
      'Déclarations ISOC (Impôt des Sociétés) & IPP (Personnes Physiques)',
      'Optimisation Rémunération Dirigeant vs Dividendes (VVPR-bis 15%)',
      'Calcul et planificateur des Versements Anticipés (VA1 - VA4)',
      'Assistance et représentation lors des contrôles fiscaux'
    ],
    suitedFor: 'Dirigeants de PME, médecins, consultants, avocats et propriétaires de holdings.'
  },
  {
    id: 'starters',
    title: 'Accompagnement Starters & Création',
    subtitle: 'De l\'idée au lancement officiel de votre société',
    iconName: 'Rocket',
    description: 'Accompagnement complet pour valider la faisabilité économique, constituer le plan financier légal et immatriculer votre entreprise.',
    keyFeatures: [
      'Rédaction du Plan Financier Légal exigé par le Code des Sociétés',
      'Choix stratégique de la forme juridique (Personne Physique vs SRL)',
      'Démarches Guichet d\'Entreprise, BCE, activation du numéro TVA',
      'Accompagnement lors du rendez-vous auprès du Notaire'
    ],
    suitedFor: 'Porteurs de projets, créateurs d\'entreprise, indépendants complémentaires.'
  },
  {
    id: 'pilotage',
    title: 'Conseil de Gestion & Pilotage',
    subtitle: 'Tableaux de bord de trésorerie et rentabilité en temps réel',
    iconName: 'PieChart',
    description: 'Analyse financière avancée pour transformer vos chiffres comptables en levier de décision stratégique et de croissance.',
    keyFeatures: [
      'Tableaux de bord de trésorerie trimestriels et situations intermédiaires',
      'Analyse des coûts, marges brutes et seuil de rentabilité',
      'Budget prévisionnel et plans d\'investissement matériels',
      'Conseil en restructuration et passage en société holding'
    ],
    suitedFor: 'PME en expansion, sociétés industrielles, commerces et réseaux de franchise.'
  }
];

export const TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'marc-vdb',
    name: 'Marc Van den Berghe',
    role: 'Associé Fondateur • Expert-comptable & Conseiller fiscal certifié ITAA',
    itaaNumber: 'ITAA 10.842.109',
    bio: 'Plus de 18 ans d\'expérience en fiscalité des sociétés (ISOC), restructurations d\'entreprises et accompagnement stratégique des dirigeants en Belgique.',
    specialties: ['Optimisation ISOC & Holdings', 'Contrôles Fiscaux complexes', 'Planification Successorale'],
    email: 'm.vandenberghe@fidcogest.be',
    location: 'Bruxelles Louise'
  },
  {
    id: 'sophie-laurent',
    name: 'Sophie Laurent',
    role: 'Associée • Conseiller fiscal certifié ITAA',
    itaaNumber: 'ITAA 10.915.420',
    bio: 'Spécialiste de la fiscalité des personnes physiques (IPP), des professions médicales et libérales et des régimes d\'optimisation de rémunération (VVPR-bis, Droits d\'Auteur).',
    specialties: ['Fiscalité des Indépendants', 'Professions Médicales & Avocats', 'Régime VVPR-bis'],
    email: 's.laurent@fidcogest.be',
    location: 'Mons / Wallonie'
  },
  {
    id: 'thomas-desmet',
    name: 'Thomas De Smet',
    role: 'Manager Département Comptable & Digitalization Peppol',
    itaaNumber: 'ITAA 11.022.311',
    bio: 'Expert en transformation digitale de la comptabilité, spécialiste de la facturation électronique Peppol 2026 et de l\'intégration des logiciels métiers (Billit, Exact, Yuki).',
    specialties: ['Facturation Électronique Peppol 2026', 'TVA Belge & Intracommunautaire', 'Logiciels Métiers'],
    email: 't.desmet@fidcogest.be',
    location: 'Bruxelles Louise'
  }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 'test-1',
    clientName: 'Alexandre Dubois',
    roleCompany: 'Fondateur & CEO • Nexa Digital SRL',
    companyType: 'SRL',
    quote: 'Fidcogest a rédigé notre plan financier légal lors de la création de la SRL et optimisé notre structure de rémunération. Grâce à la passerelle numérique et au suivi proactif des versements anticipés, nous n\'avons plus aucune mauvaise surprise fiscale !',
    rating: 5,
    location: 'Bruxelles (Ixelles)'
  },
  {
    id: 'test-2',
    clientName: 'Dr. Valérie Moreau',
    roleCompany: 'Médecin Spécialiste',
    companyType: 'Profession Libérale',
    quote: 'Un cabinet comptable d\'une réactivité exceptionnelle. Sophie Laurent comprend parfaitement les spécificités de la fiscalité médicale et m\'a permis de faire la transition vers une société médicale en toute sérénité.',
    rating: 5,
    location: 'Mons'
  },
  {
    id: 'test-3',
    clientName: 'Laurent Peeters',
    roleCompany: 'Consultant Senior en Cybersécurité',
    companyType: 'Indépendant',
    quote: 'L\'outil de dépôt de pièces sur le portail Fidcogest et le module WhatsApp me font gagner un temps précieux chaque mois. Réponses claires, honoraires forfaitaires transparents : je recommande vivement.',
    rating: 5,
    location: 'Namur'
  }
];

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
1. **Format obligatoire** : Envoi et réception automatisés via un logiciel compatible Peppol (Billit, Exact, Yuki, WinBooks).
2. **Déduction fiscale avantageuse** : Déduction majorée pour l'acquisition de logiciels de facturation électronique et frais de conseil associés.
3. **Période de transition** : Le cabinet Fidcogest équipe dès aujourd'hui l'ensemble de ses clients de la passerelle Peppol certifiée.

N'attendez pas l'échéance : contactez notre département digital pour activer votre canal Peppol sans surcoût.`,
    author: 'Thomas De Smet, ITAA 11.022.311',
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
    author: 'Marc Van den Berghe, ITAA 10.842.109',
    readTime: '6 min'
  },
  {
    id: 'passage-en-societe-checklist',
    title: 'Création de société (SRL) : Les 5 étapes indispensables et l\'obligation du Plan Financier Légal',
    slug: 'creation-srl-plan-financier-legal-belgique',
    date: '14 Septembre 2026',
    category: 'Création d\'entreprise',
    summary: 'Le Code des Sociétés et des Associations (CSA) a supprimé le capital minimum requis pour la SRL mais a renforcé la responsabilité des fondateurs à travers le Plan Financier Légal.',
    content: `Créer une SRL offre l'avantage majeur de séparer le patrimoine personnel du patrimoine professionnel. Cependant, les fondateurs engagent leur responsabilité personnelle pendant 3 ans si la société fait faillite en raison d'un capital de départ manifestement insuffisant.

### Les 5 étapes encadrées par Fidcogest :
1. **Élaboration du Plan Financier Légal** rédigé par un expert-comptable certifié ITAA.
2. **Ouverture du compte bancaire professionnel** et attestation de dépôt.
3. **Passage de l'acte constitutif par-devant Notaire**.
4. **Immatriculation auprès de la Banque-Carrefour des Entreprises (BCE)**.
5. **Activation du numéro de TVA** et affiliation à la caisse d'assurances sociales.`,
    author: 'Sophie Laurent, ITAA 10.915.420',
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
    format: 'PDF + Tableur Excel',
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
    id: 'billit',
    name: 'Billit',
    category: 'Facturation & Peppol',
    description: 'Plateforme de facturation électronique certifiée Peppol connectée en temps réel au cabinet Fidcogest.',
    badge: 'Intégration Directe'
  },
  {
    id: 'exact',
    name: 'Exact Online',
    category: 'Gestion Comptable ERP',
    description: 'Progiciel de gestion intégré pour PME avec synchronisation automatique des écritures comptables.',
    badge: 'Connexion API'
  },
  {
    id: 'yuki',
    name: 'Yuki Accounting',
    category: 'Comptabilité 100% Cloud',
    description: 'Traitement en temps réel des factures scannées et suivi bancaire automatisé.',
    badge: 'Partenaire Certifié'
  },
  {
    id: 'myminfin',
    name: 'MyMinfin (SPF Finances)',
    category: 'Portail Officiel État Belge',
    description: 'Accès direct aux avis d\'imposition, attestation de non-dette fiscale et mandats d\'expert-comptable.',
    badge: 'Lien Sécurisé'
  }
];
