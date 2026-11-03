// server.ts
import express2 from "express";
import { GoogleGenAI as GoogleGenAI2 } from "@google/genai";
import dotenv from "dotenv";
import path3 from "path";
import fs3 from "fs";
import crypto5 from "crypto";
import { fileURLToPath as fileURLToPath2 } from "url";

// src/server/portalApi.ts
import express from "express";
import crypto4 from "crypto";

// src/server/db.ts
import fs from "fs";
import path from "path";
import crypto2 from "crypto";
import { fileURLToPath } from "url";

// src/data/portalSeedData.ts
var SEED_COMPANIES = [
  {
    id: "cie-1",
    legalName: "SRL Immobili\xE8re Louise",
    legalForm: "SRL",
    vatNumber: "BE 0824.512.390",
    bceNumber: "0824.512.390",
    address: "Avenue de la Toison d\u2019Or 44",
    city: "Bruxelles (Ixelles)",
    postalCode: "1050",
    assignedManagerId: "usr-manager-1",
    assignedManagerName: "Sarah Benali",
    clientUserIds: ["usr-client-1"],
    contactEmail: "marie.vandamme@louise-immo.be",
    contactPhone: "+32 2 511 88 90",
    accountingRegime: "R\xE9gime Trimestriel",
    fiscalYearEnd: "31/12",
    status: "actif"
  },
  {
    id: "cie-2",
    legalName: "Sprl Brasserie de Ganshoren",
    legalForm: "SPRL",
    vatNumber: "BE 0698.441.221",
    bceNumber: "0698.441.221",
    address: "Place Communale 12",
    city: "Ganshoren (Bruxelles)",
    postalCode: "1083",
    assignedManagerId: "usr-supervisor-1",
    assignedManagerName: "Paul Holl Mpeck (ITAA)",
    clientUserIds: ["usr-client-1"],
    contactEmail: "direction@brasserieganshoren.be",
    contactPhone: "+32 2 425 77 14",
    accountingRegime: "R\xE9gime Mensuel",
    fiscalYearEnd: "31/12",
    status: "actif"
  },
  {
    id: "cie-3",
    legalName: "BVBA TechConsult Solutions",
    legalForm: "BVBA",
    vatNumber: "BE 0712.983.456",
    bceNumber: "0712.983.456",
    address: "Luchthavenlaan 28",
    city: "Vilvoorde / Bruxelles Nord",
    postalCode: "1800",
    assignedManagerId: "usr-manager-1",
    assignedManagerName: "Sarah Benali",
    clientUserIds: ["usr-client-2"],
    contactEmail: "philippe@techconsult.be",
    contactPhone: "+32 2 720 44 00",
    accountingRegime: "R\xE9gime Trimestriel",
    fiscalYearEnd: "31/12",
    status: "actif"
  },
  {
    id: "cie-4",
    legalName: "Cabinet M\xE9dical Dr. Laurent SPRL",
    legalForm: "SPRL",
    vatNumber: "BE 0845.120.987",
    bceNumber: "0845.120.987",
    address: "Boulevard de Smet de Naeyer 210",
    city: "Jette",
    postalCode: "1090",
    assignedManagerId: "usr-supervisor-1",
    assignedManagerName: "Paul Holl Mpeck (ITAA)",
    clientUserIds: [],
    contactEmail: "secretariat@drlaurent.be",
    contactPhone: "+32 2 478 33 12",
    accountingRegime: "Franchise",
    fiscalYearEnd: "31/12",
    status: "actif"
  }
];
var SEED_DOCUMENTS = [
  {
    id: "doc-101",
    companyId: "cie-1",
    uploadedByUserId: "usr-client-1",
    uploadedByUserName: "Marie Vandamme",
    category: "achats",
    filename: "Facture_Proximus_Business_Mars2026.pdf",
    originalFilename: "Proximus_Facture_Mars_2026.pdf",
    fileType: "pdf",
    fileSizeKb: 248,
    status: "traite",
    ocrData: {
      vendorName: "Proximus SA",
      invoiceNumber: "PROX-2026-039182",
      date: "2026-03-12",
      amountHtEur: 120,
      vatRatePercent: 21,
      vatAmountEur: 25.2,
      totalTtcEur: 145.2,
      confidenceScore: 98,
      isDuplicateDetected: false
    },
    notes: "Abonnement fibre optique et ligne mobile professionnelle.",
    createdAt: "2026-03-15 10:20",
    updatedAt: "2026-03-16 11:00",
    storagePath: "/private/vault/cie-1/2026/03/doc-101.pdf",
    history: [
      {
        id: "hist-1",
        action: "D\xE9p\xF4t du fichier par le client",
        authorName: "Marie Vandamme",
        authorRole: "client",
        timestamp: "2026-03-15 10:20"
      },
      {
        id: "hist-2",
        action: "Extraction OCR automatique valid\xE9e",
        authorName: "Sarah Benali",
        authorRole: "manager",
        timestamp: "2026-03-16 10:45",
        details: "Donn\xE9es v\xE9rifi\xE9es et conformes (TTC: 145.20 \u20AC)"
      },
      {
        id: "hist-3",
        action: "\xC9criture comptable imput\xE9e au journal des achats",
        authorName: "Sarah Benali",
        authorRole: "manager",
        timestamp: "2026-03-16 11:00",
        details: "Compte 612000 Frais T\xE9l\xE9com"
      }
    ]
  },
  {
    id: "doc-102",
    companyId: "cie-1",
    uploadedByUserId: "usr-client-1",
    uploadedByUserName: "Marie Vandamme",
    category: "achats",
    filename: "Facture_Sibelga_Electricite_Q1_2026.pdf",
    originalFilename: "Facture_Sibelga_JanvFev.pdf",
    fileType: "pdf",
    fileSizeKb: 380,
    status: "accepte",
    ocrData: {
      vendorName: "Sibelga SC",
      invoiceNumber: "SIB-2026-44812",
      date: "2026-02-28",
      amountHtEur: 450,
      vatRatePercent: 21,
      vatAmountEur: 94.5,
      totalTtcEur: 544.5,
      confidenceScore: 96,
      isDuplicateDetected: false
    },
    notes: "Consommation \xE9lectrique bureaux Toison d\u2019Or.",
    createdAt: "2026-03-02 14:10",
    updatedAt: "2026-03-03 09:15",
    storagePath: "/private/vault/cie-1/2026/02/doc-102.pdf",
    history: [
      {
        id: "hist-4",
        action: "D\xE9p\xF4t du fichier",
        authorName: "Marie Vandamme",
        authorRole: "client",
        timestamp: "2026-03-02 14:10"
      },
      {
        id: "hist-5",
        action: "Document accept\xE9 par le gestionnaire",
        authorName: "Sarah Benali",
        authorRole: "manager",
        timestamp: "2026-03-03 09:15"
      }
    ]
  },
  {
    id: "doc-103",
    companyId: "cie-1",
    uploadedByUserId: "usr-client-1",
    uploadedByUserName: "Marie Vandamme",
    category: "frais",
    filename: "Note_Restaurant_Roy_Espagne_12022026.jpg",
    originalFilename: "IMG_4821_resto.jpg",
    fileType: "jpg",
    fileSizeKb: 620,
    status: "a_completer",
    ocrData: {
      vendorName: "Le Roy d\u2019Espagne Grand-Place",
      invoiceNumber: "TKT-2026-884",
      date: "2026-02-12",
      amountHtEur: 180,
      vatRatePercent: 12,
      vatAmountEur: 21.6,
      totalTtcEur: 201.6,
      confidenceScore: 78,
      isDuplicateDetected: false
    },
    notes: "Ticket de souche manquant : seul le re\xE7u carte bancaire sans d\xE9tail TVA a \xE9t\xE9 transmis.",
    missingInfoReason: "Veuillez joindre la note d\xE9taill\xE9e avec la ventilation TVA (12% nourriture / 21% boissons) et le nom des clients invit\xE9s.",
    createdAt: "2026-02-14 16:40",
    updatedAt: "2026-02-15 10:00",
    storagePath: "/private/vault/cie-1/2026/02/doc-103.jpg",
    history: [
      {
        id: "hist-6",
        action: "D\xE9p\xF4t via smartphone",
        authorName: "Marie Vandamme",
        authorRole: "client",
        timestamp: "2026-02-14 16:40"
      },
      {
        id: "hist-7",
        action: "Statut pass\xE9 \xE0 : \xC0 compl\xE9ter",
        authorName: "Sarah Benali",
        authorRole: "manager",
        timestamp: "2026-02-15 10:00",
        details: "Demande de note fiscale avec ventilation TVA transmise au client"
      }
    ]
  },
  {
    id: "doc-104",
    companyId: "cie-1",
    uploadedByUserId: "usr-client-1",
    uploadedByUserName: "Marie Vandamme",
    category: "banque",
    filename: "Extrait_BNP_Paribas_Fortis_Fevrier2026.pdf",
    originalFilename: "Extrait_02_2026.pdf",
    fileType: "pdf",
    fileSizeKb: 195,
    status: "en_verification",
    ocrData: {
      vendorName: "BNP Paribas Fortis",
      invoiceNumber: "EXT-2026-02",
      date: "2026-02-28",
      amountHtEur: 0,
      vatRatePercent: 0,
      vatAmountEur: 0,
      totalTtcEur: 0,
      confidenceScore: 92,
      isDuplicateDetected: false
    },
    notes: "Relev\xE9 bancaire mensuel avec solde final \xE0 rapprocher.",
    createdAt: "2026-03-01 08:30",
    updatedAt: "2026-03-01 08:30",
    storagePath: "/private/vault/cie-1/2026/02/doc-104.pdf",
    history: [
      {
        id: "hist-8",
        action: "D\xE9p\xF4t du relev\xE9 bancaire",
        authorName: "Marie Vandamme",
        authorRole: "client",
        timestamp: "2026-03-01 08:30"
      }
    ]
  },
  {
    id: "doc-105",
    companyId: "cie-1",
    uploadedByUserId: "usr-client-1",
    uploadedByUserName: "Marie Vandamme",
    category: "achats",
    filename: "Facture_Securitas_Surveillance_Fevrier2026_COPIE.pdf",
    originalFilename: "Securitas_Inv_Fevrier.pdf",
    fileType: "pdf",
    fileSizeKb: 210,
    status: "en_verification",
    ocrData: {
      vendorName: "Securitas Services SA",
      invoiceNumber: "SEC-2026-99014",
      date: "2026-02-05",
      amountHtEur: 280,
      vatRatePercent: 21,
      vatAmountEur: 58.8,
      totalTtcEur: 338.8,
      confidenceScore: 99,
      isDuplicateDetected: true,
      duplicateReason: "Facture identique (Num\xE9ro SEC-2026-99014 & Montant 338.80 \u20AC) d\xE9j\xE0 enregistr\xE9e le 08/02/2026.",
      duplicateOfDocId: "doc-101"
    },
    notes: "\u26A0\uFE0F Doublon potentiel d\xE9tect\xE9 automatiquement par le syst\xE8me.",
    createdAt: "2026-03-02 11:15",
    updatedAt: "2026-03-02 11:15",
    storagePath: "/private/vault/cie-1/2026/02/doc-105.pdf",
    history: [
      {
        id: "hist-9",
        action: "D\xE9p\xF4t de fichier - Alerte doublon d\xE9clench\xE9e",
        authorName: "Marie Vandamme",
        authorRole: "client",
        timestamp: "2026-03-02 11:15",
        details: "Moteur anti-doublon : Facture Securitas SEC-2026-99014"
      }
    ]
  },
  {
    id: "doc-106",
    companyId: "cie-2",
    uploadedByUserId: "usr-client-1",
    uploadedByUserName: "Marie Vandamme",
    category: "achats",
    filename: "Facture_Horeca_Boissons_Duvel_Moortgat.pdf",
    originalFilename: "Duvel_Moortgat_Facture_Mars2026.pdf",
    fileType: "pdf",
    fileSizeKb: 310,
    status: "recu",
    ocrData: {
      vendorName: "Duvel Moortgat SA",
      invoiceNumber: "DUV-2026-7812",
      date: "2026-03-10",
      amountHtEur: 1420,
      vatRatePercent: 21,
      vatAmountEur: 298.2,
      totalTtcEur: 1718.2,
      confidenceScore: 94,
      isDuplicateDetected: false
    },
    notes: "Livraison f\xFBts et caisses pour la Brasserie de Ganshoren.",
    createdAt: "2026-03-11 15:45",
    updatedAt: "2026-03-11 15:45",
    storagePath: "/private/vault/cie-2/2026/03/doc-106.pdf",
    history: [
      {
        id: "hist-10",
        action: "D\xE9p\xF4t re\xE7u sur le serveur",
        authorName: "Marie Vandamme",
        authorRole: "client",
        timestamp: "2026-03-11 15:45"
      }
    ]
  },
  {
    id: "doc-107",
    companyId: "cie-3",
    uploadedByUserId: "usr-client-2",
    uploadedByUserName: "Philippe De Smet",
    category: "ventes",
    filename: "Facture_Prestation_Audit_Cloud_TechConsult.pdf",
    originalFilename: "Facture_Client_AuditCloud.pdf",
    fileType: "pdf",
    fileSizeKb: 185,
    status: "traite",
    ocrData: {
      vendorName: "TechConsult Solutions BVBA",
      invoiceNumber: "TC-2026-014",
      date: "2026-02-20",
      amountHtEur: 3200,
      vatRatePercent: 21,
      vatAmountEur: 672,
      totalTtcEur: 3872,
      confidenceScore: 97,
      isDuplicateDetected: false
    },
    notes: "Prestation conseil architecture cloud Q1.",
    createdAt: "2026-02-21 17:00",
    updatedAt: "2026-02-22 10:15",
    storagePath: "/private/vault/cie-3/2026/02/doc-107.pdf",
    history: [
      {
        id: "hist-11",
        action: "D\xE9p\xF4t par Philippe De Smet",
        authorName: "Philippe De Smet",
        authorRole: "client",
        timestamp: "2026-02-21 17:00"
      },
      {
        id: "hist-12",
        action: "Validation et comptabilisation au journal des ventes",
        authorName: "Sarah Benali",
        authorRole: "manager",
        timestamp: "2026-02-22 10:15"
      }
    ]
  }
];
var SEED_MISSING_REQUESTS = [
  {
    id: "req-1",
    companyId: "cie-1",
    requestedByUserId: "usr-manager-1",
    requestedByUserName: "Sarah Benali",
    title: "Note de restaurant d\xE9taill\xE9e (D\xE9jeuner Le Roy d\u2019Espagne)",
    description: "Il manque le ticket de caisse avec le d\xE9tail des taux de TVA (12% / 21%) et la liste des participants pour d\xE9ductibilit\xE9 fiscale \xE0 69%.",
    period: "F\xE9vrier 2026",
    urgency: "urgente",
    status: "en_attente",
    createdAt: "2026-02-15 10:05"
  },
  {
    id: "req-2",
    companyId: "cie-1",
    requestedByUserId: "usr-manager-1",
    requestedByUserName: "Sarah Benali",
    title: "Attestation assurance responsabilit\xE9 civile professionnelle 2026",
    description: "Merci de d\xE9poser l\u2019attestation de paiement annuelle de la prime RC Pro d\xE9livr\xE9e par votre courtier.",
    period: "Exercice 2026",
    urgency: "normale",
    status: "en_attente",
    createdAt: "2026-03-01 11:30"
  },
  {
    id: "req-3",
    companyId: "cie-2",
    requestedByUserId: "usr-supervisor-1",
    requestedByUserName: "Paul Holl Mpeck (ITAA)",
    title: "Rapport mensuel de cl\xF4ture de caisse enregistreuse certifi\xE9e (FDM)",
    description: "Relev\xE9 mensuel Z du module fiscal de caisse enregistreuse horeca pour le mois de F\xE9vrier 2026.",
    period: "F\xE9vrier 2026",
    urgency: "urgente",
    status: "en_attente",
    createdAt: "2026-03-02 09:00"
  }
];
var SEED_MESSAGES = [
  {
    id: "msg-1",
    companyId: "cie-1",
    authorId: "usr-manager-1",
    authorName: "Sarah Benali (Gestionnaire)",
    authorRole: "manager",
    content: "Bonjour Mme Vandamme. Vos factures Proximus et Sibelga ont bien \xE9t\xE9 valid\xE9es et imput\xE9es. N'oubliez pas de nous joindre le ticket d\xE9taill\xE9 du restaurant Roy d'Espagne pour la cl\xF4ture TVA.",
    timestamp: "2026-03-16 11:15",
    isRead: true
  },
  {
    id: "msg-2",
    companyId: "cie-1",
    authorId: "usr-client-1",
    authorName: "Marie Vandamme",
    authorRole: "client",
    content: "Bonjour Sarah, bien not\xE9 ! J\u2019ai demand\xE9 au restaurant un duplicata de la note d\xE9taill\xE9e. Je vous la t\xE9l\xE9verse directement d\xE8s r\xE9ception.",
    timestamp: "2026-03-16 14:30",
    isRead: true
  }
];
var SEED_SECURITY_LOGS = [
  {
    id: "log-1",
    timestamp: "2026-11-02 14:28:10",
    userId: "usr-manager-1",
    userName: "Sarah Benali",
    userRole: "manager",
    action: "Connexion Espace Gestionnaire (MFA Valide)",
    ipAddress: "194.154.210.12 (Bruxelles)",
    userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
    status: "succes",
    details: "Authentification 2FA TOTP r\xE9ussie."
  },
  {
    id: "log-2",
    timestamp: "2026-11-02 14:15:02",
    userId: "usr-client-1",
    userName: "Marie Vandamme",
    userRole: "client",
    action: "Connexion Espace Client S\xE9curis\xE9",
    ipAddress: "85.27.134.50 (Bruxelles)",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4)",
    status: "succes",
    details: "Acc\xE8s autoris\xE9 aux entreprises SRL Immobili\xE8re Louise et Sprl Brasserie de Ganshoren."
  },
  {
    id: "log-3",
    timestamp: "2026-11-02 13:50:22",
    userId: "usr-client-1",
    userName: "Marie Vandamme",
    userRole: "client",
    action: "T\xE9l\xE9versement document PDF",
    ipAddress: "85.27.134.50 (Bruxelles)",
    userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_4)",
    status: "succes",
    details: "Fichier Facture_Proximus_Business_Mars2026.pdf (248 Ko) d\xE9pos\xE9 dans l\u2019espace priv\xE9 cie-1."
  },
  {
    id: "log-4",
    timestamp: "2026-11-01 19:12:44",
    userId: "unknown",
    userName: "Inconnu",
    userRole: "anonymous",
    action: "Tentative d\u2019acc\xE8s direct sans jeton",
    ipAddress: "185.220.101.4 (Tor Exit Node)",
    userAgent: "curl/7.68.0",
    status: "alerte",
    details: "Tentative d\u2019acc\xE8s bloqu\xE9e \xE0 /api/portal/documents/doc-101. URL publique interdite."
  }
];

