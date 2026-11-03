import crypto from 'crypto';

// ============================================================================
// 1. GESTION DES CLÉS ET CHIFFREMENT AU REPOS (AES-256-GCM)
// ============================================================================

// Aucune clé de secours. Clé de 32 octets, fournie via le gestionnaire de secrets de l'hébergeur.
function getMasterKey(): Buffer {
  const value = process.env.PORTAL_ENCRYPTION_KEY;
  if (!value || !/^[a-fA-F0-9]{64}$/.test(value)) {
    throw new Error('PORTAL_ENCRYPTION_KEY doit contenir 64 caractères hexadécimaux aléatoires.');
  }
  return Buffer.from(value, 'hex');
}

/**
 * Chiffre une chaîne ou un buffer avec AES-256-GCM (authentifié)
 */
export function encryptData(data: string | Buffer): { ciphertext: string; iv: string; authTag: string } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', getMasterKey(), iv);
  
  const buffer = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
  const encrypted = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    ciphertext: encrypted.toString('base64'),
    iv: iv.toString('hex'),
    authTag: authTag.toString('hex')
  };
}

/**
 * Déchiffre une chaîne chiffrée avec AES-256-GCM
 */
export function decryptData(encrypted: { ciphertext: string; iv: string; authTag: string }): Buffer {
  const decipher = crypto.createDecipheriv(
    'aes-256-gcm',
    getMasterKey(),
    Buffer.from(encrypted.iv, 'hex')
  );
  decipher.setAuthTag(Buffer.from(encrypted.authTag, 'hex'));

  return Buffer.concat([
    decipher.update(Buffer.from(encrypted.ciphertext, 'base64')),
    decipher.final()
  ]);
}

/**
 * Hash sécurisé de mot de passe avec PBKDF2 (100 000 itérations, SHA-512)
 */
export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return { hash, salt };
}

export function verifyPassword(password: string, hash: string, salt: string): boolean {
  const testHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(testHash, 'hex'));
}

// ============================================================================
// 2. MOTEUR TOTP CONFORME RFC 6238 (AUCUN CODE DE DÉMONSTRATION)
// ============================================================================

const BASE32_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

export function generateBase32Secret(length = 20): string {
  const buffer = crypto.randomBytes(length);
  let bits = 0;
  let value = 0;
  let output = '';

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | buffer[i];
    bits += 8;
    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }
  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }
  return output;
}

function base32Decode(base32: string): Buffer {
  const clean = base32.toUpperCase().replace(/=+$/, '').replace(/[^A-Z2-7]/g, '');
  let bits = 0;
  let value = 0;
  const bytes: number[] = [];

  for (let i = 0; i < clean.length; i++) {
    const idx = BASE32_ALPHABET.indexOf(clean[i]);
    if (idx === -1) continue;
    value = (value << 5) | idx;
    bits += 5;
    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }
  return Buffer.from(bytes);
}

/**
 * Calcule le code TOTP RFC 6238 pour un horodatage donné (step 30 secondes, 6 chiffres)
 */
export function generateTotpCode(secretBase32: string, time = Date.now(), stepSeconds = 30): string {
  const key = base32Decode(secretBase32);
  const timeStep = Math.floor(time / 1000 / stepSeconds);
  const buffer = Buffer.alloc(8);
  buffer.writeBigInt64BE(BigInt(timeStep), 0);

  const hmac = crypto.createHmac('sha1', key).update(buffer).digest();
  const offset = hmac[hmac.length - 1] & 0x0f;
  const codeInt =
    ((hmac[offset] & 0x7f) << 24) |
    ((hmac[offset + 1] & 0xff) << 16) |
    ((hmac[offset + 2] & 0xff) << 8) |
    (hmac[offset + 3] & 0xff);

  const otp = codeInt % 1000000;
  return otp.toString().padStart(6, '0');
}

/**
 * Valide un code TOTP avec tolérance d'horloge (fenêtre de +- 1 pas = +- 30 secondes)
 */
export function verifyTotpCode(secretBase32: string, token: string, window = 1): boolean {
  if (!token || token.length !== 6 || !/^\d{6}$/.test(token)) {
    return false;
  }
  const now = Date.now();
  for (let w = -window; w <= window; w++) {
    const checkTime = now + w * 30 * 1000;
    const expected = generateTotpCode(secretBase32, checkTime);
    if (crypto.timingSafeEqual(Buffer.from(token, 'utf-8'), Buffer.from(expected, 'utf-8'))) {
      return true;
    }
  }
  return false;
}

/**
 * Génère 10 codes de récupération de secours à usage unique (8 caractères hexadécimaux)
 */
export function generateRecoveryCodes(count = 10): { plainCodes: string[]; hashedCodes: string[] } {
  const plainCodes: string[] = [];
  const hashedCodes: string[] = [];

  for (let i = 0; i < count; i++) {
    const code = crypto.randomBytes(4).toString('hex').toUpperCase(); // ex: 4F2A9B81
    plainCodes.push(code);
    const hash = crypto.createHash('sha256').update(code).digest('hex');
    hashedCodes.push(hash);
  }
  return { plainCodes, hashedCodes };
}

/**
 * Vérifie et consomme un code de secours
 */
export function verifyAndConsumeRecoveryCode(code: string, hashedCodes: string[]): { valid: boolean; remainingHashed: string[] } {
  const hash = crypto.createHash('sha256').update(code.trim().toUpperCase()).digest('hex');
  const index = hashedCodes.indexOf(hash);
  if (index !== -1) {
    const remaining = [...hashedCodes];
    remaining.splice(index, 1);
    return { valid: true, remainingHashed: remaining };
  }
  return { valid: false, remainingHashed: hashedCodes };
}

