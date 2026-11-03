import { readRequest, passwordRecord, newMfaSecret, totp, recoveryCodes, makeEnvelope } from './crypto.js';

// Do not enable secret entry in an iframe or at the static-server bypass URL.
if (window.top !== window.self) {
  document.body.replaceChildren(document.createTextNode('Ouvrez cette page directement dans votre navigateur.'));
  throw new Error('DIRECT_WINDOW_REQUIRED');
}
if (location.pathname !== '/preparer-administrateur') {
  location.replace('/preparer-administrateur');
  throw new Error('CANONICAL_ROUTE_REQUIRED');
}

const byId = id => document.getElementById(id);
let state = {}, downloadUrl, timer;
const messages = {
  REQUEST_INVALID: 'Demande invalide ou expirée. Sélectionnez le fichier request.json récupéré dans le gestionnaire privé.',
  PASSWORD_WEAK: 'Choisissez au moins 16 caractères avec majuscule, minuscule et chiffre.',
  PASSWORD_MISMATCH: 'Les deux mots de passe ne correspondent pas.',
  MFA_INVALID: 'Code incorrect. Attendez un nouveau code sur votre téléphone puis réessayez.',
  MFA_EXPIRED: 'La vérification MFA a expiré. Effacez cette préparation et recommencez avec un nouveau code.',
  EMAIL_INVALID: 'Vérifiez l’adresse de l’administrateur.'
};
function error(problem) {
  byId('error').textContent = messages[problem?.message] || 'Cette étape a échoué. Aucun détail privé n’a été journalisé. Vérifiez votre fichier et réessayez.';
  byId('error').hidden = false; byId('error').scrollIntoView({ block: 'nearest' });
}
function hideError() { byId('error').hidden = true; byId('error').textContent = ''; }
function clearSecrets() {
  state = {}; clearInterval(timer);
  for (const id of ['password', 'confirmation', 'code', 'email', 'request']) byId(id).value = '';
  byId('mfa-secret').textContent = ''; byId('recovery-codes').textContent = '';
  if (downloadUrl) URL.revokeObjectURL(downloadUrl);
  downloadUrl = undefined; byId('download').removeAttribute('href');
}
function reset() { clearSecrets(); location.reload(); }
byId('clear').addEventListener('click', reset);
window.addEventListener('pagehide', clearSecrets);
window.addEventListener('pageshow', event => { if (event.persisted) location.reload(); });

if (!isSecureContext || !crypto?.subtle) {
  byId('request').disabled = true;
  error(new Error('UNSUPPORTED'));
} else {
  byId('request').addEventListener('change', async () => {
    hideError();
    try {
      const file = byId('request').files?.[0];
      if (!file || file.size > 32768) throw new Error('REQUEST_INVALID');
      state.request = await readRequest(await file.text());
      byId('request-status').textContent = 'Demande reconnue. Échéance : ' + new Date(state.request.expiresAt).toLocaleString('fr-BE');
      byId('request').disabled = true; byId('step-credentials').hidden = false; byId('email').focus();
    } catch (problem) { state = {}; error(problem); }
  });

  byId('credentials').addEventListener('submit', async event => {
    event.preventDefault(); hideError();
    const button = event.submitter; button.disabled = true;
    try {
      const email = byId('email').value.trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('EMAIL_INVALID');
      const record = await passwordRecord(byId('password').value, byId('confirmation').value);
      byId('password').value = ''; byId('confirmation').value = '';
      Object.assign(state, { email, ...record, mfaSecret: newMfaSecret() });
      byId('mfa-secret').textContent = state.mfaSecret;
      byId('step-credentials').hidden = true; byId('step-mfa').hidden = false; byId('code').focus();
    } catch (problem) { error(problem); } finally { button.disabled = false; }
  });

  byId('mfa').addEventListener('submit', async event => {
    event.preventDefault(); hideError();
    const button = event.submitter; button.disabled = true;
    try {
      const code = byId('code').value.trim(), enrolledAt = Date.now(); byId('code').value = '';
      if (!/^\d{6}$/.test(code) || code !== await totp(state.mfaSecret, enrolledAt)) throw new Error('MFA_INVALID');
      const recovery = await recoveryCodes();
      Object.assign(state, { proof: code, enrolledAt, recoveryCodesHashed: recovery.hashed });
      byId('recovery-codes').textContent = recovery.plain.join('\n');
      byId('mfa-secret').textContent = ''; byId('step-mfa').hidden = true;
      byId('step-recovery').hidden = false; byId('saved').focus();
    } catch (problem) { error(problem); } finally { button.disabled = false; }
  });

  byId('recovery').addEventListener('submit', async event => {
    event.preventDefault(); hideError();
    if (!byId('saved').checked) return;
    const button = event.submitter; button.disabled = true;
    try {
      const { request, ...payload } = state;
      const envelope = await makeEnvelope(request, payload);
      const deadline = Math.min(request.expiresAt, payload.enrolledAt + 15 * 60000);
      downloadUrl = URL.createObjectURL(new Blob([envelope], { type: 'application/json' }));
      byId('download').href = downloadUrl;
      state = {}; byId('email').value = ''; byId('recovery-codes').textContent = '';
      byId('step-recovery').hidden = true; byId('step-request').hidden = true; byId('step-done').hidden = false;
      const tick = () => {
        const seconds = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
        byId('deadline').textContent = seconds > 0 ? 'Temps restant pour le dépôt et le redémarrage : ' + Math.floor(seconds / 60) + ' min ' + (seconds % 60) + ' s.' : 'Échéance dépassée : ne déposez pas ce fichier. Effacez cette session et recommencez.';
        if (!seconds) { clearInterval(timer); URL.revokeObjectURL(downloadUrl); byId('download').removeAttribute('href'); }
      };
      tick(); timer = setInterval(tick, 1000); byId('download').focus();
    } catch (problem) { error(problem); } finally { button.disabled = false; }
  });
}