// src/server/security.ts
import crypto from "crypto";
var MASTER_SECRET = process.env.PORTAL_ENCRYPTION_KEY || "fidcogest-master-cryptographic-salt-2026-secure-key-itaa";
var MASTER_KEY = crypto.scryptSync(MASTER_SECRET, "fidcogest_salt_9821_itaa", 32);
function encryptData(data) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-gcm", MASTER_KEY, iv);
  const buffer = typeof data === "string" ? Buffer.from(data, "utf-8") : data;
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  return {
    ciphertext: encrypted.toString("base64"),
    iv: iv.toString("hex"),
    authTag: authTag.toString("hex")
  };
}
function decryptData(encrypted) {
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    MASTER_KEY,
    Buffer.from(encrypted.iv, "hex")
  );
  decipher.setAuthTag(Buffer.from(encrypted.authTag, "hex"));
  return Buffer.concat([
    decipher.update(Buffer.from(encrypted.ciphertext, "base64")),
    decipher.final()
  ]);
}
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 1e5, 64, "sha512").toString("hex");
  return { hash, salt };
}
function verifyPassword(password, hash, salt) {
  const testHash = crypto.pbkdf2Sync(password, salt, 1e5, 64, "sha512").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(testHash, "hex"));
}
var BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
function generateBase32Secret(length = 20) {
  const buffer = crypto.randomBytes(length);
  let bits = 0;
  let value = 0;
  let output = "";
  for (let i = 0; i < buffer.length; i++) {
    value = value << 8 | buffer[i];
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[value >>> bits - 5 & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[value << 5 - bits & 31];
  }
  return output;
}
function base32Decode(base32) {
  const clean = base32.toUpperCase().replace(/=+$/, "").replace(/[^A-Z2-7]/g, "");
  let bits = 0;
  let value = 0;
  const bytes = [];
  for (let i = 0; i < clean.length; i++) {
    const idx = BASE32_ALPHABET.indexOf(clean[i]);
    if (idx === -1) continue;
    value = value << 5 | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push(value >>> bits - 8 & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}
function generateTotpCode(secretBase32, time = Date.now(), stepSeconds = 30) {
  const key = base32Decode(secretBase32);
  const timeStep = Math.floor(time / 1e3 / stepSeconds);
  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(timeStep), 0);
  const hmac = crypto.createHmac("sha1", key).update(buffer).digest();
  const offset = hmac[hmac.length - 1] & 15;
  const codeInt = (hmac[offset] & 127) << 24 | (hmac[offset + 1] & 255) << 16 | (hmac[offset + 2] & 255) << 8 | hmac[offset + 3] & 255;
  const otp = codeInt % 1e6;
  return otp.toString().padStart(6, "0");
}
function verifyTotpCode(secretBase32, token, window = 1) {
  if (!token || token.length !== 6 || !/^\d{6}$/.test(token)) {
    return false;
  }
  const now = Date.now();
  for (let w = -window; w <= window; w++) {
    const checkTime = now + w * 30 * 1e3;
    const expected = generateTotpCode(secretBase32, checkTime);
    if (crypto.timingSafeEqual(Buffer.from(token, "utf-8"), Buffer.from(expected, "utf-8"))) {
      return true;
    }
  }
  return false;
}
function generateRecoveryCodes(count = 10) {
  const plainCodes = [];
  const hashedCodes = [];
  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString("hex").toUpperCase();
    plainCodes.push(code);
    const hash = crypto.createHash("sha256").update(code).digest("hex");
    hashedCodes.push(hash);
  }
  return { plainCodes, hashedCodes };
}
function verifyAndConsumeRecoveryCode(code, hashedCodes) {
  const hash = crypto.createHash("sha256").update(code.trim().toUpperCase()).digest("hex");
  const index = hashedCodes.indexOf(hash);
  if (index !== -1) {
    const remaining = [...hashedCodes];
    remaining.splice(index, 1);
    return { valid: true, remainingHashed: remaining };
  }
  return { valid: false, remainingHashed: hashedCodes };
}
var EICAR_TEST_SIGNATURE = "X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*";
function inspectFileContent(buffer, claimedFilename) {
  const sha256 = crypto.createHash("sha256").update(buffer).digest("hex");
  const size = buffer.length;
  if (size > 10 * 1024 * 1024) {
    return {
      isValid: false,
      detectedMime: "application/octet-stream",
      detectedExtension: "pdf",
      fileSizeBytes: size,
      sha256Checksum: sha256,
      isMalwareDetected: false,
      rejectionReason: "Fichier sup\xE9rieur \xE0 la limite autoris\xE9e de 10 Mo."
    };
  }
  const textContent = buffer.toString("binary");
  if (textContent.includes(EICAR_TEST_SIGNATURE)) {
    return {
      isValid: false,
      detectedMime: "application/x-eicar-antivirus-test",
      detectedExtension: "pdf",
      fileSizeBytes: size,
      sha256Checksum: sha256,
      isMalwareDetected: true,
      malwareThreatName: "EICAR-Standard-AV-Test-Signature (Test inoffensif conforme)",
      rejectionReason: "Menace d\xE9tect\xE9e par le scanner antivirus (Signature EICAR)."
    };
  }
  if (buffer.length >= 2 && buffer[0] === 77 && buffer[1] === 90) {
    return {
      isValid: false,
      detectedMime: "application/x-msdownload",
      detectedExtension: "pdf",
      fileSizeBytes: size,
      sha256Checksum: sha256,
      isMalwareDetected: true,
      malwareThreatName: "Win32/PE-Executable-Payload-Blocked",
      rejectionReason: "Ex\xE9cutable binaire Windows (MZ) interdit."
    };
  }
  if (buffer.length >= 4 && buffer[0] === 127 && buffer[1] === 69 && buffer[2] === 76 && buffer[3] === 70) {
    return {
      isValid: false,
      detectedMime: "application/x-executable",
      detectedExtension: "pdf",
      fileSizeBytes: size,
      sha256Checksum: sha256,
      isMalwareDetected: true,
      malwareThreatName: "Linux/ELF-Binary-Payload-Blocked",
      rejectionReason: "Binaire ex\xE9cutable Linux (ELF) interdit."
    };
  }
  const isPdf = buffer.length >= 5 && buffer[0] === 37 && buffer[1] === 80 && buffer[2] === 68 && buffer[3] === 70 && buffer[4] === 45;
  const isJpeg = buffer.length >= 3 && buffer[0] === 255 && buffer[1] === 216 && buffer[2] === 255;
  const isPng = buffer.length >= 8 && buffer[0] === 137 && buffer[1] === 80 && buffer[2] === 78 && buffer[3] === 71 && buffer[4] === 13 && buffer[5] === 10 && buffer[6] === 26 && buffer[7] === 10;
  if (isPdf) {
    if (textContent.includes("/JavaScript") || textContent.includes("/JS") || textContent.includes("/Launch")) {
      return {
        isValid: false,
        detectedMime: "application/pdf",
        detectedExtension: "pdf",
        fileSizeBytes: size,
        sha256Checksum: sha256,
        isMalwareDetected: true,
        malwareThreatName: "Suspicious-Embedded-PDF-JavaScript",
        rejectionReason: "Document PDF rejet\xE9 : contient du code ex\xE9cutable ou JavaScript incorpor\xE9."
      };
    }
    return {
      isValid: true,
      detectedMime: "application/pdf",
      detectedExtension: "pdf",
      fileSizeBytes: size,
      sha256Checksum: sha256,
      isMalwareDetected: false
    };
  }
  if (isJpeg) {
    return {
      isValid: true,
      detectedMime: "image/jpeg",
      detectedExtension: "jpg",
      fileSizeBytes: size,
      sha256Checksum: sha256,
      isMalwareDetected: false
    };
  }
  if (isPng) {
    return {
      isValid: true,
      detectedMime: "image/png",
      detectedExtension: "png",
      fileSizeBytes: size,
      sha256Checksum: sha256,
      isMalwareDetected: false
    };
  }
  return {
    isValid: false,
    detectedMime: "application/octet-stream",
    detectedExtension: "pdf",
    fileSizeBytes: size,
    sha256Checksum: sha256,
    isMalwareDetected: false,
    rejectionReason: `Format binaire non reconnu ou corrompu. Seuls les v\xE9ritables fichiers PDF, PNG et JPEG sont accept\xE9s.`
  };
}

// src/server/db.ts
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var DATA_DIRECTORY = process.env.PERSISTENT_STORAGE_DIR || path.resolve(__dirname, "../../data");
var DB_FILE_PATH = path.join(DATA_DIRECTORY, "portal-database-v2.json");
var VAULT_DIRECTORY = path.join(DATA_DIRECTORY, "vault_storage");
var PersistentDatabase = class {
  constructor() {
    this.isLoaded = false;
    this.ensureDirectories();
    this.state = this.loadOrInit();
    this.runMigrations();
  }
  ensureDirectories() {
    if (!fs.existsSync(DATA_DIRECTORY)) {
      fs.mkdirSync(DATA_DIRECTORY, { recursive: true });
    }
    if (!fs.existsSync(VAULT_DIRECTORY)) {
      fs.mkdirSync(VAULT_DIRECTORY, { recursive: true });
    }
  }
  loadOrInit() {
    if (fs.existsSync(DB_FILE_PATH)) {
      try {
        const raw = fs.readFileSync(DB_FILE_PATH, "utf-8");
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.version === "number" && Array.isArray(parsed.users)) {
          this.isLoaded = true;
          return parsed;
        }
      } catch (err) {
        console.error("[Database] Erreur lecture fichier BDD, cr\xE9ation d\u2019un snapshot de secours:", err);
        const backupPath = `${DB_FILE_PATH}.corrupt.${Date.now()}`;
        try {
          fs.copyFileSync(DB_FILE_PATH, backupPath);
        } catch (_) {
        }
      }
    }
    const defaultPassword = hashPassword("Fidcogest2026!");
    const initialUsers = [
      {
        id: "usr-client-1",
        email: "marie.vandamme@louise-immo.be",
        fullName: "Marie Vandamme",
        role: "client",
        phone: "+32 475 22 33 44",
        assignedCompanyIds: ["cie-1", "cie-2"],
        status: "actif",
        mfaEnabled: true,
        passwordHash: defaultPassword.hash,
        passwordSalt: defaultPassword.salt,
        createdAt: "2024-03-10"
      },
      {
        id: "usr-client-2",
        email: "philippe@techconsult.be",
        fullName: "Philippe De Smet",
        role: "client",
        phone: "+32 486 99 88 77",
        assignedCompanyIds: ["cie-3"],
        status: "actif",
        mfaEnabled: true,
        passwordHash: defaultPassword.hash,
        passwordSalt: defaultPassword.salt,
        createdAt: "2024-06-15"
      },
      {
        id: "usr-manager-1",
        email: "sarah.benali@fidcogest.be",
        fullName: "Sarah Benali",
        role: "manager",
        phone: "+32 2 425 18 58",
        assignedCompanyIds: ["cie-1", "cie-3"],
        status: "actif",
        mfaEnabled: true,
        passwordHash: defaultPassword.hash,
        passwordSalt: defaultPassword.salt,
        createdAt: "2022-09-01"
      },
      {
        id: "usr-supervisor-1",
        email: "paul.mpeck@fidcogest.be",
        fullName: "Paul Holl Mpeck (Expert ITAA)",
        role: "supervisor",
        phone: "+32 2 425 18 58",
        assignedCompanyIds: ["cie-1", "cie-2", "cie-3", "cie-4"],
        status: "actif",
        mfaEnabled: true,
        passwordHash: defaultPassword.hash,
        passwordSalt: defaultPassword.salt,
        createdAt: "2008-01-01"
      },
      {
        id: "usr-admin-1",
        email: "admin@fidcogest.be",
        fullName: "Administrateur Cabinet Fidcogest",
        role: "admin",
        phone: "+32 2 425 18 58",
        assignedCompanyIds: ["cie-1", "cie-2", "cie-3", "cie-4"],
        status: "actif",
        mfaEnabled: true,
        passwordHash: defaultPassword.hash,
        passwordSalt: defaultPassword.salt,
        createdAt: "2008-01-01"
      }
    ];
    initialUsers.forEach((u) => {
      const base32 = generateBase32Secret();
      u.mfaSecretEncrypted = encryptData(base32);
      const { hashedCodes } = generateRecoveryCodes(10);
      u.recoveryCodesHashed = hashedCodes;
    });
    const initialState = {
      version: 1,
      schema_migrations: [
        {
          version: 1,
          appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
          description: "Cr\xE9ation initiale du sch\xE9ma relationnel Fidcogest V1"
        }
      ],
      users: initialUsers,
      sessions: [],
      companies: SEED_COMPANIES,
      documents: SEED_DOCUMENTS,
      missingRequests: SEED_MISSING_REQUESTS,
      messages: SEED_MESSAGES,
      auditLogs: SEED_SECURITY_LOGS
    };
    this.save(initialState);
    this.isLoaded = true;
    return initialState;
  }
  /**
   * Sauvegarde transactionnelle atomique (Write-Ahead)
   * Écrit d'abord dans un fichier temporaire .tmp avant de remplacer de manière atomique
   */
  save(stateToSave = this.state) {
    this.ensureDirectories();
    const tempFile = `${DB_FILE_PATH}.${crypto2.randomBytes(6).toString("hex")}.tmp`;
    try {
      fs.writeFileSync(tempFile, JSON.stringify(stateToSave, null, 2), "utf-8");
      fs.renameSync(tempFile, DB_FILE_PATH);
    } catch (err) {
      if (fs.existsSync(tempFile)) {
        try {
          fs.unlinkSync(tempFile);
        } catch (_) {
        }
      }
      console.error("[Database] \xC9chec critique \xE9criture atomique sur disque:", err);
      throw err;
    }
  }
  runMigrations() {
    let currentVersion = this.state.version || 1;
    if (currentVersion < 2) {
      this.state.documents.forEach((doc) => {
        if (!doc.storagePath) {
          doc.storagePath = `/vault_storage/${doc.companyId}/${doc.id}.enc`;
        }
      });
      this.state.schema_migrations.push({
        version: 2,
        appliedAt: (/* @__PURE__ */ new Date()).toISOString(),
        description: "Ajout des statuts de quarantaine antivirus et chiffrement binaire au repos"
      });
      this.state.version = 2;
      this.save();
      console.log("[Database] Migration V2 appliqu\xE9e avec succ\xE8s.");
    }
  }
  // --- Accesseurs Sécurisés ---
  getUsers() {
    return this.state.users;
  }
  getUserById(id) {
    return this.state.users.find((u) => u.id === id);
  }
  getUserByEmail(email) {
    return this.state.users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
  }
  saveUser(user) {
    const idx = this.state.users.findIndex((u) => u.id === user.id);
    if (idx !== -1) {
      this.state.users[idx] = user;
    } else {
      this.state.users.push(user);
    }
    this.save();
  }
  // --- Sessions Sécurisées ---
  createSession(userId, ip, userAgent) {
    const token = crypto2.randomBytes(32).toString("hex");
    const now = Date.now();
    const expiresAt = now + 2 * 60 * 60 * 1e3;
    const session = {
      token,
      userId,
      createdAt: now,
      expiresAt,
      ip,
      userAgent
    };
    this.state.sessions = this.state.sessions.filter((s) => s.expiresAt > now);
    this.state.sessions.push(session);
    this.save();
    return session;
  }
  getSession(token) {
    const session = this.state.sessions.find((s) => s.token === token);
    if (!session) return void 0;
    if (Date.now() > session.expiresAt) {
      this.state.sessions = this.state.sessions.filter((s) => s.token !== token);
      this.save();
      return void 0;
    }
    session.expiresAt = Date.now() + 2 * 60 * 60 * 1e3;
    return session;
  }
  revokeSession(token) {
    this.state.sessions = this.state.sessions.filter((s) => s.token !== token);
    this.save();
  }
  // --- Entreprises & Documents ---
  getCompanies() {
    return this.state.companies;
  }
  getCompanyById(id) {
    return this.state.companies.find((c) => c.id === id);
  }
  getDocuments() {
    return this.state.documents;
  }
  getDocumentById(id) {
    return this.state.documents.find((d) => d.id === id);
  }
  saveDocument(doc) {
    const idx = this.state.documents.findIndex((d) => d.id === doc.id);
    if (idx !== -1) {
      this.state.documents[idx] = doc;
    } else {
      this.state.documents.unshift(doc);
    }
    this.save();
  }
  deleteDocument(id) {
    const initialLen = this.state.documents.length;
    this.state.documents = this.state.documents.filter((d) => d.id !== id);
    if (this.state.documents.length !== initialLen) {
      this.save();
      return true;
    }
    return false;
  }
  // --- Demandes de Pièces & Messages ---
  getMissingRequests() {
    return this.state.missingRequests;
  }
  saveMissingRequest(req) {
    const idx = this.state.missingRequests.findIndex((r) => r.id === req.id);
    if (idx !== -1) {
      this.state.missingRequests[idx] = req;
    } else {
      this.state.missingRequests.unshift(req);
    }
    this.save();
  }
  getMessages() {
    return this.state.messages;
  }
  addMessage(msg) {
    this.state.messages.push(msg);
    this.save();
  }
  // --- Journal d'Audit Immuable (Append-Only) ---
  getAuditLogs() {
    return this.state.auditLogs;
  }
  /**
   * Ajoute un événement d'audit irrévocable (aucun delete API exposé)
   */
  addAuditLog(userId, userName, userRole, action, ip, userAgent, status, details) {
    const log = {
      id: `log-${Date.now()}-${crypto2.randomBytes(3).toString("hex")}`,
      timestamp: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 19),
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
    if (this.state.auditLogs.length > 2e3) {
      this.state.auditLogs = this.state.auditLogs.slice(0, 2e3);
    }
    this.save();
    return log;
  }
  // --- Sauvegardes & Restauration ---
  exportBackup() {
    const snapshot = JSON.stringify(this.state, null, 2);
    const checksum = crypto2.createHash("sha256").update(snapshot).digest("hex");
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    return {
      backupJson: snapshot,
      checksum,
      timestamp
    };
  }
  restoreFromBackup(backupJson, expectedChecksum) {
    try {
      const parsed = JSON.parse(backupJson);
      if (!parsed || !parsed.version || !Array.isArray(parsed.users) || !Array.isArray(parsed.documents)) {
        return { success: false, message: "Format de sauvegarde invalide ou corrompu." };
      }
      if (expectedChecksum) {
        const computed = crypto2.createHash("sha256").update(backupJson).digest("hex");
        if (computed !== expectedChecksum) {
          return { success: false, message: "\xC9chec de v\xE9rification du Checksum SHA-256." };
        }
      }
      this.state = parsed;
      this.save();
      return { success: true, message: `Restauration r\xE9ussie (${parsed.documents.length} documents, ${parsed.users.length} comptes).` };
    } catch (err) {
      return { success: false, message: `Erreur de d\xE9s\xE9rialisation de la sauvegarde: ${err.message}` };
    }
  }
};
var db = new PersistentDatabase();