// ============================================================================
// 3. ANALYSE DU CONTENU RÉEL & MOTEUR ANTIVIRUS
// ============================================================================

// Signature standard inoffensive de test EICAR (RFC standard)
export const EICAR_TEST_SIGNATURE = 'X5O!P%@AP[4\\PZX54(P^)7CC)7}$EICAR-STANDARD-ANTIVIRUS-TEST-FILE!$H+H*';

export interface FileValidationResult {
  isValid: boolean;
  detectedMime: string;
  detectedExtension: 'pdf' | 'png' | 'jpg';
  fileSizeBytes: number;
  sha256Checksum: string;
  isMalwareDetected: boolean;
  malwareThreatName?: string;
  rejectionReason?: string;
}

/**
 * Analyse le contenu réel du binaire (Magic Bytes) et recherche de menaces
 */
export function inspectFileContent(buffer: Buffer, claimedFilename: string): FileValidationResult {
  const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');
  const size = buffer.length;

  // Contrôle de taille maximale (10 Mo)
  if (size > 10 * 1024 * 1024) {
    return {
      isValid: false,
      detectedMime: 'application/octet-stream',
      detectedExtension: 'pdf',
      fileSizeBytes: size,
      sha256Checksum: sha256,
      isMalwareDetected: false,
      rejectionReason: 'Fichier supérieur à la limite autorisée de 10 Mo.'
    };
  }

  // 1. Détection de la chaîne standard de test EICAR ou signature malveillante
  const textContent = buffer.toString('binary');
  if (textContent.includes(EICAR_TEST_SIGNATURE)) {
    return {
      isValid: false,
      detectedMime: 'application/x-eicar-antivirus-test',
      detectedExtension: 'pdf',
      fileSizeBytes: size,
      sha256Checksum: sha256,
      isMalwareDetected: true,
      malwareThreatName: 'EICAR-Standard-AV-Test-Signature (Test inoffensif conforme)',
      rejectionReason: 'Menace détectée par le scanner antivirus (Signature EICAR).'
    };
  }

  // 2. Détection d'exécutables déguisés (PE Windows 'MZ', ELF Linux '\x7fELF', scripts shell '#!')
  if (buffer.length >= 2 && buffer[0] === 0x4d && buffer[1] === 0x5a) {
    return {
      isValid: false,
      detectedMime: 'application/x-msdownload',
      detectedExtension: 'pdf',
      fileSizeBytes: size,
      sha256Checksum: sha256,
      isMalwareDetected: true,
      malwareThreatName: 'Win32/PE-Executable-Payload-Blocked',
      rejectionReason: 'Exécutable binaire Windows (MZ) interdit.'
    };
  }
  if (buffer.length >= 4 && buffer[0] === 0x7f && buffer[1] === 0x45 && buffer[2] === 0x4c && buffer[3] === 0x46) {
    return {
      isValid: false,
      detectedMime: 'application/x-executable',
      detectedExtension: 'pdf',
      fileSizeBytes: size,
      sha256Checksum: sha256,
      isMalwareDetected: true,
      malwareThreatName: 'Linux/ELF-Binary-Payload-Blocked',
      rejectionReason: 'Binaire exécutable Linux (ELF) interdit.'
    };
  }

  // 3. Contrôle des Magic Bytes (Vérification du format binaire réel)
  // PDF : commence par %PDF- (0x25 0x50 0x44 0x46 0x2D)
  const isPdf = buffer.length >= 5 && buffer[0] === 0x25 && buffer[1] === 0x50 && buffer[2] === 0x44 && buffer[3] === 0x46 && buffer[4] === 0x2d;

  // JPEG : commence par 0xFF 0xD8 0xFF
  const isJpeg = buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;

  // PNG : commence par 0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A (\x89PNG\r\n\x1a\n)
  const isPng =
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a;

  if (isPdf) {
    // Vérification approfondie du PDF contre les scripts intégrés malveillants
    if (textContent.includes('/JavaScript') || textContent.includes('/JS') || textContent.includes('/Launch')) {
      return {
        isValid: false,
        detectedMime: 'application/pdf',
        detectedExtension: 'pdf',
        fileSizeBytes: size,
        sha256Checksum: sha256,
        isMalwareDetected: true,
        malwareThreatName: 'Suspicious-Embedded-PDF-JavaScript',
        rejectionReason: 'Document PDF rejeté : contient du code exécutable ou JavaScript incorporé.'
      };
    }

    return {
      isValid: true,
      detectedMime: 'application/pdf',
      detectedExtension: 'pdf',
      fileSizeBytes: size,
      sha256Checksum: sha256,
      isMalwareDetected: false
    };
  }

  if (isJpeg) {
    return {
      isValid: true,
      detectedMime: 'image/jpeg',
      detectedExtension: 'jpg',
      fileSizeBytes: size,
      sha256Checksum: sha256,
      isMalwareDetected: false
    };
  }

  if (isPng) {
    return {
      isValid: true,
      detectedMime: 'image/png',
      detectedExtension: 'png',
      fileSizeBytes: size,
      sha256Checksum: sha256,
      isMalwareDetected: false
    };
  }

  return {
    isValid: false,
    detectedMime: 'application/octet-stream',
    detectedExtension: 'pdf',
    fileSizeBytes: size,
    sha256Checksum: sha256,
    isMalwareDetected: false,
    rejectionReason: `Format binaire non reconnu ou corrompu. Seuls les véritables fichiers PDF, PNG et JPEG sont acceptés.`
  };
}
