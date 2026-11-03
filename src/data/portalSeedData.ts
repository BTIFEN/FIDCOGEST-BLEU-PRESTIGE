import {
  CompanyDossier,
  PortalUser,
  PortalDocument,
  MissingDocumentRequest,
  PortalMessage,
  SecurityAuditLog
} from '../types/portal';

export const SEED_COMPANIES: CompanyDossier[] = [
  {
    id: 'cie-1',
    legalName: 'SRL Immobilière Louise',
    legalForm: 'SRL',
    vatNumber: 'BE 0824.512.390',
    bceNumber: '0824.512.390',
    address: 'Avenue de la Toison d’Or 44',
    city: 'Bruxelles (Ixelles)',
    postalCode: '1050',
    assignedManagerId: 'usr-manager-1',
    assignedManagerName: 'Sarah Benali',
    clientUserIds: ['usr-client-1'],
    contactEmail: 'marie.vandamme@louise-immo.be',
    contactPhone: '+32 2 511 88 90',
    accountingRegime: 'Régime Trimestriel',
    fiscalYearEnd: '31/12',
    status: 'actif'
  },
  {
    id: 'cie-2',
    legalName: 'Sprl Brasserie de Ganshoren',
    legalForm: 'SPRL',
    vatNumber: 'BE 0698.441.221',
    bceNumber: '0698.441.221',
    address: 'Place Communale 12',
    city: 'Ganshoren (Bruxelles)',
    postalCode: '1083',
    assignedManagerId: 'usr-supervisor-1',
    assignedManagerName: 'Paul Holl Mpeck (ITAA)',
    clientUserIds: ['usr-client-1'],
    contactEmail: 'direction@brasserieganshoren.be',
    contactPhone: '+32 2 425 77 14',
    accountingRegime: 'Régime Mensuel',
    fiscalYearEnd: '31/12',
    status: 'actif'
  },
  {
    id: 'cie-3',
    legalName: 'BVBA TechConsult Solutions',
    legalForm: 'BVBA',
    vatNumber: 'BE 0712.983.456',
    bceNumber: '0712.983.456',
    address: 'Luchthavenlaan 28',
    city: 'Vilvoorde / Bruxelles Nord',
    postalCode: '1800',
    assignedManagerId: 'usr-manager-1',
    assignedManagerName: 'Sarah Benali',
    clientUserIds: ['usr-client-2'],
    contactEmail: 'philippe@techconsult.be',
    contactPhone: '+32 2 720 44 00',
    accountingRegime: 'Régime Trimestriel',
    fiscalYearEnd: '31/12',
    status: 'actif'
  },
  {
    id: 'cie-4',
    legalName: 'Cabinet Médical Dr. Laurent SPRL',
    legalForm: 'SPRL',
    vatNumber: 'BE 0845.120.987',
    bceNumber: '0845.120.987',
    address: 'Boulevard de Smet de Naeyer 210',
    city: 'Jette',
    postalCode: '1090',
    assignedManagerId: 'usr-supervisor-1',
    assignedManagerName: 'Paul Holl Mpeck (ITAA)',
    clientUserIds: [],
    contactEmail: 'secretariat@drlaurent.be',
    contactPhone: '+32 2 478 33 12',
    accountingRegime: 'Franchise',
    fiscalYearEnd: '31/12',
    status: 'actif'
  }
];

