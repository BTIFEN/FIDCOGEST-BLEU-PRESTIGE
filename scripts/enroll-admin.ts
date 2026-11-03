/** Run by the account owner on a PRIVATE LOCAL terminal, never Hostinger/CI. */
import fs from 'node:fs';
import readline from 'node:readline';
import { hashPassword, generateBase32Secret, generateRecoveryCodes, generateTotpCode } from '../src/server/security';
import { sealEnrollment, type BootstrapRequest } from '../src/server/privateBootstrap';

async function main() {
  if (!process.stdin.isTTY || !process.stdout.isTTY || process.env.CI) throw new Error('Terminal local privé requis.');
  const [requestFile, outputFile] = process.argv.slice(2);
  if (!requestFile || !outputFile) throw new Error('Usage: node enroll-admin.mjs request.json enrollment.enc.json');
  const request: BootstrapRequest = JSON.parse(fs.readFileSync(requestFile, 'utf8'));
  if (request.version !== 1 || !Number.isFinite(request.expiresAt) || request.expiresAt <= Date.now()) throw new Error('Demande expirée ou invalide.');
  async function ask(label: string, hidden = false): Promise<string> {
    process.stdout.write(label);
    if (!hidden) {
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
      const answer = await new Promise<string>(resolve => rl.question('', resolve)); rl.close(); return answer;
    }
    return new Promise((resolve, reject) => {
      let value = ''; process.stdin.setRawMode(true); process.stdin.resume();
      const onData = (chunk: Buffer) => {
        for (const ch of chunk.toString()) {
          if (ch === '\u0003' || ch === '\r' || ch === '\n') {
            process.stdin.off('data', onData); process.stdin.setRawMode(false); process.stdin.pause(); process.stdout.write('\n');
            if (ch === '\u0003') reject(new Error('Annulé')); else resolve(value); return;
          }
          if (ch === '\u007f' || ch === '\b') value = value.slice(0, -1); else if (ch >= ' ') value += ch;
        }
      }; process.stdin.on('data', onData);
    });
  }
  const email = (await ask('Adresse administrateur : ')).trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Adresse invalide.');
  const password = await ask('Mot de passe privé (16+ caractères, majuscule/minuscule/chiffre) : ', true);
  if (password.length < 16 || !/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/[0-9]/.test(password)) throw new Error('Mot de passe insuffisant.');
  if (password !== await ask('Confirmer : ', true)) throw new Error('Confirmation différente.');
  const secret = generateBase32Secret(20), recovery = generateRecoveryCodes(10);
  process.stdout.write('\nSur VOTRE application Authenticator, ajouter une clé TOTP (SHA1, 6 chiffres, 30 secondes).\nClé privée : ' + secret + '\n');
  const proof = await ask('Code de votre Authenticator : ', true), enrolledAt = Date.now();
  if (proof !== generateTotpCode(secret, enrolledAt)) throw new Error('Code MFA incorrect. Recommencer.');
  process.stdout.write('Codes de récupération privés, à conserver dans votre coffre :\n' + recovery.plainCodes.join('\n') + '\n');
  if (await ask('Après sauvegarde privée, saisir CONSERVE : ') !== 'CONSERVE') throw new Error('Annulé');
  const passwordRecord = hashPassword(password);
  fs.writeFileSync(outputFile, sealEnrollment(request, { email, passwordHash: passwordRecord.hash,
    passwordSalt: passwordRecord.salt, mfaSecret: secret, recoveryCodesHashed: recovery.hashedCodes, proof, enrolledAt }), { flag: 'wx', mode: 0o600 });
  process.stdout.write('Enveloppe chiffrée créée. Déposer dans le dossier privé et redémarrer sous 15 minutes.\n');
}
main().catch(() => { console.error('Amorçage interrompu. Aucun secret journalisé. Vérifier les paramètres privés.'); process.exitCode = 1; });
