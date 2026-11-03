import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { spawnSync } from 'node:child_process';
import express from 'express';
import { runPrivateBootstrap, sealEnrollment, type BootstrapRequest } from '../src/server/privateBootstrap';
import { hashPassword, generateBase32Secret, generateRecoveryCodes, generateTotpCode, decryptData, encryptData } from '../src/server/security';
import type { StoredUser } from '../src/server/db';

test('private bootstrap: disabled gate, one-time consumption, tamper/expiry/path refusal, no business fixtures', async t => {
  const previous = { ...process.env };
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'fidco-bootstrap-'));
  Object.assign(process.env, { NODE_ENV: 'test', PERSISTENT_STORAGE_DIR: root, PORTAL_ENCRYPTION_KEY: crypto.randomBytes(32).toString('hex') });
  delete process.env.FIDCOGEST_TEST_FIXTURES;
  const fake = { users: [] as StoredUser[], getUsers() { return this.users; }, saveUser(user: StoredUser) { this.users.push(user); } };
  const enrollment = () => {
    const secret = generateBase32Secret(20), record = hashPassword(crypto.randomBytes(32).toString('hex')), now = Date.now();
    return { email: 'owner@example.invalid', passwordHash: record.hash, passwordSalt: record.salt,
      mfaSecret: secret, proof: generateTotpCode(secret, now), enrolledAt: now, recoveryCodesHashed: generateRecoveryCodes(10).hashedCodes };
  };
  const dir = path.join(root, 'admin-bootstrap'), requestFile = path.join(dir, 'request.json'), envelopeFile = path.join(dir, 'enrollment.enc.json');
  const request = () => JSON.parse(fs.readFileSync(requestFile, 'utf8')) as BootstrapRequest;
  try {
    await t.test('disabled mode creates nothing', () => {
      delete process.env.FIDCOGEST_BOOTSTRAP_MODE;
      assert.equal(runPrivateBootstrap(fake), 'disabled'); assert.equal(fs.readdirSync(root).length, 0);
    });
    process.env.FIDCOGEST_BOOTSTRAP_MODE = 'file-v1';
    await t.test('existing accounts close the bootstrap without writing a request', () => {
      assert.equal(runPrivateBootstrap({ getUsers: () => [{} as StoredUser], saveUser: () => assert.fail('no write') }), 'closed');
      assert.equal(fs.readdirSync(root).length, 0);
    });
    await t.test('private challenge and encrypted server key', () => {
      assert.equal(runPrivateBootstrap(fake), 'awaiting-owner');
      assert.equal(fs.statSync(requestFile).mode & 0o777, 0o600);
      assert.equal(fs.statSync(dir).mode & 0o777, 0o700);
      assert.ok(!fs.readFileSync(path.join(dir, 'key.enc.json'), 'utf8').includes('PRIVATE KEY'));
    });
    await t.test('a concurrent attempt cannot cross the private lock', () => {
      fs.mkdirSync(path.join(dir, 'lock'), { mode: 0o700 });
      assert.equal(runPrivateBootstrap(fake), 'locked'); fs.rmdirSync(path.join(dir, 'lock'));
    });
    await t.test('expired request refuses enrollment', () => {
      const original = request(); fs.writeFileSync(requestFile, JSON.stringify({ ...original, expiresAt: Date.now() - 1 }));
      assert.equal(runPrivateBootstrap(fake), 'expired'); fs.writeFileSync(requestFile, JSON.stringify(original));
    });
    await t.test('wrong challenge, tampering and invalid MFA fail without users', () => {
      const body = enrollment();
      const good = JSON.parse(sealEnrollment(request(), body));
      fs.writeFileSync(envelopeFile, JSON.stringify({ ...good, id: 'wrong' }), { mode: 0o600 });
      assert.throws(() => runPrivateBootstrap(fake));
      fs.writeFileSync(envelopeFile, JSON.stringify({ ...good, tag: Buffer.alloc(16).toString('base64') }));
      assert.throws(() => runPrivateBootstrap(fake));
      fs.writeFileSync(envelopeFile, sealEnrollment(request(), { ...body, proof: 'invalid' }));
      assert.throws(() => runPrivateBootstrap(fake));
      fs.writeFileSync(envelopeFile, sealEnrollment(request(), { ...body, enrolledAt: Date.now() - 16 * 60000 }));
      assert.throws(() => runPrivateBootstrap(fake)); assert.equal(fake.users.length, 0);
    });
    await t.test('public-readable and symlink envelope refused', () => {
      fs.chmodSync(envelopeFile, 0o644); assert.throws(() => runPrivateBootstrap(fake)); fs.unlinkSync(envelopeFile);
      fs.symlinkSync(requestFile, envelopeFile); assert.throws(() => runPrivateBootstrap(fake)); fs.unlinkSync(envelopeFile);
    });
    await t.test('successful MFA enrollment consumes key and cannot replay even after empty restore', () => {
      const body = enrollment(), sealed = sealEnrollment(request(), body);
      assert.ok(!sealed.includes(body.mfaSecret));
      fs.writeFileSync(envelopeFile, sealed, { mode: 0o600 });
      assert.equal(runPrivateBootstrap(fake), 'created'); assert.equal(fake.users.length, 1);
      assert.equal(decryptData(fake.users[0].mfaSecretEncrypted!).toString(), body.mfaSecret);
      assert.equal(fs.existsSync(path.join(dir, 'key.enc.json')), false);
      assert.equal(runPrivateBootstrap(fake), 'closed');
      fake.users.length = 0; assert.equal(runPrivateBootstrap(fake), 'closed');
    });
    await t.test('real isolated database: login requires MFA, logout revokes, snapshot checksum and restore', async () => {
      // A second isolated private directory, never the production database.
      const integrationRoot = path.join(root, 'integration'); fs.mkdirSync(integrationRoot, { mode: 0o700 });
      process.env.PERSISTENT_STORAGE_DIR = integrationRoot;
      const { db } = await import('../src/server/db');
      assert.equal(db.getUsers().length, 0); assert.equal(db.getCompanies().length, 0); assert.equal(db.getDocuments().length, 0);
      assert.equal(runPrivateBootstrap(db), 'awaiting-owner');
      const req = JSON.parse(fs.readFileSync(path.join(integrationRoot, 'admin-bootstrap/request.json'), 'utf8'));
      const password = crypto.randomBytes(32).toString('hex'), record = hashPassword(password), body = enrollment();
      fs.writeFileSync(path.join(integrationRoot, 'admin-bootstrap/enrollment.enc.json'), sealEnrollment(req, { ...body, passwordHash: record.hash, passwordSalt: record.salt }), { mode: 0o600 });
      assert.equal(runPrivateBootstrap(db), 'created');
      const { setupPortalApi } = await import('../src/server/portalApi');
      const app = express(); app.use(express.json()); setupPortalApi(app);
      const server = app.listen(0, '127.0.0.1'); await new Promise<void>(resolve => server.once('listening', resolve));
      const base = `http://127.0.0.1:${(server.address() as { port: number }).port}/api/portal`;
      const call = (route: string, payload?: object, token?: string) => fetch(base + route, { method: payload ? 'POST' : 'GET', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) }, body: payload ? JSON.stringify(payload) : undefined });
      try {
        assert.equal((await call('/admin/backup')).status, 403);
        const login = await (await call('/auth/login', { email: body.email, password })).json() as any;
        assert.equal(login.requireMfa, true); assert.equal(login.token, undefined);
        assert.equal((await call('/auth/verify-mfa', { challengeToken: login.challengeToken, totpCode: 'invalid' })).status, 401);
        const session = await (await call('/auth/verify-mfa', { challengeToken: login.challengeToken, totpCode: generateTotpCode(body.mfaSecret) })).json() as any;
        assert.equal(session.success, true); assert.ok(session.token);
        assert.equal((await call('/auth/session', undefined, session.token)).status, 200);
        const backupResponse = await call('/admin/backup', undefined, session.token);
        assert.equal(backupResponse.headers.get('cache-control'), 'no-store');
        const exported = await backupResponse.json() as any;
        assert.equal(crypto.createHash('sha256').update(exported.backupJson).digest('hex'), exported.checksum);
        assert.equal(db.restoreFromBackup(exported.backupJson + ' ', exported.checksum).success, false);
        assert.equal(db.restoreFromBackup(exported.backupJson, exported.checksum).success, true);
        await call('/auth/logout', {}, session.token);
        assert.equal((await call('/auth/session', undefined, session.token)).status, 401);
        assert.equal((await call('/admin/storage', undefined, session.token)).status, 403);
        assert.equal(db.getCompanies().length, 0); assert.equal(db.getDocuments().length, 0);
        // Full private-directory restoration, exclusively on this disposable instance.
        const { storeEncryptedFile } = await import('../src/server/vault');
        const original = crypto.randomBytes(512);
        const stored = storeEncryptedFile('isolated-test', 'synthetic-bytes.bin', original);
        const settingsFile = path.join(integrationRoot, 'storage-settings.json');
        fs.writeFileSync(settingsFile, JSON.stringify({ google: { encryptedRefreshToken: encryptData('isolated-refresh-placeholder') } }), { mode: 0o600 });
        const snapshot = path.join(root, 'private-snapshot');
        fs.cpSync(integrationRoot, snapshot, { recursive: true });
        fs.rmSync(path.join(integrationRoot, 'vault_storage'), { recursive: true }); fs.unlinkSync(settingsFile);
        fs.cpSync(snapshot, integrationRoot, { recursive: true });
        const child = spawnSync(process.execPath, ['--import', 'tsx', '--input-type=module', '-e', `
          import assert from 'node:assert/strict';
          import fs from 'node:fs';
          const { retrieveDecryptedFile } = await import('./src/server/vault.ts');
          const { decryptData } = await import('./src/server/security.ts');
          const result = retrieveDecryptedFile(process.env.FIDCO_TEST_RESTORE_FILE);
          assert.equal(result.sha256Checksum, process.env.FIDCO_TEST_RESTORE_SHA);
          const settings = JSON.parse(fs.readFileSync(process.env.PERSISTENT_STORAGE_DIR + '/storage-settings.json', 'utf8'));
          assert.equal(decryptData(settings.google.encryptedRefreshToken).toString(), 'isolated-refresh-placeholder');
        `], { env: { ...process.env, FIDCO_TEST_RESTORE_FILE: stored.storagePath, FIDCO_TEST_RESTORE_SHA: stored.sha256Checksum }, encoding: 'utf8' });
        assert.equal(child.status, 0, 'Fresh process must read restored ciphertext and encrypted settings');
      } finally { await new Promise<void>((resolve, reject) => server.close(err => err ? reject(err) : resolve())); }
    });
  } finally {
    for (const key of Object.keys(process.env)) if (!(key in previous)) delete process.env[key];
    Object.assign(process.env, previous); fs.rmSync(root, { recursive: true, force: true });
  }
});