export const SEED_USERS: PortalUser[] = [
  {
    id: 'usr-client-1',
    email: 'marie.vandamme@louise-immo.be',
    fullName: 'Marie Vandamme',
    role: 'client',
    phone: '+32 475 22 33 44',
    assignedCompanyIds: ['cie-1', 'cie-2'],
    status: 'actif',
    mfaEnabled: true,
    lastLoginAt: '2026-11-02 14:15',
    createdAt: '2024-03-10'
  },
  {
    id: 'usr-client-2',
    email: 'philippe@techconsult.be',
    fullName: 'Philippe De Smet',
    role: 'client',
    phone: '+32 486 99 88 77',
    assignedCompanyIds: ['cie-3'],
    status: 'actif',
    mfaEnabled: true,
    lastLoginAt: '2026-11-01 09:30',
    createdAt: '2024-06-15'
  },
  {
    id: 'usr-client-pending',
    email: 'luc.dupont@innovatech.be',
    fullName: 'Luc Dupont (Nouveau Client)',
    role: 'client',
    assignedCompanyIds: [],
    status: 'en_attente_invitation',
    mfaEnabled: false,
    inviteToken: 'FIDCO-INV-7928-ABC',
    inviteExpiresAt: '2026-11-05 18:00',
    createdAt: '2026-11-02'
  },
  {
    id: 'usr-manager-1',
    email: 'sarah.benali@fidcogest.be',
    fullName: 'Sarah Benali',
    role: 'manager',
    phone: '+32 2 425 18 58',
    assignedCompanyIds: ['cie-1', 'cie-3'],
    status: 'actif',
    mfaEnabled: true,
    lastLoginAt: '2026-11-02 14:28',
    createdAt: '2022-09-01'
  },
  {
    id: 'usr-supervisor-1',
    email: 'paul.mpeck@fidcogest.be',
    fullName: 'Paul Holl Mpeck (Expert ITAA)',
    role: 'supervisor',
    phone: '+32 2 425 18 58',
    assignedCompanyIds: ['cie-1', 'cie-2', 'cie-3', 'cie-4'],
    status: 'actif',
    mfaEnabled: true,
    lastLoginAt: '2026-11-02 14:20',
    createdAt: '2008-01-01'
  },
  {
    id: 'usr-admin-1',
    email: 'admin@fidcogest.be',
    fullName: 'Administrateur Cabinet Fidcogest',
    role: 'admin',
    phone: '+32 2 425 18 58',
    assignedCompanyIds: ['cie-1', 'cie-2', 'cie-3', 'cie-4'],
    status: 'actif',
    mfaEnabled: true,
    lastLoginAt: '2026-11-02 14:00',
    createdAt: '2008-01-01'
  }
];

