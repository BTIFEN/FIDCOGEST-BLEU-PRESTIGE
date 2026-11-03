/** Initialisation explicite du premier administrateur FIDCOGEST. Aucun compte de démonstration. */
import crypto from 'node:crypto';
import { db } from '../src/server/db';
import { hashPassword, generateBase32Secret, encryptData, generateRecoveryCodes } from '../src/server/security';

const email = (process.env.BOOTSTRAP_ADMIN_EMAIL || '').trim().toLowerCase();
const password = process.env.BOOTSTRAP_ADMIN_PASSWORD || '';
if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
    password.length < 16 || !/[0-9]/.test(password) || !/[A-Z]/.test(password) || !/[a-z]/.test(password)) {
  console.error('BOOTSTRAP_ADMIN_EMAIL et BOOTSTRAP_ADMIN_PASSWORD robuste (16+ caractères, majuscule, minuscule, chiffre) requis.');
  process.exit(1);
}
if (db.getUsers().length !== 0) {
  console.error('Initialisation refusée : au moins un utilisateur existe déjà.');
  process.exit(1);
}
if (!process.env.PERSISTENT_STORAGE_DIR) {
  console.error('PERSISTENT_STORAGE_DIR est obligatoire pour créer le premier compte.');
  process.exit(1);
}
if (!/^[a-fA-F0-9]{64}$/.test(process.env.PORTAL_ENCRYPTION_KEY || '')) {
  console.error('PORTAL_ENCRYPTION_KEY doit contenir exactement 64 caractères hexadécimaux.');
  process.exit(1);
}
const mfaSecret = generateBase32Secret(20);
const recovery = generateRecoveryCodes(10);
const hash = hashPassword(password);
db.saveUser({
  id: 'admin-' + crypto.randomUUID(),
  email,
  fullName: 'Administrateur FIDCOGEST',
  role: 'admin',
  assignedCompanyIds: [],
  status: 'actif',
  mfaEnabled: true,
  mfaSecretEncrypted: encryptData(mfaSecret),
  recoveryCodesHashed: recovery.hashedCodes,
  passwordHash: hash.hash,
  passwordSalt: hash.salt,
  createdAt: new Date().toISOString()
});
console.log('Compte administrateur créé. Lisez les informations MFA uniquement dans un terminal privé.');
console.log('URI TOTP : otpauth://totp/FIDCOGEST:' + encodeURIComponent(email) + '?secret=' + mfaSecret + '&issuer=FIDCOGEST');
console.log('Codes de récupération à conserver hors ligne : ' + recovery.plainCodes.join(' '));