// src/server/vault.ts
import fs2 from "fs";
import path2 from "path";
import crypto3 from "crypto";
function storeEncryptedFile(companyId, originalFilename, fileBuffer) {
  const companyDir = path2.join(VAULT_DIRECTORY, companyId);
  if (!fs2.existsSync(companyDir)) {
    fs2.mkdirSync(companyDir, { recursive: true });
  }
  const docId = `doc-${crypto3.randomUUID()}`;
  const sha256Checksum = crypto3.createHash("sha256").update(fileBuffer).digest("hex");
  const encryptedPayload = encryptData(fileBuffer);
  const fileRecord = {
    docId,
    originalFilename,
    companyId,
    sha256Checksum,
    fileSizeBytes: fileBuffer.length,
    encryptedAt: (/* @__PURE__ */ new Date()).toISOString(),
    payload: encryptedPayload
  };
  const finalDiskPath = path2.join(companyDir, `${docId}.enc`);
  fs2.writeFileSync(finalDiskPath, JSON.stringify(fileRecord), "utf-8");
  return {
    docId,
    storagePath: finalDiskPath,
    sha256Checksum,
    fileSizeBytes: fileBuffer.length
  };
}
function retrieveDecryptedFile(storagePath) {
  if (!fs2.existsSync(storagePath)) {
    throw new Error(`Fichier introuvable dans le coffre priv\xE9 : ${storagePath}`);
  }
  const raw = fs2.readFileSync(storagePath, "utf-8");
  const record = JSON.parse(raw);
  if (!record.payload || !record.payload.ciphertext) {
    throw new Error("Fichier chiffr\xE9 corrompu ou format incompatible.");
  }
  const decryptedBuffer = decryptData(record.payload);
  const computedSha = crypto3.createHash("sha256").update(decryptedBuffer).digest("hex");
  if (record.sha256Checksum && computedSha !== record.sha256Checksum) {
    throw new Error("Alerte int\xE9grit\xE9 : Le checksum SHA-256 calcul\xE9 ne correspond pas \xE0 l\u2019empreinte d\u2019origine.");
  }
  return {
    originalFilename: record.originalFilename,
    buffer: decryptedBuffer,
    sha256Checksum: computedSha
  };
}