export const SEED_DOCUMENTS: PortalDocument[] = [
  {
    id: 'doc-101',
    companyId: 'cie-1',
    uploadedByUserId: 'usr-client-1',
    uploadedByUserName: 'Marie Vandamme',
    category: 'achats',
    filename: 'Facture_Proximus_Business_Mars2026.pdf',
    originalFilename: 'Proximus_Facture_Mars_2026.pdf',
    fileType: 'pdf',
    fileSizeKb: 248,
    status: 'traite',
    ocrData: {
      vendorName: 'Proximus SA',
      invoiceNumber: 'PROX-2026-039182',
      date: '2026-03-12',
      amountHtEur: 120.00,
      vatRatePercent: 21,
      vatAmountEur: 25.20,
      totalTtcEur: 145.20,
      confidenceScore: 98,
      isDuplicateDetected: false
    },
    notes: 'Abonnement fibre optique et ligne mobile professionnelle.',
    createdAt: '2026-03-15 10:20',
    updatedAt: '2026-03-16 11:00',
    storagePath: '/private/vault/cie-1/2026/03/doc-101.pdf',
    history: [
      {
        id: 'hist-1',
        action: 'Dépôt du fichier par le client',
        authorName: 'Marie Vandamme',
        authorRole: 'client',
        timestamp: '2026-03-15 10:20'
      },
      {
        id: 'hist-2',
        action: 'Extraction OCR automatique validée',
        authorName: 'Sarah Benali',
        authorRole: 'manager',
        timestamp: '2026-03-16 10:45',
        details: 'Données vérifiées et conformes (TTC: 145.20 €)'
      },
      {
        id: 'hist-3',
        action: 'Écriture comptable imputée au journal des achats',
        authorName: 'Sarah Benali',
        authorRole: 'manager',
        timestamp: '2026-03-16 11:00',
        details: 'Compte 612000 Frais Télécom'
      }
    ]
  },
  {
    id: 'doc-102',
    companyId: 'cie-1',
    uploadedByUserId: 'usr-client-1',
    uploadedByUserName: 'Marie Vandamme',
    category: 'achats',
    filename: 'Facture_Sibelga_Electricite_Q1_2026.pdf',
    originalFilename: 'Facture_Sibelga_JanvFev.pdf',
    fileType: 'pdf',
    fileSizeKb: 380,
    status: 'accepte',
    ocrData: {
      vendorName: 'Sibelga SC',
      invoiceNumber: 'SIB-2026-44812',
      date: '2026-02-28',
      amountHtEur: 450.00,
      vatRatePercent: 21,
      vatAmountEur: 94.50,
      totalTtcEur: 544.50,
      confidenceScore: 96,
      isDuplicateDetected: false
    },
    notes: 'Consommation électrique bureaux Toison d’Or.',
    createdAt: '2026-03-02 14:10',
    updatedAt: '2026-03-03 09:15',
    storagePath: '/private/vault/cie-1/2026/02/doc-102.pdf',
    history: [
      {
        id: 'hist-4',
        action: 'Dépôt du fichier',
        authorName: 'Marie Vandamme',
        authorRole: 'client',
        timestamp: '2026-03-02 14:10'
      },
      {
        id: 'hist-5',
        action: 'Document accepté par le gestionnaire',
        authorName: 'Sarah Benali',
        authorRole: 'manager',
        timestamp: '2026-03-03 09:15'
      }
    ]
  },
  {
    id: 'doc-103',
    companyId: 'cie-1',
    uploadedByUserId: 'usr-client-1',
    uploadedByUserName: 'Marie Vandamme',
    category: 'frais',
    filename: 'Note_Restaurant_Roy_Espagne_12022026.jpg',
    originalFilename: 'IMG_4821_resto.jpg',
    fileType: 'jpg',
    fileSizeKb: 620,
    status: 'a_completer',
    ocrData: {
      vendorName: 'Le Roy d’Espagne Grand-Place',
      invoiceNumber: 'TKT-2026-884',
      date: '2026-02-12',
      amountHtEur: 180.00,
      vatRatePercent: 12,
      vatAmountEur: 21.60,
      totalTtcEur: 201.60,
      confidenceScore: 78,
      isDuplicateDetected: false
    },
    notes: 'Ticket de souche manquant : seul le reçu carte bancaire sans détail TVA a été transmis.',
    missingInfoReason: 'Veuillez joindre la note détaillée avec la ventilation TVA (12% nourriture / 21% boissons) et le nom des clients invités.',
    createdAt: '2026-02-14 16:40',
    updatedAt: '2026-02-15 10:00',
    storagePath: '/private/vault/cie-1/2026/02/doc-103.jpg',
    history: [
      {
        id: 'hist-6',
        action: 'Dépôt via smartphone',
        authorName: 'Marie Vandamme',
        authorRole: 'client',
        timestamp: '2026-02-14 16:40'
      },
      {
        id: 'hist-7',
        action: 'Statut passé à : À compléter',
        authorName: 'Sarah Benali',
        authorRole: 'manager',
        timestamp: '2026-02-15 10:00',
        details: 'Demande de note fiscale avec ventilation TVA transmise au client'
      }
    ]
  },
  {
    id: 'doc-104',
    companyId: 'cie-1',
    uploadedByUserId: 'usr-client-1',
    uploadedByUserName: 'Marie Vandamme',
    category: 'banque',
    filename: 'Extrait_BNP_Paribas_Fortis_Fevrier2026.pdf',
    originalFilename: 'Extrait_02_2026.pdf',
    fileType: 'pdf',
    fileSizeKb: 195,
    status: 'en_verification',
    ocrData: {
      vendorName: 'BNP Paribas Fortis',
      invoiceNumber: 'EXT-2026-02',
      date: '2026-02-28',
      amountHtEur: 0,
      vatRatePercent: 0,
      vatAmountEur: 0,
      totalTtcEur: 0,
      confidenceScore: 92,
      isDuplicateDetected: false
    },
    notes: 'Relevé bancaire mensuel avec solde final à rapprocher.',
    createdAt: '2026-03-01 08:30',
    updatedAt: '2026-03-01 08:30',
    storagePath: '/private/vault/cie-1/2026/02/doc-104.pdf',
    history: [
      {
        id: 'hist-8',
        action: 'Dépôt du relevé bancaire',
        authorName: 'Marie Vandamme',
        authorRole: 'client',
        timestamp: '2026-03-01 08:30'
      }
    ]
  },
  {
    id: 'doc-105',
    companyId: 'cie-1',
    uploadedByUserId: 'usr-client-1',
    uploadedByUserName: 'Marie Vandamme',
    category: 'achats',
    filename: 'Facture_Securitas_Surveillance_Fevrier2026_COPIE.pdf',
    originalFilename: 'Securitas_Inv_Fevrier.pdf',
    fileType: 'pdf',
    fileSizeKb: 210,
    status: 'en_verification',
    ocrData: {
      vendorName: 'Securitas Services SA',
      invoiceNumber: 'SEC-2026-99014',
      date: '2026-02-05',
      amountHtEur: 280.00,
      vatRatePercent: 21,
      vatAmountEur: 58.80,
      totalTtcEur: 338.80,
      confidenceScore: 99,
      isDuplicateDetected: true,
      duplicateReason: 'Facture identique (Numéro SEC-2026-99014 & Montant 338.80 €) déjà enregistrée le 08/02/2026.',
      duplicateOfDocId: 'doc-101'
    },
    notes: '⚠️ Doublon potentiel détecté automatiquement par le système.',
    createdAt: '2026-03-02 11:15',
    updatedAt: '2026-03-02 11:15',
    storagePath: '/private/vault/cie-1/2026/02/doc-105.pdf',
    history: [
      {
        id: 'hist-9',
        action: 'Dépôt de fichier - Alerte doublon déclenchée',
        authorName: 'Marie Vandamme',
        authorRole: 'client',
        timestamp: '2026-03-02 11:15',
        details: 'Moteur anti-doublon : Facture Securitas SEC-2026-99014'
      }
    ]
  },
  {
    id: 'doc-106',
    companyId: 'cie-2',
    uploadedByUserId: 'usr-client-1',
    uploadedByUserName: 'Marie Vandamme',
    category: 'achats',
    filename: 'Facture_Horeca_Boissons_Duvel_Moortgat.pdf',
    originalFilename: 'Duvel_Moortgat_Facture_Mars2026.pdf',
    fileType: 'pdf',
    fileSizeKb: 310,
    status: 'recu',
    ocrData: {
      vendorName: 'Duvel Moortgat SA',
      invoiceNumber: 'DUV-2026-7812',
      date: '2026-03-10',
      amountHtEur: 1420.00,
      vatRatePercent: 21,
      vatAmountEur: 298.20,
      totalTtcEur: 1718.20,
      confidenceScore: 94,
      isDuplicateDetected: false
    },
    notes: 'Livraison fûts et caisses pour la Brasserie de Ganshoren.',
    createdAt: '2026-03-11 15:45',
    updatedAt: '2026-03-11 15:45',
    storagePath: '/private/vault/cie-2/2026/03/doc-106.pdf',
    history: [
      {
        id: 'hist-10',
        action: 'Dépôt reçu sur le serveur',
        authorName: 'Marie Vandamme',
        authorRole: 'client',
        timestamp: '2026-03-11 15:45'
      }
    ]
  },
  {
    id: 'doc-107',
    companyId: 'cie-3',
    uploadedByUserId: 'usr-client-2',
    uploadedByUserName: 'Philippe De Smet',
    category: 'ventes',
    filename: 'Facture_Prestation_Audit_Cloud_TechConsult.pdf',
    originalFilename: 'Facture_Client_AuditCloud.pdf',
    fileType: 'pdf',
    fileSizeKb: 185,
    status: 'traite',
    ocrData: {
      vendorName: 'TechConsult Solutions BVBA',
      invoiceNumber: 'TC-2026-014',
      date: '2026-02-20',
      amountHtEur: 3200.00,
      vatRatePercent: 21,
      vatAmountEur: 672.00,
      totalTtcEur: 3872.00,
      confidenceScore: 97,
      isDuplicateDetected: false
    },
    notes: 'Prestation conseil architecture cloud Q1.',
    createdAt: '2026-02-21 17:00',
    updatedAt: '2026-02-22 10:15',
    storagePath: '/private/vault/cie-3/2026/02/doc-107.pdf',
    history: [
      {
        id: 'hist-11',
        action: 'Dépôt par Philippe De Smet',
        authorName: 'Philippe De Smet',
        authorRole: 'client',
        timestamp: '2026-02-21 17:00'
      },
      {
        id: 'hist-12',
        action: 'Validation et comptabilisation au journal des ventes',
        authorName: 'Sarah Benali',
        authorRole: 'manager',
        timestamp: '2026-02-22 10:15'
      }
    ]
  }
];

