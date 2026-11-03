// Browser-only preparation. No network, persistence or account creation here.
const encoder = new TextEncoder();
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
const bytes = size => crypto.getRandomValues(new Uint8Array(size));
const hex = value => Array.from(value, x => x.toString(16).padStart(2, '0')).join('');
const base64 = value => btoa(String.fromCharCode(...new Uint8Array(value)));

export async function readRequest(raw, now = Date.now()) {
  if (typeof raw !== 'string' || raw.length > 32768) throw new Error('REQUEST_INVALID');
  let request;
  try { request = JSON.parse(raw.replace(/^\uFEFF/, '')); } catch { throw new Error('REQUEST_INVALID'); }
  if (!request || request.version !== 1 || !/^[a-f0-9]{64}$/.test(request.id) ||
      !Number.isFinite(request.expiresAt) || request.expiresAt <= now || typeof request.publicKey !== 'string') throw new Error('REQUEST_INVALID');
  await importPublicKey(request.publicKey);
  return { version: 1, id: request.id, expiresAt: request.expiresAt, publicKey: request.publicKey };
}

async function importPublicKey(pem) {
  try {
    const der = Uint8Array.from(atob(pem.replace(/-----BEGIN PUBLIC KEY-----|-----END PUBLIC KEY-----|\s/g, '')), x => x.charCodeAt(0));
    const key = await crypto.subtle.importKey('spki', der, { name: 'RSA-OAEP', hash: 'SHA-256' }, false, ['encrypt']);
    if (key.algorithm.modulusLength < 3072) throw new Error();
    return key;
  } catch { throw new Error('REQUEST_INVALID'); }
}

export async function passwordRecord(password, confirmation) {
  if (typeof password !== 'string' || password.length < 16 || password.length > 1024 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) throw new Error('PASSWORD_WEAK');
  if (password !== confirmation) throw new Error('PASSWORD_MISMATCH');
  const salt = hex(bytes(16));
  const key = await crypto.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  // Existing server PBKDF2 uses the ASCII hexadecimal salt, not decoded bytes.
  const hash = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-512', salt: encoder.encode(salt), iterations: 100000 }, key, 512);
  return { passwordHash: hex(new Uint8Array(hash)), passwordSalt: salt };
}

export function newMfaSecret() {
  let value = 0, bits = 0, output = '';
  for (const byte of bytes(20)) {
    value = (value << 8) | byte; bits += 8;
    while (bits >= 5) { output += alphabet[(value >>> (bits - 5)) & 31]; bits -= 5; }
  }
  return output;
}

export async function totp(secret, time = Date.now()) {
  if (!/^[A-Z2-7]{32}$/.test(secret)) throw new Error('MFA_INVALID');
  let bits = 0, value = 0; const decoded = [];
  for (const char of secret) {
    value = (value << 5) | alphabet.indexOf(char); bits += 5;
    if (bits >= 8) { decoded.push((value >>> (bits - 8)) & 255); bits -= 8; }
  }
  const counter = new Uint8Array(8);
  new DataView(counter.buffer).setBigUint64(0, BigInt(Math.floor(time / 30000)), false);
  const key = await crypto.subtle.importKey('raw', new Uint8Array(decoded), { name: 'HMAC', hash: 'SHA-1' }, false, ['sign']);
  const digest = new Uint8Array(await crypto.subtle.sign('HMAC', key, counter));
  const offset = digest[digest.length - 1] & 15;
  const number = ((digest[offset] & 127) << 24) | (digest[offset + 1] << 16) | (digest[offset + 2] << 8) | digest[offset + 3];
  return String(number % 1000000).padStart(6, '0');
}

export async function recoveryCodes() {
  const plain = new Set();
  while (plain.size < 10) plain.add(hex(bytes(4)).toUpperCase());
  const codes = [...plain];
  const hashed = await Promise.all(codes.map(async code => hex(new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(code))))));
  return { plain: codes, hashed };
}

export async function makeEnvelope(request, payload, now = Date.now()) {
  if (request.expiresAt <= now) throw new Error('REQUEST_INVALID');
  if (!Number.isFinite(payload.enrolledAt) || payload.enrolledAt > now + 30000 || now - payload.enrolledAt > 15 * 60000 ||
      !/^\d{6}$/.test(payload.proof) || await totp(payload.mfaSecret, payload.enrolledAt) !== payload.proof) throw new Error('MFA_EXPIRED');
  const publicKey = await importPublicKey(request.publicKey);
  const keyBytes = bytes(32), iv = bytes(12);
  const key = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, ['encrypt']);
  const encrypted = new Uint8Array(await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: encoder.encode(request.id), tagLength: 128 }, key, encoder.encode(JSON.stringify(payload))));
  const wrapped = await crypto.subtle.encrypt({ name: 'RSA-OAEP' }, publicKey, keyBytes);
  keyBytes.fill(0);
  return JSON.stringify({ version: 1, id: request.id, key: base64(wrapped), iv: base64(iv),
    tag: base64(encrypted.slice(-16)), ciphertext: base64(encrypted.slice(0, -16)) });
}
