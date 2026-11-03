import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const read = (p) => fs.readFileSync(new URL('../' + p, import.meta.url), 'utf8');
test('login form has no shared demo password or quick-fill', () => {
 const ui = read('src/components/portal/AuthLoginModal.tsx');
 assert.doesNotMatch(ui, /Fidcogest2026!|DEMO-OVERRIDE|current-totp|Profils d.audit|handleQuickFillRole/);
});
test('MFA disclosure route is absent', () => {
 assert.doesNotMatch(read('src/server/portalApi.ts'), /router\.post\('\/auth\/current-totp'/);
});
test('new database starts without users and documents', () => {
 const db = read('src/server/db.ts');
 assert.match(db, /users:\s*\[\]/);
 assert.match(db, /sessions:\s*\[\]/);
 assert.doesNotMatch(db, /defaultPassword|initialUsers: StoredUser\[\]/);
});
test('no fallback key for encryption', () => {
 const sec = read('src/server/security.ts');
 assert.match(sec, /PORTAL_ENCRYPTION_KEY/);
 assert.doesNotMatch(sec, /fidcogest-master-cryptographic-salt/);
});
test('admin bootstrap is single-use', () => {
 const cli = read('scripts/bootstrap-admin.ts');
 assert.match(cli, /process.exitCode = 1/);
 assert.doesNotMatch(cli, /console.log|BOOTSTRAP_ADMIN_PASSWORD/);
 assert.doesNotMatch(cli, /Fidcogest2026!/);
});