export const SEED_MISSING_REQUESTS: MissingDocumentRequest[] = [
  {
    id: 'req-1',
    companyId: 'cie-1',
    requestedByUserId: 'usr-manager-1',
    requestedByUserName: 'Sarah Benali',
    title: 'Note de restaurant détaillée (Déjeuner Le Roy d’Espagne)',
    description: 'Il manque le ticket de caisse avec le détail des taux de TVA (12% / 21%) et la liste des participants pour déductibilité fiscale à 69%.',
    period: 'Février 2026',
    urgency: 'urgente',
    status: 'en_attente',
    createdAt: '2026-02-15 10:05'
  },
  {
    id: 'req-2',
    companyId: 'cie-1',
    requestedByUserId: 'usr-manager-1',
    requestedByUserName: 'Sarah Benali',
    title: 'Attestation assurance responsabilité civile professionnelle 2026',
    description: 'Merci de déposer l’attestation de paiement annuelle de la prime RC Pro délivrée par votre courtier.',
    period: 'Exercice 2026',
    urgency: 'normale',
    status: 'en_attente',
    createdAt: '2026-03-01 11:30'
  },
  {
    id: 'req-3',
    companyId: 'cie-2',
    requestedByUserId: 'usr-supervisor-1',
    requestedByUserName: 'Paul Holl Mpeck (ITAA)',
    title: 'Rapport mensuel de clôture de caisse enregistreuse certifiée (FDM)',
    description: 'Relevé mensuel Z du module fiscal de caisse enregistreuse horeca pour le mois de Février 2026.',
    period: 'Février 2026',
    urgency: 'urgente',
    status: 'en_attente',
    createdAt: '2026-03-02 09:00'
  }
];