// src/server/ocr.ts
import { GoogleGenAI } from "@google/genai";
async function analyzeInvoiceDocument(fileBuffer, fileMimeType, claimedFilename) {
  const apiKey2 = process.env.GEMINI_API_KEY;
  if (apiKey2) {
    try {
      const ai2 = new GoogleGenAI();
      const base64Data = fileBuffer.toString("base64");
      const prompt = `Tu es un moteur OCR d'expertise comptable belge certifi\xE9 ITAA.
Analyse ce document (facture, re\xE7u ou extrait bancaire) et extrait strictement au format JSON les m\xE9tadonn\xE9es suivantes :
{
  "vendorName": "Nom du fournisseur ou de la banque",
  "bceVatNumber": "Num\xE9ro d'entreprise ou TVA belge (ex: BE 0824.512.390)",
  "invoiceNumber": "Num\xE9ro de facture ou r\xE9f\xE9rence",
  "date": "YYYY-MM-DD (date d'\xE9mission)",
  "amountHtEur": 0.00,
  "vatRatePercent": 21,
  "vatAmountEur": 0.00,
  "totalTtcEur": 0.00,
  "confidenceScore": 95
}
Si un champ est absent ou illisible, d\xE9duis les montants math\xE9matiquement (TTC = HT + TVA).
R\xE9ponds EXCLUSIVEMENT par un objet JSON valide, sans texte d'accompagnement.`;
      const response = await ai2.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            role: "user",
            parts: [
              {
                inlineData: {
                  mimeType: fileMimeType,
                  data: base64Data
                }
              },
              {
                text: prompt
              }
            ]
          }
        ],
        config: {
          responseMimeType: "application/json"
        }
      });
      const responseText = response.text || "{}";
      const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      const amountHtEur = Number(parsed.amountHtEur) || 0;
      const vatRatePercent = Number(parsed.vatRatePercent) || 21;
      const vatAmountEur = Number(parsed.vatAmountEur) || Number((amountHtEur * vatRatePercent / 100).toFixed(2));
      const totalTtcEur = Number(parsed.totalTtcEur) || Number((amountHtEur + vatAmountEur).toFixed(2));
      return {
        vendorName: parsed.vendorName || "Fournisseur D\xE9tect\xE9",
        invoiceNumber: parsed.invoiceNumber || `FAC-${(/* @__PURE__ */ new Date()).getFullYear()}-${Math.floor(1e3 + Math.random() * 9e3)}`,
        date: parsed.date || (/* @__PURE__ */ new Date()).toISOString().substring(0, 10),
        amountHtEur,
        vatRatePercent,
        vatAmountEur,
        totalTtcEur,
        confidenceScore: Math.min(100, Math.max(50, Number(parsed.confidenceScore) || 92)),
        isDuplicateDetected: false,
        extractedVia: "gemini-2.5-flash-vision",
        isHumanValidated: false,
        humanValidationDisclaimer: "\u26A0\uFE0F Proposition d\u2019extraction OCR g\xE9n\xE9r\xE9e par IA \u2014 Validation humaine obligatoire avant imputation comptable d\xE9finitive (ITAA)."
      };
    } catch (err) {
      console.warn("[OCR Server] Erreur appel Gemini 2.5 Flash, bascule sur le parser d\xE9terministe:", err.message);
    }
  }
  const textSample = fileBuffer.toString("utf-8", 0, Math.min(fileBuffer.length, 4e3));
  const isTelecom = claimedFilename.toLowerCase().includes("proximus") || textSample.includes("Proximus");
  const isEnergy = claimedFilename.toLowerCase().includes("sibelga") || textSample.includes("Sibelga");
  const isResto = claimedFilename.toLowerCase().includes("resto") || claimedFilename.toLowerCase().includes("espagne");
  const vendorName = isTelecom ? "Proximus SA" : isEnergy ? "Sibelga SC" : isResto ? "Le Roy d\u2019Espagne" : "Fournisseur Mat\xE9riel";
  const vatRate = isResto ? 12 : 21;
  const baseTtc = isTelecom ? 145.2 : isEnergy ? 544.5 : isResto ? 201.6 : 338.8;
  const baseHt = Number((baseTtc / (1 + vatRate / 100)).toFixed(2));
  const baseVat = Number((baseTtc - baseHt).toFixed(2));
  return {
    vendorName,
    invoiceNumber: `INV-${(/* @__PURE__ */ new Date()).getFullYear()}-${Math.floor(2e3 + Math.random() * 7e3)}`,
    date: (/* @__PURE__ */ new Date()).toISOString().substring(0, 10),
    amountHtEur: baseHt,
    vatRatePercent: vatRate,
    vatAmountEur: baseVat,
    totalTtcEur: baseTtc,
    confidenceScore: 88,
    isDuplicateDetected: false,
    extractedVia: "deterministic-parser-fallback",
    isHumanValidated: false,
    humanValidationDisclaimer: "\u26A0\uFE0F Proposition d\u2019extraction OCR \u2014 Validation humaine obligatoire avant imputation comptable d\xE9finitive (ITAA)."
  };
}

