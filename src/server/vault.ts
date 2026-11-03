import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { VAULT_DIRECTORY } from './db';
import { encryptData, decryptData } from './security';

export interface StoredVaultFile {
  docId: string;
  storagePath: string;
  sha256Checksum: string;
  fileSizeBytes: number;
}

/**
 * Enregistre un fichier binaire de manière chiffrée (AES-256-GCM) avec identifiant aléatoire non prédictible
 */
export function storeEncryptedFile(companyId: string, originalFilename: string, fileBuffer: Buffer): StoredVaultFile {
  const companyDir = path.join(VAULT_DIRECTORY, companyId);
  if (!fs.existsSync(companyDir)) {
    fs.mkdirSync(companyDir, { recursive: true });
  }

  // Identifiant UUIDv4 non prédictible
  const docId = `doc-${crypto.randomUUID()}`;
  const sha256Checksum = crypto.createHash('sha256').update(fileBuffer).digest('hex');

  // Chiffrement avec AES-256-GCM
  const encryptedPayload = encryptData(fileBuffer);
  const fileRecord = {
    docId,
    originalFilename,
    companyId,
    sha256Checksum,
    fileSizeBytes: fileBuffer.length,
    encryptedAt: new Date().toISOString(),
    payload: encryptedPayload
  };

  const finalDiskPath = path.join(companyDir, `${docId}.enc`);
  fs.writeFileSync(finalDiskPath, JSON.stringify(fileRecord), 'utf-8');

  return {
    docId,
    storagePath: finalDiskPath,
    sha256Checksum,
    fileSizeBytes: fileBuffer.length
  };
}

/**
 * Récupère et déchiffre en mémoire le fichier pour streaming contrôlé
 */
export function retrieveDecryptedFile(storagePath: string): { originalFilename: string; buffer: Buffer; sha256Checksum: string } {
  if (!fs.existsSync(storagePath)) {
    throw new Error(`Fichier introuvable dans le coffre privé : ${storagePath}`);
  }

  const raw = fs.readFileSync(storagePath, 'utf-8');
  const record = JSON.parse(raw);

  if (!record.payload || !record.payload.ciphertext) {
    throw new Error('Fichier chiffré corrompu ou format incompatible.');
  }

  const decryptedBuffer = decryptData(record.payload);

  // Vérification de l'intégrité SHA-256 après déchiffrement
  const computedSha = crypto.createHash('sha256').update(decryptedBuffer).digest('hex');
  if (record.sha256Checksum && computedSha !== record.sha256Checksum) {
    throw new Error('Alerte intégrité : Le checksum SHA-256 calculé ne correspond pas à l’empreinte d’origine.');
  }

  return {
    originalFilename: record.originalFilename,
    buffer: decryptedBuffer,
    sha256Checksum: computedSha
  };
}

/**
 * Suppression sécurisée du fichier chiffré sur disque
 */
export function deleteStoredFile(storagePath: string): boolean {
  try {
    if (fs.existsSync(storagePath)) {
      fs.unlinkSync(storagePath);
      return true;
    }
  } catch (err) {
    console.error('[Vault] Erreur suppression fichier:', err);
  }
  return false;
}