export const SEED_MESSAGES: PortalMessage[] = [
  {
    id: 'msg-1',
    companyId: 'cie-1',
    authorId: 'usr-manager-1',
    authorName: 'Sarah Benali (Gestionnaire)',
    authorRole: 'manager',
    content: 'Bonjour Mme Vandamme. Vos factures Proximus et Sibelga ont bien été validées et imputées. N\'oubliez pas de nous joindre le ticket détaillé du restaurant Roy d\'Espagne pour la clôture TVA.',
    timestamp: '2026-03-16 11:15',
    isRead: true
  },
  {
    id: 'msg-2',
    companyId: 'cie-1',
    authorId: 'usr-client-1',
    authorName: 'Marie Vandamme',
    authorRole: 'client',
    content: 'Bonjour Sarah, bien noté ! J’ai demandé au restaurant un duplicata de la note détaillée. Je vous la téléverse directement dès réception.',
    timestamp: '2026-03-16 14:30',
    isRead: true
  }
];

export const SEED_SECURITY_LOGS: SecurityAuditLog[] = [
  {
    id: 'log-1',
    timestamp: '2026-11-02 14:28:10',
    userId: 'usr-manager-1',
    userName: 'Sarah Benali',
    userRole: 'manager',
    action: 'Connexion Espace Gestionnaire (MFA Valide)',
    ipAddress: '194.154.210.12 (Bruxelles)',
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    status: 'succes',
    details: 'Authentification 2FA TOTP réussie.'
  },
  {
    id: 'log-2',
    timestamp: '2026-11-02 14:15:02',
    userId: 'usr-client-1',
    userName: 'Marie Vandamme',
    userRole: 'client',
    action: 'Connexion Espace Client Sécurisé',
    ipAddress: '85.27.134.50 (Bruxelles)',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4)',
    status: 'succes',
    details: 'Accès autorisé aux entreprises SRL Immobilière Louise et Sprl Brasserie de Ganshoren.'
  },
  {
    id: 'log-3',
    timestamp: '2026-11-02 13:50:22',
    userId: 'usr-client-1',
    userName: 'Marie Vandamme',
    userRole: 'client',
    action: 'Téléversement document PDF',
    ipAddress: '85.27.134.50 (Bruxelles)',
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4)',
    status: 'succes',
    details: 'Fichier Facture_Proximus_Business_Mars2026.pdf (248 Ko) déposé dans l’espace privé cie-1.'
  },
  {
    id: 'log-4',
    timestamp: '2026-11-01 19:12:44',
    userId: 'unknown',
    userName: 'Inconnu',
    userRole: 'anonymous',
    action: 'Tentative d’accès direct sans jeton',
    ipAddress: '185.220.101.4 (Tor Exit Node)',
    userAgent: 'curl/7.68.0',
    status: 'alerte',
    details: 'Tentative d’accès bloquée à /api/portal/documents/doc-101. URL publique interdite.'
  }
];