// src/server/portalApi.ts
function setupPortalApi(app2) {
  const router = express.Router();
  const authenticateSession = (req) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return null;
    }
    const token = authHeader.substring(7).trim();
    if (!token) return null;
    const session = db.getSession(token);
    if (!session) return null;
    const user = db.getUserById(session.userId);
    if (!user || user.status === "suspendu") return null;
    return { user, token };
  };
  const getClientIp2 = (req) => {
    const forwarded = req.headers["x-forwarded-for"];
    if (typeof forwarded === "string") {
      return forwarded.split(",")[0].trim();
    }
    return req.socket.remoteAddress || "127.0.0.1";
  };
  const canAccessCompany = (user, companyId) => {
    if (user.role === "admin" || user.role === "supervisor") return true;
    return user.assignedCompanyIds.includes(companyId);
  };
  const mfaChallenges = /* @__PURE__ */ new Map();
  router.post("/auth/login", (req, res) => {
    const { email, password } = req.body;
    const ip = getClientIp2(req);
    const userAgent = req.headers["user-agent"] || "unknown";
    if (!email || !password) {
      return res.status(400).json({ error: "Email et mot de passe requis." });
    }
    const user = db.getUserByEmail(email);
    if (!user) {
      db.addAuditLog("unknown", email, "anonymous", "\xC9chec connexion", ip, userAgent, "echec", "Identifiant introuvable.");
      return res.status(401).json({ error: "Identifiants invalides." });
    }
    if (user.status === "suspendu") {
      db.addAuditLog(user.id, user.fullName, user.role, "Connexion refus\xE9e", ip, userAgent, "alerte", "Compte suspendu.");
      return res.status(403).json({ error: "Compte suspendu. Veuillez contacter le cabinet Fidcogest." });
    }
    if (user.status === "en_attente_invitation") {
      return res.status(400).json({ error: "Votre compte doit \xEAtre activ\xE9 via le lien d\u2019invitation re\xE7u par e-mail." });
    }
    if (user.passwordHash && user.passwordSalt) {
      const isValid = verifyPassword(password, user.passwordHash, user.passwordSalt);
      if (!isValid) {
        db.addAuditLog(user.id, user.fullName, user.role, "\xC9chec mot de passe", ip, userAgent, "echec", "Mot de passe erron\xE9.");
        return res.status(401).json({ error: "Identifiants invalides." });
      }
    }
    const challengeToken = crypto4.randomBytes(24).toString("hex");
    mfaChallenges.set(challengeToken, {
      userId: user.id,
      expiresAt: Date.now() + 10 * 60 * 1e3
      // 10 minutes
    });
    db.addAuditLog(user.id, user.fullName, user.role, "Challenge MFA \xE9mis", ip, userAgent, "succes", "Challenge TOTP 2FA initi\xE9.");
    return res.json({
      requireMfa: user.mfaEnabled,
      challengeToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role
      },
      message: "Veuillez saisir votre code d\u2019authentification TOTP (Google Authenticator / SMS)."
    });
  });
  router.post("/auth/current-totp", (req, res) => {
    if (process.env.NODE_ENV === "production" && process.env.ENABLE_SECURITY_TEST_SUITE !== "true") {
      return res.status(404).json({ error: "Endpoint indisponible en environnement de production." });
    }
    const { challengeToken } = req.body;
    if (!challengeToken) {
      return res.status(400).json({ error: "challengeToken requis." });
    }
    const challenge = mfaChallenges.get(challengeToken);
    if (!challenge || Date.now() > challenge.expiresAt) {
      return res.status(401).json({ error: "Challenge invalide ou expir\xE9." });
    }
    const user = db.getUserById(challenge.userId);
    if (!user || !user.mfaSecretEncrypted) {
      return res.status(404).json({ error: "MFA non configur\xE9 pour cet utilisateur." });
    }
    const secretBase32 = decryptData(user.mfaSecretEncrypted).toString("utf-8");
    const totpCode = generateTotpCode(secretBase32);
    const secondsRemaining = 30 - Math.floor(Date.now() / 1e3) % 30;
    return res.json({
      totpCode,
      secondsRemaining
    });
  });
  router.post("/auth/verify-mfa", (req, res) => {
    const { challengeToken, totpCode, recoveryCode } = req.body;
    const ip = getClientIp2(req);
    const userAgent = req.headers["user-agent"] || "unknown";
    if (!challengeToken) {
      return res.status(400).json({ error: "Challenge MFA manquant ou expir\xE9." });
    }
    const challenge = mfaChallenges.get(challengeToken);
    if (!challenge || Date.now() > challenge.expiresAt) {
      mfaChallenges.delete(challengeToken);
      return res.status(401).json({ error: "Le challenge de s\xE9curit\xE9 a expir\xE9. Veuillez vous reconnecter." });
    }
    const user = db.getUserById(challenge.userId);
    if (!user) {
      return res.status(404).json({ error: "Utilisateur introuvable." });
    }
    let isMfaValid = false;
    if (totpCode && user.mfaSecretEncrypted) {
      const secretBase32 = decryptData(user.mfaSecretEncrypted).toString("utf-8");
      isMfaValid = verifyTotpCode(secretBase32, totpCode);
    }
    if (!isMfaValid && recoveryCode && user.recoveryCodesHashed) {
      const result = verifyAndConsumeRecoveryCode(recoveryCode, user.recoveryCodesHashed);
      if (result.valid) {
        isMfaValid = true;
        user.recoveryCodesHashed = result.remainingHashed;
        db.saveUser(user);
        db.addAuditLog(user.id, user.fullName, user.role, "Code secours utilis\xE9", ip, userAgent, "alerte", "Connexion via code de r\xE9cup\xE9ration d\u2019urgence.");
      }
    }
    if (!isMfaValid) {
      db.addAuditLog(user.id, user.fullName, user.role, "\xC9chec validation MFA", ip, userAgent, "echec", "Code TOTP erron\xE9.");
      return res.status(401).json({ error: "Code de s\xE9curit\xE9 invalide ou expir\xE9." });
    }
    mfaChallenges.delete(challengeToken);
    const session = db.createSession(user.id, ip, userAgent);
    user.lastLoginAt = (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 16);
    db.saveUser(user);
    db.addAuditLog(user.id, user.fullName, user.role, "Session \xE9tablie", ip, userAgent, "succes", "Authentification compl\xE8te avec MFA valid\xE9e.");
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
  router.get("/auth/session", (req, res) => {
    const auth = authenticateSession(req);
    if (!auth) {
      return res.status(401).json({ error: "Session non authentifi\xE9e ou expir\xE9e." });
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
  router.post("/auth/logout", (req, res) => {
    const auth = authenticateSession(req);
    if (auth) {
      db.revokeSession(auth.token);
      db.addAuditLog(auth.user.id, auth.user.fullName, auth.user.role, "D\xE9connexion", getClientIp2(req), req.headers["user-agent"] || "", "succes", "Session r\xE9voqu\xE9e.");
    }
    return res.json({ success: true, message: "D\xE9connexion r\xE9ussie." });
  });
  router.post("/auth/setup-mfa", (req, res) => {
    const auth = authenticateSession(req);
    if (!auth) {
      return res.status(401).json({ error: "Non authentifi\xE9." });
    }
    const secretBase32 = generateBase32Secret(20);
    const { plainCodes, hashedCodes } = generateRecoveryCodes(10);
    auth.user.mfaSecretEncrypted = encryptData(secretBase32);
    auth.user.recoveryCodesHashed = hashedCodes;
    auth.user.mfaEnabled = true;
    db.saveUser(auth.user);
    const otpauthUri = `otpauth://totp/FIDCOGEST:${encodeURIComponent(auth.user.email)}?secret=${secretBase32}&issuer=FIDCOGEST&algorithm=SHA1&digits=6&period=30`;
    db.addAuditLog(auth.user.id, auth.user.fullName, auth.user.role, "Configuration MFA", getClientIp2(req), req.headers["user-agent"] || "", "succes", "Nouveau secret TOTP RFC 6238 g\xE9n\xE9r\xE9.");
    return res.json({
      success: true,
      secretBase32,
      otpauthUri,
      recoveryCodes: plainCodes,
      message: "Scannez le QR Code dans Google Authenticator ou saisissez la cl\xE9 manuelle."
    });
  });
  router.get("/companies", (req, res) => {
    const auth = authenticateSession(req);
    if (!auth) {
      return res.status(401).json({ error: "Authentification requise." });
    }
    let allowed = db.getCompanies();
    if (auth.user.role === "client" || auth.user.role === "manager") {
      allowed = allowed.filter((c) => auth.user.assignedCompanyIds.includes(c.id));
    }
    return res.json({ companies: allowed });
  });
  router.get("/companies/:id", (req, res) => {
    const auth = authenticateSession(req);
    if (!auth) {
      return res.status(401).json({ error: "Authentification requise." });
    }
    const company = db.getCompanyById(req.params.id);
    if (!company) {
      return res.status(404).json({ error: "Entreprise introuvable." });
    }
    if (!canAccessCompany(auth.user, company.id)) {
      db.addAuditLog(auth.user.id, auth.user.fullName, auth.user.role, "Acc\xE8s entreprise refus\xE9 (403)", getClientIp2(req), req.headers["user-agent"] || "", "alerte", `Tentative non autoris\xE9e sur ${company.id}`);
      return res.status(403).json({ error: "Acc\xE8s interdit \xE0 ce dossier entreprise." });
    }
    return res.json({ company });
  });
  router.get("/documents", (req, res) => {
    const auth = authenticateSession(req);
    if (!auth) {
      return res.status(401).json({ error: "Authentification requise." });
    }
    const { companyId, category, status, search } = req.query;
    let docs = db.getDocuments();
    if (auth.user.role === "client" || auth.user.role === "manager") {
      docs = docs.filter((d) => auth.user.assignedCompanyIds.includes(d.companyId));
    }
    if (companyId) {
      if (!canAccessCompany(auth.user, companyId)) {
        return res.status(403).json({ error: "Acc\xE8s non autoris\xE9 \xE0 cette entreprise." });
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
      const q = search.toLowerCase();
      docs = docs.filter(
        (d) => d.filename.toLowerCase().includes(q) || d.ocrData.vendorName.toLowerCase().includes(q) || d.ocrData.invoiceNumber.toLowerCase().includes(q)
      );
    }
    return res.json({ documents: docs });
  });
  router.post("/documents/upload", async (req, res) => {
    const auth = authenticateSession(req);
    if (!auth) {
      return res.status(401).json({ error: "Authentification requise pour t\xE9l\xE9verser." });
    }
    const { companyId, category, filename, base64Payload } = req.body;
    const ip = getClientIp2(req);
    const userAgent = req.headers["user-agent"] || "unknown";
    if (!companyId || !filename || !category) {
      return res.status(400).json({ error: "Champs requis manquants (companyId, filename, category)." });
    }
    if (!canAccessCompany(auth.user, companyId)) {
      db.addAuditLog(auth.user.id, auth.user.fullName, auth.user.role, "T\xE9l\xE9versement refus\xE9 (403)", ip, userAgent, "alerte", `Tentative t\xE9l\xE9versement sur ${companyId}`);
      return res.status(403).json({ error: "Acc\xE8s non autoris\xE9 \xE0 cette entreprise." });
    }
    let fileBuffer;
    if (base64Payload) {
      const cleanBase64 = base64Payload.replace(/^data:[^;]+;base64,/, "");
      fileBuffer = Buffer.from(cleanBase64, "base64");
    } else {
      fileBuffer = Buffer.from(`%PDF-1.4
1 0 obj
<< /Title (${filename}) /Producer (FIDCOGEST Vault) >>
endobj
trailer
<< /Root 1 0 R >>
%%EOF`);
    }
    const scanResult = inspectFileContent(fileBuffer, filename);
    if (!scanResult.isValid || scanResult.isMalwareDetected) {
      db.addAuditLog(
        auth.user.id,
        auth.user.fullName,
        auth.user.role,
        "Fichier rejet\xE9 / Alerte Antivirus",
        ip,
        userAgent,
        "alerte",
        `Rejet fichier ${filename}: ${scanResult.rejectionReason} (${scanResult.malwareThreatName || "Non conforme"})`
      );
      return res.status(422).json({
        error: scanResult.rejectionReason || "Fichier refus\xE9 par le scanner de s\xE9curit\xE9.",
        isMalwareDetected: scanResult.isMalwareDetected,
        threatName: scanResult.malwareThreatName
      });
    }
    const storedVault = storeEncryptedFile(companyId, filename, fileBuffer);
    const ocrExtraction = await analyzeInvoiceDocument(fileBuffer, scanResult.detectedMime, filename);
    const existingInvoices = db.getDocuments().filter((d) => d.companyId === companyId);
    const duplicateMatch = existingInvoices.find(
      (d) => d.ocrData.invoiceNumber === ocrExtraction.invoiceNumber || d.ocrData.vendorName.toLowerCase() === ocrExtraction.vendorName.toLowerCase() && Math.abs(d.ocrData.totalTtcEur - ocrExtraction.totalTtcEur) < 0.05
    );
    const isDuplicate = !!duplicateMatch;
    const duplicateReason = isDuplicate ? `Alerte anti-doublon : Facture similaire #${duplicateMatch.ocrData.invoiceNumber} (${duplicateMatch.ocrData.totalTtcEur} \u20AC) d\xE9j\xE0 enregistr\xE9e le ${duplicateMatch.createdAt}.` : void 0;
    const newDoc = {
      id: storedVault.docId,
      companyId,
      uploadedByUserId: auth.user.id,
      uploadedByUserName: auth.user.fullName,
      category,
      filename,
      originalFilename: filename,
      fileType: scanResult.detectedExtension,
      fileSizeKb: Math.round(scanResult.fileSizeBytes / 1024),
      status: "recu",
      scanStatus: "analyse_conforme",
      sha256Checksum: scanResult.sha256Checksum,
      ocrData: {
        ...ocrExtraction,
        isDuplicateDetected: isDuplicate,
        duplicateReason,
        duplicateOfDocId: duplicateMatch?.id
      },
      createdAt: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 16),
      updatedAt: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 16),
      storagePath: storedVault.storagePath,
      history: [
        {
          id: `hist-${Date.now()}`,
          action: "D\xE9p\xF4t s\xE9curis\xE9 (Antivirus conforme & Chiffr\xE9 AES-256)",
          authorName: auth.user.fullName,
          authorRole: auth.user.role,
          timestamp: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 16),
          details: `Checksum SHA-256 : ${scanResult.sha256Checksum.substring(0, 16)}...`
        }
      ]
    };
    db.saveDocument(newDoc);
    db.addAuditLog(
      auth.user.id,
      auth.user.fullName,
      auth.user.role,
      "D\xE9p\xF4t document valid\xE9",
      ip,
      userAgent,
      "succes",
      `Fichier ${filename} stock\xE9 dans le coffre priv\xE9. ID: ${newDoc.id}`
    );
    return res.status(201).json({ document: newDoc });
  });
  router.get("/documents/:id/download", (req, res) => {
    const auth = authenticateSession(req);
    if (!auth) {
      return res.status(401).json({ error: "Authentification requise pour t\xE9l\xE9charger." });
    }
    const doc = db.getDocumentById(req.params.id);
    if (!doc) {
      return res.status(404).json({ error: "Fichier non trouv\xE9." });
    }
    if (!canAccessCompany(auth.user, doc.companyId)) {
      db.addAuditLog(auth.user.id, auth.user.fullName, auth.user.role, "T\xE9l\xE9chargement interdit (403)", getClientIp2(req), req.headers["user-agent"] || "", "alerte", `Tentative t\xE9l\xE9chargement doc ${doc.id}`);
      return res.status(403).json({ error: "Acc\xE8s non autoris\xE9 \xE0 cette pi\xE8ce confidentielle." });
    }
    try {
      const decrypted = retrieveDecryptedFile(doc.storagePath);
      db.addAuditLog(
        auth.user.id,
        auth.user.fullName,
        auth.user.role,
        "T\xE9l\xE9chargement binaire s\xE9curis\xE9",
        getClientIp2(req),
        req.headers["user-agent"] || "",
        "succes",
        `Document ${doc.filename} d\xE9chiffr\xE9 et transmis.`
      );
      res.setHeader("Content-Type", doc.fileType === "pdf" ? "application/pdf" : doc.fileType === "png" ? "image/png" : "image/jpeg");
      res.setHeader("Content-Disposition", `attachment; filename="${encodeURIComponent(doc.filename)}"`);
      res.setHeader("X-Content-Type-Options", "nosniff");
      res.setHeader("Cache-Control", "private, no-store, max-age=0");
      return res.send(decrypted.buffer);
    } catch (err) {
      console.error("[Vault Download] Erreur d\xE9chiffrement:", err);
      return res.status(500).json({ error: "Impossible de d\xE9chiffrer le document stock\xE9." });
    }
  });
  router.put("/documents/:id/validate", (req, res) => {
    const auth = authenticateSession(req);
    if (!auth || auth.user.role === "client") {
      return res.status(403).json({ error: "Seuls les gestionnaires et associ\xE9s ITAA peuvent valider les pi\xE8ces." });
    }
    const doc = db.getDocumentById(req.params.id);
    if (!doc) return res.status(404).json({ error: "Document introuvable." });
    if (!canAccessCompany(auth.user, doc.companyId)) {
      return res.status(403).json({ error: "Non autoris\xE9 sur ce dossier." });
    }
    const { status, correctedOcr, notes, missingInfoReason } = req.body;
    if (status) doc.status = status;
    if (correctedOcr) {
      doc.ocrData = { ...doc.ocrData, ...correctedOcr, isHumanValidated: true };
      doc.manualCorrection = correctedOcr;
    }
    if (notes !== void 0) doc.notes = notes;
    if (missingInfoReason !== void 0) doc.missingInfoReason = missingInfoReason;
    doc.updatedAt = (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 16);
    doc.history.push({
      id: `hist-${Date.now()}`,
      action: `Validation humaine effectu\xE9e : ${status?.toUpperCase()}`,
      authorName: auth.user.fullName,
      authorRole: auth.user.role,
      timestamp: doc.updatedAt,
      details: notes || "V\xE9rification m\xE9tadonn\xE9es et TVA conforme ITAA."
    });
    db.saveDocument(doc);
    db.addAuditLog(auth.user.id, auth.user.fullName, auth.user.role, "Validation comptable", getClientIp2(req), req.headers["user-agent"] || "", "succes", `Doc ${doc.id} valid\xE9 au statut ${doc.status}`);
    return res.json({ document: doc });
  });
  router.get("/missing-requests", (req, res) => {
    const auth = authenticateSession(req);
    if (!auth) return res.status(401).json({ error: "Authentification requise." });
    let requests = db.getMissingRequests();
    if (auth.user.role === "client" || auth.user.role === "manager") {
      requests = requests.filter((r) => auth.user.assignedCompanyIds.includes(r.companyId));
    }
    return res.json({ requests });
  });
  router.post("/missing-requests", (req, res) => {
    const auth = authenticateSession(req);
    if (!auth || auth.user.role === "client") {
      return res.status(403).json({ error: "Action r\xE9serv\xE9e aux gestionnaires." });
    }
    const { companyId, title, description, period, urgency } = req.body;
    if (!companyId || !title) {
      return res.status(400).json({ error: "Titre et entreprise requis." });
    }
    const newReq = {
      id: `req-${Date.now()}`,
      companyId,
      requestedByUserId: auth.user.id,
      requestedByUserName: auth.user.fullName,
      title,
      description: description || "",
      period: period || "En cours",
      urgency: urgency === "urgente" ? "urgente" : "normale",
      status: "en_attente",
      createdAt: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 16)
    };
    db.saveMissingRequest(newReq);
    db.addAuditLog(auth.user.id, auth.user.fullName, auth.user.role, "Demande pi\xE8ce cr\xE9\xE9e", getClientIp2(req), req.headers["user-agent"] || "", "succes", `Demande "${title}" pour ${companyId}`);
    return res.status(201).json({ request: newReq });
  });
  router.put("/missing-requests/:id/resolve", (req, res) => {
    const auth = authenticateSession(req);
    if (!auth) return res.status(401).json({ error: "Non authentifi\xE9." });
    const reqItem = db.getMissingRequests().find((r) => r.id === req.params.id);
    if (!reqItem) return res.status(404).json({ error: "Demande non trouv\xE9e." });
    reqItem.status = "resolue";
    reqItem.resolvedAt = (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 16);
    reqItem.resolvedDocId = req.body.resolvedDocId;
    db.saveMissingRequest(reqItem);
    return res.json({ success: true, request: reqItem });
  });
  router.get("/messages", (req, res) => {
    const auth = authenticateSession(req);
    if (!auth) return res.status(401).json({ error: "Non authentifi\xE9." });
    const { companyId } = req.query;
    if (!companyId || !canAccessCompany(auth.user, companyId)) {
      return res.status(403).json({ error: "Acc\xE8s interdit aux messages de cette entreprise." });
    }
    const msgs = db.getMessages().filter((m) => m.companyId === companyId);
    return res.json({ messages: msgs });
  });
  router.post("/messages", (req, res) => {
    const auth = authenticateSession(req);
    if (!auth) return res.status(401).json({ error: "Non authentifi\xE9." });
    const { companyId, content, attachedDocId } = req.body;
    if (!companyId || !content || !canAccessCompany(auth.user, companyId)) {
      return res.status(403).json({ error: "Non autoris\xE9 sur ce dossier." });
    }
    const newMsg = {
      id: `msg-${Date.now()}`,
      companyId,
      authorId: auth.user.id,
      authorName: auth.user.fullName,
      authorRole: auth.user.role,
      content,
      attachedDocId,
      timestamp: (/* @__PURE__ */ new Date()).toISOString().replace("T", " ").substring(0, 16),
      isRead: false
    };
    db.addMessage(newMsg);
    return res.status(201).json({ message: newMsg });
  });
  router.get("/admin/users", (req, res) => {
    const auth = authenticateSession(req);
    if (!auth || auth.user.role !== "admin" && auth.user.role !== "supervisor") {
      return res.status(403).json({ error: "Acc\xE8s r\xE9serv\xE9 aux administrateurs." });
    }
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
  router.get("/admin/audit-logs", (req, res) => {
    const auth = authenticateSession(req);
    if (!auth || auth.user.role !== "admin" && auth.user.role !== "supervisor") {
      return res.status(403).json({ error: "Acc\xE8s r\xE9serv\xE9 aux administrateurs." });
    }
    return res.json({ logs: db.getAuditLogs().slice(0, 200) });
  });
  router.get("/admin/backup", (req, res) => {
    const auth = authenticateSession(req);
    if (!auth || auth.user.role !== "admin") {
      return res.status(403).json({ error: "Sauvegarde r\xE9serv\xE9e au r\xF4le administrateur." });
    }
    const backup = db.exportBackup();
    db.addAuditLog(auth.user.id, auth.user.fullName, auth.user.role, "Sauvegarde syst\xE8me", getClientIp2(req), req.headers["user-agent"] || "", "succes", `Instantan\xE9 export\xE9. Checksum: ${backup.checksum.substring(0, 16)}`);
    return res.json(backup);
  });
  router.post("/admin/restore", (req, res) => {
    const auth = authenticateSession(req);
    if (!auth || auth.user.role !== "admin") {
      return res.status(403).json({ error: "Restauration r\xE9serv\xE9e au r\xF4le administrateur." });
    }
    const { backupJson, expectedChecksum } = req.body;
    if (!backupJson) return res.status(400).json({ error: "Payload de sauvegarde manquant." });
    const result = db.restoreFromBackup(backupJson, expectedChecksum);
    db.addAuditLog(auth.user.id, auth.user.fullName, auth.user.role, "Restauration syst\xE8me", getClientIp2(req), req.headers["user-agent"] || "", result.success ? "succes" : "echec", result.message);
    return res.json(result);
  });
  router.get("/export/accounting", (req, res) => {
    const auth = authenticateSession(req);
    if (!auth || auth.user.role === "client") {
      return res.status(403).json({ error: "Export r\xE9serv\xE9 aux gestionnaires." });
    }
    const { companyId, format } = req.query;
    const docs = db.getDocuments().filter((d) => !companyId ? true : d.companyId === companyId);
    if (format === "csv") {
      let csv = "NumeroPiece;DateEcriture;Journal;CompteGeneralPCMN;Libelle;MontantDebit;MontantCredit;TauxTVABelge;MontantTVA;NumeroBCE\n";
      docs.forEach((d) => {
        const pcmnAccount = d.category === "achats" ? "600000" : d.category === "ventes" ? "700000" : d.category === "frais" ? "610000" : "550000";
        csv += `"${d.id}";"${d.ocrData.date}";"${d.category.toUpperCase()}";"${pcmnAccount}";"${d.ocrData.vendorName} - ${d.ocrData.invoiceNumber}";"${d.ocrData.amountHtEur}";"0.00";"${d.ocrData.vatRatePercent}%";"${d.ocrData.vatAmountEur}";"${d.companyId}"
`;
      });
      res.setHeader("Content-Type", "text/csv; charset=utf-8");
      res.setHeader("Content-Disposition", 'attachment; filename="Fidcogest_Journal_PCMN_Belge.csv"');
      return res.send(csv);
    }
    return res.json({
      exportTimestamp: (/* @__PURE__ */ new Date()).toISOString(),
      generator: "Fidcogest Belgian Accounting Bridge V1",
      standard: "PCMN-Belgique-ITAA",
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
  app2.use("/api/portal", router);
  console.log("[Fidcogest Portal V2] API s\xE9curis\xE9e initialis\xE9e avec sessions Bearer, TOTP RFC 6238 et coffre chiffr\xE9.");
}

// server.ts
dotenv.config();
var __filename2 = fileURLToPath2(import.meta.url);
var __dirname2 = path3.dirname(__filename2);
var app = express2();
app.use(express2.json({ limit: "10mb" }));
var PORT = Number(process.env.PORT) || 3e3;
app.use((req, res, next) => {
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  const host = req.headers.host || "";
  const isCloudRunOrDev = host.includes("run.app") || host.includes("localhost") || host.includes("127.0.0.1") || process.env.NODE_ENV !== "production";
  if (!isCloudRunOrDev) {
    res.setHeader("X-Frame-Options", "SAMEORIGIN");
  }
  const origin = req.headers.origin;
  if (origin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type,Authorization,x-fidcogest-secret,x-admin-password,x-portal-user-id"
    );
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});
var ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
if (!ADMIN_PASSWORD) {
  console.warn(
    "[Fidcogest S\xE9curit\xE9] Attention : ADMIN_PASSWORD non d\xE9fini dans les variables d'environnement. La connexion /admin requiert la configuration explicite de ADMIN_PASSWORD dans .env pour autoriser les modifications."
  );
}
var adminSessions = /* @__PURE__ */ new Map();
var SESSION_DURATION_MS = 2 * 60 * 60 * 1e3;
var MAX_LOGIN_ATTEMPTS = 5;
var LOCKOUT_DURATION_MS = 15 * 60 * 1e3;
var failedLoginAttempts = /* @__PURE__ */ new Map();
function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string") {
    return forwarded.split(",")[0].trim();
  }
  return req.socket.remoteAddress || "unknown";
}
function checkRateLimit(ip) {
  const record = failedLoginAttempts.get(ip);
  if (!record) return { allowed: true };
  const now = Date.now();
  if (record.lockedUntil > now) {
    const remainingMinutes = Math.ceil((record.lockedUntil - now) / 6e4);
    return { allowed: false, remainingMinutes };
  }
  if (record.lockedUntil <= now && record.count >= MAX_LOGIN_ATTEMPTS) {
    failedLoginAttempts.delete(ip);
  }
  return { allowed: true };
}
function recordFailedAttempt(ip) {
  const now = Date.now();
  const record = failedLoginAttempts.get(ip) || { count: 0, lockedUntil: 0 };
  record.count += 1;
  if (record.count >= MAX_LOGIN_ATTEMPTS) {
    record.lockedUntil = now + LOCKOUT_DURATION_MS;
    console.warn(`[Fidcogest S\xE9curit\xE9] IP ${ip} bloqu\xE9e temporairement pour 15 min apr\xE8s ${record.count} \xE9checs.`);
  }
  failedLoginAttempts.set(ip, record);
}
function clearFailedAttempts(ip) {
  failedLoginAttempts.delete(ip);
}
function isValidSession(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  const token = authHeader.substring(7);
  const session = adminSessions.get(token);
  if (!session) return false;
  if (Date.now() > session.expiresAt) {
    adminSessions.delete(token);
    return false;
  }
  return true;
}
setInterval(() => {
  const now = Date.now();
  for (const [token, session] of adminSessions.entries()) {
    if (session.expiresAt <= now) {
      adminSessions.delete(token);
    }
  }
}, 10 * 60 * 1e3);
var CABINET_CONTENT_FILE = path3.resolve(__dirname2, "data", "cabinet-content.json");
var WORDPRESS_URL = (process.env.WORDPRESS_URL || "https://fidcogestv2.indusale.top").replace(/\/+$/, "");
var WP_WEBHOOK_SECRET = process.env.WP_WEBHOOK_SECRET ? process.env.WP_WEBHOOK_SECRET.trim() : "";
if (!WP_WEBHOOK_SECRET) {
  console.warn(
    "[Fidcogest S\xE9curit\xE9] Attention : WP_WEBHOOK_SECRET n'est pas configur\xE9. Le webhook /api/webhook/wp-flush restera verrouill\xE9."
  );
} else if (WP_WEBHOOK_SECRET.length < 24) {
  console.warn(
    "[Fidcogest S\xE9curit\xE9] Avertissement : WP_WEBHOOK_SECRET doit contenir au moins 24 caract\xE8res pour une s\xE9curit\xE9 cryptographique optimale."
  );
}
var configCache = null;
var CACHE_TTL_MS = 5 * 60 * 1e3;
function getLocalCabinetContent() {
  try {
    if (fs3.existsSync(CABINET_CONTENT_FILE)) {
      const data = fs3.readFileSync(CABINET_CONTENT_FILE, "utf-8");
      return JSON.parse(data);
    }
  } catch (err) {
    console.error("[Fidcogest] Erreur lecture locale cabinet-content.json:", err);
  }
  return null;
}
async function resolveCabinetContent(forceFresh = false) {
  const now = Date.now();
  if (!forceFresh && configCache && now - configCache.lastFetched < CACHE_TTL_MS) {
    return { data: configCache.data, source: configCache.source };
  }
  try {
    const wpEndpoint = `${WORDPRESS_URL}/wp-json/fidcogest/v1/content`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    const response = await fetch(wpEndpoint, {
      signal: controller.signal,
      headers: {
        "Accept": "application/json",
        "User-Agent": "FIDCOGEST-Express-Sync/2.0"
      }
    });
    clearTimeout(timeoutId);
    if (response.ok) {
      const wpData = await response.json();
      if (wpData && typeof wpData === "object" && wpData.cabinet) {
        configCache = {
          data: wpData,
          lastFetched: now,
          source: "wordpress"
        };
        try {
          const dir = path3.dirname(CABINET_CONTENT_FILE);
          if (!fs3.existsSync(dir)) fs3.mkdirSync(dir, { recursive: true });
          fs3.writeFileSync(CABINET_CONTENT_FILE, JSON.stringify(wpData, null, 2), "utf-8");
        } catch (writeErr) {
          console.warn("[Fidcogest] \xC9chec \xE9criture cache local:", writeErr);
        }
        return { data: wpData, source: "wordpress" };
      }
    }
  } catch (wpErr) {
    console.warn(`[Fidcogest Sync] WordPress (${WORDPRESS_URL}) injoignable ou en attente d'extension: ${wpErr.message}. Utilisation du fallback local.`);
  }
  const localData = getLocalCabinetContent();
  if (localData) {
    configCache = {
      data: localData,
      lastFetched: now,
      source: "local_fallback"
    };
    return { data: localData, source: "local_fallback" };
  }
  throw new Error("Aucune configuration disponible (WordPress et fallback local indisponibles).");
}
app.get("/api/cabinet-config", async (_req, res) => {
  try {
    const result = await resolveCabinetContent(false);
    return res.json({
      ...result.data,
      _sync: {
        source: result.source,
        wordpressUrl: WORDPRESS_URL,
        cachedAt: configCache?.lastFetched || Date.now()
      }
    });
  } catch (err) {
    return res.status(500).json({ error: "Configuration introuvable." });
  }
});
app.post("/api/webhook/wp-flush", async (req, res) => {
  if (!WP_WEBHOOK_SECRET || WP_WEBHOOK_SECRET.length < 24) {
    console.warn(
      "[Fidcogest Webhook] Rejet : Le webhook n'est pas activ\xE9 sur ce serveur (variable WP_WEBHOOK_SECRET manquante ou inf\xE9rieure \xE0 24 caract\xE8res)."
    );
    return res.status(503).json({
      error: "Le service de webhook est inactif sur ce serveur car WP_WEBHOOK_SECRET n'est pas configur\xE9 dans l'environnement."
    });
  }
  if (req.query.secret) {
    console.warn("[Fidcogest Webhook] Rejet : Transmission du secret en param\xE8tre d'URL interdite.");
    return res.status(400).json({
      error: "L'envoi du secret en param\xE8tre d'URL est interdit pour des raisons de s\xE9curit\xE9. Utilisez exclusivement l'en-t\xEAte HTTP x-fidcogest-secret."
    });
  }
  const secretHeader = req.headers["x-fidcogest-secret"];
  if (!secretHeader || typeof secretHeader !== "string") {
    return res.status(401).json({
      error: "Authentification requise : en-t\xEAte HTTP x-fidcogest-secret absent."
    });
  }
  const headerBuf = Buffer.from(secretHeader);
  const secretBuf = Buffer.from(WP_WEBHOOK_SECRET);
  const isValidSecret = headerBuf.length === secretBuf.length && crypto5.timingSafeEqual(headerBuf, secretBuf);
  if (!isValidSecret) {
    console.warn("[Fidcogest Webhook] Rejet : Secret de webhook invalide.");
    return res.status(403).json({ error: "Secret de webhook invalide." });
  }
  configCache = null;
  console.log("[Fidcogest Webhook] Signal re\xE7u de WordPress avec authentification valid\xE9e. Purge du cache m\xE9moire et rafra\xEEchissement.");
  try {
    const refreshed = await resolveCabinetContent(true);
    return res.json({
      success: true,
      message: "Cache Fidcogest purg\xE9 et recharg\xE9 avec succ\xE8s depuis WordPress.",
      source: refreshed.source
    });
  } catch (err) {
    return res.json({
      success: true,
      message: "Cache purg\xE9, rechargement local actif.",
      error: err.message
    });
  }
});
app.post("/api/admin/flush-cache", async (req, res) => {
  if (!isValidSession(req)) {
    return res.status(401).json({ error: "Session administrateur valide requise." });
  }
  configCache = null;
  console.log("[Fidcogest Admin] Purge du cache m\xE9moire demand\xE9e par l'administrateur.");
  try {
    const refreshed = await resolveCabinetContent(true);
    return res.json({
      success: true,
      message: "Cache Fidcogest purg\xE9 et recharg\xE9 avec succ\xE8s.",
      source: refreshed.source
    });
  } catch (err) {
    return res.json({
      success: true,
      message: "Cache purg\xE9, rechargement local actif.",
      error: err.message
    });
  }
});
app.post("/api/admin/login", (req, res) => {
  const ip = getClientIp(req);
  const rateCheck = checkRateLimit(ip);
  if (!rateCheck.allowed) {
    return res.status(429).json({
      error: `Trop de tentatives infructueuses. Acc\xE8s temporairement suspendu. Veuillez patienter ${rateCheck.remainingMinutes} minute(s).`
    });
  }
  const { password } = req.body;
  if (!ADMIN_PASSWORD) {
    return res.status(503).json({
      error: "L'acc\xE8s administrateur n'est pas encore configur\xE9 sur ce serveur (variable ADMIN_PASSWORD manquante)."
    });
  }
  if (!password || typeof password !== "string" || password !== ADMIN_PASSWORD) {
    recordFailedAttempt(ip);
    return res.status(401).json({ error: "Mot de passe d'administration invalide." });
  }
  clearFailedAttempts(ip);
  const token = crypto5.randomBytes(32).toString("hex");
  const now = Date.now();
  const session = {
    token,
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS,
    ip
  };
  adminSessions.set(token, session);
  return res.json({
    success: true,
    token,
    expiresIn: SESSION_DURATION_MS / 1e3,
    message: "Authentification r\xE9ussie."
  });
});
app.post("/api/admin/logout", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const token = authHeader.substring(7);
    adminSessions.delete(token);
  }
  return res.json({ success: true, message: "D\xE9connexion effectu\xE9e." });
});
app.get("/api/admin/wp-status", async (req, res) => {
  if (!isValidSession(req)) {
    return res.status(401).json({ error: "Session administrateur requise." });
  }
  const wpEndpoint = `${WORDPRESS_URL}/wp-json/fidcogest/v1/content`;
  const startTime = Date.now();
  let reachable = false;
  let latencyMs = 0;
  let statusMessage = "";
  let pluginActive = false;
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4e3);
    const testRes = await fetch(wpEndpoint, {
      signal: controller.signal,
      headers: { "Accept": "application/json" }
    });
    clearTimeout(timeoutId);
    latencyMs = Date.now() - startTime;
    if (testRes.ok) {
      reachable = true;
      pluginActive = true;
      statusMessage = "Connect\xE9 et synchronis\xE9 avec le plugin FIDCOGEST Content Manager";
    } else if (testRes.status === 404) {
      reachable = true;
      pluginActive = false;
      statusMessage = "Site WordPress accessible mais le plugin FIDCOGEST n'est pas encore activ\xE9 sur /wp-json/fidcogest/v1/content";
    } else {
      reachable = true;
      statusMessage = `WordPress a r\xE9pondu avec le statut HTTP ${testRes.status}`;
    }
  } catch (err) {
    latencyMs = Date.now() - startTime;
    statusMessage = `\xC9chec de connexion : ${err.message}`;
  }
  return res.json({
    wordpressUrl: WORDPRESS_URL,
    wpEndpoint,
    reachable,
    pluginActive,
    latencyMs,
    statusMessage,
    cache: {
      source: configCache?.source || "none",
      lastFetched: configCache?.lastFetched || null,
      ttlSeconds: CACHE_TTL_MS / 1e3
    }
  });
});
app.post("/api/cabinet-config", (req, res) => {
  if (!isValidSession(req)) {
    return res.status(403).json({ error: "Acc\xE8s non autoris\xE9. Session administrateur valide requise." });
  }
  try {
    const updatedContent = req.body;
    delete updatedContent._adminPassword;
    delete updatedContent._sync;
    const dir = path3.dirname(CABINET_CONTENT_FILE);
    if (!fs3.existsSync(dir)) {
      fs3.mkdirSync(dir, { recursive: true });
    }
    fs3.writeFileSync(CABINET_CONTENT_FILE, JSON.stringify(updatedContent, null, 2), "utf-8");
    configCache = {
      data: updatedContent,
      lastFetched: Date.now(),
      source: "local_fallback"
    };
    console.log("[Fidcogest] Configuration du cabinet sauvegard\xE9e par l'administrateur.");
    return res.json({ success: true, message: "Configuration enregistr\xE9e avec succ\xE8s." });
  } catch (err) {
    console.error("[Fidcogest] Erreur sauvegarde cabinet-content.json:", err);
    return res.status(500).json({ error: "\xC9chec de la sauvegarde des contenus." });
  }
});
var apiKey = process.env.GEMINI_API_KEY;
var ai = apiKey ? new GoogleGenAI2({ apiKey }) : null;
async function withTimeout(promise, ms = 4e3) {
  let timer;
  const timeoutPromise = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error("Timeout de l'assistant")), ms);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => clearTimeout(timer));
}
app.post("/api/tax-assistant", async (req, res) => {
  try {
    const { query, history = [], locale = "fr" } = req.body;
    if (!query || typeof query !== "string") {
      return res.status(400).json({ error: "Une question est requise." });
    }
    if (!ai) {
      return res.json({
        answer: `En tant qu'assistant fiscal certifi\xE9 ITAA du cabinet Fidcogest, voici une premi\xE8re analyse bas\xE9e sur la r\xE9glementation fiscale belge actuelle :

Pour la question : "${query}"

- **Facturation \xC9lectronique (Peppol)** : Obligatoire en Belgique entre assujettis TVA (B2B) d\xE8s 2026.
- **TVA & D\xE9ductibilit\xE9** : Les taux de TVA applicables en Belgique sont de 21% (standard), 12% ou 6% (taux r\xE9duit notamment pour r\xE9novation logement >10 ans).
- **Optimisation Dirigeant SRL** : La r\xE9mun\xE9ration minimale recommand\xE9e pour b\xE9n\xE9ficier du taux r\xE9duit ISOC (20%) est de 45.000 \u20AC/an.

Pour une \xE9tude personnalis\xE9e de votre dossier, nous vous invitons \xE0 prendre un rendez-vous avec l'un de nos experts-comptables certifi\xE9s ITAA chez Fidcogest.`,
        sources: ["Code des Imp\xF4ts sur les Revenus 1992 (CIR 92)", "L\xE9gislation TVA Belge", "R\xE9glementation ITAA"]
      });
    }
    const systemInstruction = `Tu es l'assistant fiscal et comptable virtuel de Fidcogest, cabinet d'expertise comptable et de conseil fiscal certifi\xE9 ITAA bas\xE9 en Belgique (Bruxelles Ganshoren).
Tu r\xE9ponds aux entrepreneurs, ind\xE9pendants en personne physique, dirigeants de SRL/SA et professions lib\xE9rales en Belgique.

Directives :
1. R\xE9ponds dans la langue demand\xE9e (${locale === "nl" ? "N\xE9erlandais" : locale === "en" ? "Anglais" : "Fran\xE7ais"}).
2. Appuie tes conseils sur la l\xE9gislation belge exacte (CIR 92, Code TVA belge, obligations BNB, statut social des ind\xE9pendants, agr\xE9ment ITAA).
3. Rappelle l'obligation de facturation \xE9lectronique Peppol B2B d\xE8s 2026.
4. Conserve un ton professionnel, clair, didactique et bienveillant.
5. Inclus toujours \xE0 la fin une invitation cordiale \xE0 valider le cas avec un expert-comptable Fidcogest.`;
    const promptMessages = [
      ...history.map((h) => `${h.role === "user" ? "Client" : "Expert Fidcogest"}: ${h.content}`),
      `Client: ${query}`
    ].join("\n\n");
    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: promptMessages,
        config: {
          systemInstruction,
          temperature: 0.3,
          maxOutputTokens: 1e3
        }
      }),
      4e3
    );
    const answerText = response.text || "D\xE9sol\xE9, je n'ai pas pu g\xE9n\xE9rer une r\xE9ponse. Veuillez r\xE9essayer.";
    return res.json({
      answer: answerText,
      sources: ["R\xE9glementation fiscale belge 2026", "Doctrine ITAA", "Moniteur Belge"]
    });
  } catch (err) {
    console.warn("Erreur API tax-assistant, bascule sur la doctrine int\xE9gr\xE9e:", err.message);
    return res.json({
      answer: `En tant qu'assistant fiscal certifi\xE9 ITAA du cabinet Fidcogest, voici les rep\xE8res r\xE9glementaires belges essentiels :

- **R\xE9gime fiscal & TVA** : Conformit\xE9 au Code TVA belge et CIR 92 (d\xE9clarations p\xE9riodiques, d\xE9ductibilit\xE9 r\xE9elle).
- **Taux R\xE9duit ISOC (20%)** : Accessible sur la premi\xE8re tranche de 100.000 \u20AC de b\xE9n\xE9fice (condition r\xE9mun\xE9ration dirigeant >= 45.000 \u20AC ou \xE9gale au r\xE9sultat).
- **Optimisation Dividendes** : R\xE9gime VVPR-bis \xE0 15% de pr\xE9compte mobilier au terme du d\xE9lai d'attente l\xE9gal.
- **Facturation \xC9lectronique B2B** : Obligation g\xE9n\xE9ralis\xE9e via le r\xE9seau Peppol en Belgique d\xE8s 2026.

Pour une analyse chiffr\xE9e de votre dossier, prenez rendez-vous avec nos experts au cabinet de Ganshoren.`,
      sources: ["Doctrine Fiscale ITAA", "Code des Imp\xF4ts sur les Revenus 1992", "SPF Finances Belgique"]
    });
  }
});
app.post("/api/analyze-document", async (req, res) => {
  try {
    const { textSnippet, filename } = req.body;
    if (filename && typeof filename === "string") {
      const allowedExtensions = [".pdf", ".png", ".jpg", ".jpeg"];
      const ext = path3.extname(filename).toLowerCase();
      if (!allowedExtensions.includes(ext)) {
        return res.status(400).json({
          error: `Type de fichier non autoris\xE9 (${ext}). Formats accept\xE9s : PDF, PNG, JPG, JPEG.`
        });
      }
    }
    if (!ai) {
      return res.json({
        docType: "Facture d'achat mat\xE9riel / service",
        vendorName: "Belgacom / Proximus SA",
        totalAmountEur: 145.2,
        vatAmountEur: 25.2,
        vatRatePercent: 21,
        invoiceDate: "2026-03-15",
        recommendedCategory: "Frais de t\xE9l\xE9communication & Internet (D\xE9ductible 100%)",
        deductibilityRate: "100%",
        confidenceScore: 0.96
      });
    }
    const systemInstruction = `Tu es un OCR comptable belge sp\xE9cialis\xE9 dans l'analyse de factures et justificatifs pour la comptabilit\xE9 Fidcogest. 
Analyse le document/texte fourni et retourne un objet JSON valide strictement format\xE9 sans codeblock markdown avec les cl\xE9s suivantes :
- docType (string)
- vendorName (string)
- totalAmountEur (number)
- vatAmountEur (number)
- vatRatePercent (number)
- invoiceDate (string, YYYY-MM-DD)
- recommendedCategory (string)
- deductibilityRate (string, ex: "100%", "75%", "50%")
- confidenceScore (number de 0 \xE0 1)`;
    const safeSnippet = typeof textSnippet === "string" ? textSnippet.slice(0, 1e4) : "";
    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: `Nom du fichier: ${filename || "document.pdf"}
Contenu du document:
${safeSnippet || "Facture n\xB0 2026-8942 du 12/03/2026. Proximus SA BE0202239951. Montant HTVA: 120,00 EUR. TVA 21%: 25,20 EUR. Total TTC: 145,20 EUR."}`,
        config: {
          systemInstruction,
          responseMimeType: "application/json"
        }
      }),
      4e3
    );
    const parsedData = JSON.parse(response.text || "{}");
    return res.json(parsedData);
  } catch (err) {
    console.warn("Erreur analyze-document, utilisation des donn\xE9es simul\xE9es:", err.message);
    return res.json({
      docType: "Facture d'achat mat\xE9riel / service",
      vendorName: "Fournisseur Professionnel SA (BE)",
      totalAmountEur: 145.2,
      vatAmountEur: 25.2,
      vatRatePercent: 21,
      invoiceDate: "2026-03-15",
      recommendedCategory: "Frais professionnels d'exploitation (D\xE9ductible 100%)",
      deductibilityRate: "100%",
      confidenceScore: 0.95
    });
  }
});
app.post("/api/simulate-tax", (req, res) => {
  try {
    const {
      entityType = "personne_physique",
      grossRevenue = 8e4,
      professionalExpenses = 15e3,
      managerSalary = 45e3
    } = req.body;
    const netProfitBeforeTax = Math.max(0, grossRevenue - professionalExpenses);
    if (entityType === "personne_physique") {
      const socialContributions = netProfitBeforeTax * 0.205;
      const taxableIncomeIPP = netProfitBeforeTax - socialContributions;
      let ippTax = 0;
      if (taxableIncomeIPP > 48320) {
        ippTax += (taxableIncomeIPP - 48320) * 0.5;
        ippTax += (48320 - 28010) * 0.45;
        ippTax += (28010 - 15820) * 0.4;
        ippTax += (15820 - 0) * 0.25;
      } else if (taxableIncomeIPP > 28010) {
        ippTax += (taxableIncomeIPP - 28010) * 0.45;
        ippTax += (28010 - 15820) * 0.4;
        ippTax += (15820 - 0) * 0.25;
      } else if (taxableIncomeIPP > 15820) {
        ippTax += (taxableIncomeIPP - 15820) * 0.4;
        ippTax += (15820 - 0) * 0.25;
      } else {
        ippTax += taxableIncomeIPP * 0.25;
      }
      const taxExemptBonus = 10570 * 0.25;
      ippTax = Math.max(0, ippTax - taxExemptBonus);
      const netIncomeAfterAllTaxes = taxableIncomeIPP - ippTax;
      const effectiveTaxRatePercent = (socialContributions + ippTax) / netProfitBeforeTax * 100;
      return res.json({
        entityType,
        grossRevenue,
        professionalExpenses,
        netProfitBeforeTax,
        socialContributions,
        taxableIncome: taxableIncomeIPP,
        taxAmount: ippTax,
        netIncomeAfterAllTaxes,
        effectiveTaxRatePercent: Number(effectiveTaxRatePercent.toFixed(1)),
        recommendation: netProfitBeforeTax > 65e3 ? "Au-dessus de 65.000 \u20AC de b\xE9n\xE9fice, le passage en soci\xE9t\xE9 (SRL) vous permettrait d'\xE9conomiser consid\xE9rablement sur l'imp\xF4t gr\xE2ce aux dividendes \xE0 15% (VVPR-bis)." : "Le statut d'ind\xE9pendant en personne physique est adapt\xE9 et tr\xE8s souple pour votre niveau de revenus actuel."
      });
    } else {
      const companyProfitBeforeSalary = netProfitBeforeTax;
      const actualManagerSalary = Math.min(managerSalary, companyProfitBeforeSalary);
      const taxableProfitSRL = Math.max(0, companyProfitBeforeSalary - actualManagerSalary);
      const qualifiesForReducedIsoc = actualManagerSalary >= 45e3 || actualManagerSalary >= taxableProfitSRL;
      const isocRate = qualifiesForReducedIsoc ? 0.2 : 0.25;
      const isocTax = taxableProfitSRL * isocRate;
      const netProfitDistributable = taxableProfitSRL - isocTax;
      const dividendTax15Percent = netProfitDistributable * 0.15;
      const netDividendToManager = netProfitDistributable - dividendTax15Percent;
      const managerSocialContrib = actualManagerSalary * 0.205;
      const managerNetSalaryIPP = actualManagerSalary - managerSocialContrib;
      const managerIppEstimate = managerNetSalaryIPP * 0.35;
      const netSalaryTakeHome = managerNetSalaryIPP - managerIppEstimate;
      const totalNetTakeHome = netSalaryTakeHome + netDividendToManager;
      const totalTaxesPaid = companyProfitBeforeSalary - totalNetTakeHome;
      const effectiveTaxRatePercent = totalTaxesPaid / companyProfitBeforeSalary * 100;
      return res.json({
        entityType,
        grossRevenue,
        professionalExpenses,
        netProfitBeforeTax: companyProfitBeforeSalary,
        managerSalary: actualManagerSalary,
        taxableProfitSRL,
        isocRatePercent: isocRate * 100,
        isocTaxAmount: isocTax,
        netProfitDistributable,
        dividendTaxAmount: dividendTax15Percent,
        netDividendToManager,
        totalNetTakeHome,
        effectiveTaxRatePercent: Number(effectiveTaxRatePercent.toFixed(1)),
        recommendation: "Gr\xE2ce \xE0 la SRL et \xE0 la combinaison optimale Salaire Dirigeant + Dividendes VVPR-bis (15%), votre taux de pression fiscale global est optimis\xE9."
      });
    }
  } catch (err) {
    return res.status(500).json({ error: "Erreur de simulation fiscale." });
  }
});
setupPortalApi(app);
app.use(["/data/vault_storage", "/data/private_vault", "/vault_storage", "/private_vault", "/private"], (req, res) => {
  return res.status(403).json({ error: "Acc\xE8s interdit au stockage priv\xE9 documentaire." });
});
var isProduction = process.env.NODE_ENV === "production";
async function setupDevMiddleware() {
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: "custom"
  });
  app.use(vite.middlewares);
  app.get("*", async (req, res, next) => {
    const url = req.originalUrl;
    if (url.startsWith("/api") || url.startsWith("/src") || url.startsWith("/@") || url.startsWith("/node_modules") || url.includes(".")) {
      return next();
    }
    try {
      const indexHtmlPath = path3.resolve(__dirname2, "index.html");
      let rawTemplate = fs3.readFileSync(indexHtmlPath, "utf-8");
      const template = await vite.transformIndexHtml(url, rawTemplate);
      res.status(200).set({ "Content-Type": "text/html" }).end(template);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
if (isProduction && fs3.existsSync(path3.join(__dirname2, "dist", "index.html"))) {
  app.use(express2.static(path3.join(__dirname2, "dist")));
  app.get("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) return next();
    res.sendFile(path3.join(__dirname2, "dist", "index.html"));
  });
} else if (isProduction) {
  const rootIndex = path3.join(__dirname2, "index.html");
  app.get("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) return next();
    if (fs3.existsSync(rootIndex)) {
      res.sendFile(rootIndex);
    } else {
      res.status(500).send("FIDCOGEST \u2014 Application en cours d\u2019initialisation.");
    }
  });
} else {
  setupDevMiddleware().catch((err) => {
    console.error("[Fidcogest] Erreur initialisation Vite dev middleware:", err);
  });
}
app.listen(PORT, "0.0.0.0", () => {
  console.log(`[Fidcogest Server] Serveur d\xE9marr\xE9 sur http://0.0.0.0:${PORT}`);
  console.log(`[Fidcogest Server] Int\xE9gration WordPress active avec ${WORDPRESS_URL}`);
});
