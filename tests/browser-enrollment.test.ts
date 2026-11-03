import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import { runPrivateBootstrap } from '../src/server/privateBootstrap';
import { generateTotpCode, verifyPassword, decryptData, verifyAndConsumeRecoveryCode } from '../src/server/security';
import { readRequest, passwordRecord, newMfaSecret, totp, recoveryCodes, makeEnvelope } from '../public/enrollment/crypto.mjs';
import type { StoredUser } from '../src/server/db';
import express from 'express';
import { registerBrowserEnrollment } from '../src/server/browserEnrollment';

test('browser Web Crypto envelope is accepted by the unchanged private server bootstrap', async () => {
  const previous = { ...process.env };
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'fidco-browser-'));
  Object.assign(process.env, { PERSISTENT_STORAGE_DIR: root, PORTAL_ENCRYPTION_KEY: crypto.randomBytes(32).toString('hex'), FIDCOGEST_BOOTSTRAP_MODE: 'file-v1' });
  const database = { users: [] as StoredUser[], getUsers() { return this.users; }, saveUser(user: StoredUser) { this.users.push(user); } };
  try {
    assert.equal(runPrivateBootstrap(database), 'awaiting-owner');
    const request = await readRequest('\uFEFF' + fs.readFileSync(path.join(root, 'admin-bootstrap/request.json'), 'utf8'));
    const password = 'Synthetic-' + crypto.randomBytes(24).toString('hex') + 'A1';
    const record = await passwordRecord(password, password);
    assert.equal(verifyPassword(password, record.passwordHash, record.passwordSalt), true);
    await assert.rejects(passwordRecord('weak', 'weak'), /PASSWORD_WEAK/);
    await assert.rejects(passwordRecord(password, password + 'x'), /PASSWORD_MISMATCH/);
    const secret = newMfaSecret(), now = Date.now();
    assert.match(secret, /^[A-Z2-7]{32}$/);
    for (const time of [now, 0, 59000, 1111111109000, 2000000000000]) {
      assert.equal(await totp(secret, time), generateTotpCode(secret, time));
    }
    const recovery = await recoveryCodes();
    assert.equal(new Set(recovery.plain).size, 10);
    assert.equal(verifyAndConsumeRecoveryCode(recovery.plain[0], recovery.hashed).valid, true);
    const payload = { email: 'isolated-owner@example.invalid', ...record, mfaSecret: secret,
      enrolledAt: now, proof: await totp(secret, now), recoveryCodesHashed: recovery.hashed };
    const envelope = await makeEnvelope(request, payload);
    for (const sensitive of [password, secret, ...recovery.plain]) assert.equal(envelope.includes(sensitive), false);
    await assert.rejects(makeEnvelope(request, { ...payload, proof: 'invalid' }), /MFA_EXPIRED/);
    await assert.rejects(makeEnvelope(request, { ...payload, enrolledAt: now - 16 * 60000 }), /MFA_EXPIRED/);
    await assert.rejects(readRequest(JSON.stringify({ ...request, expiresAt: 0 })), /REQUEST_INVALID/);
    await assert.rejects(readRequest('null'), /REQUEST_INVALID/);
    await assert.rejects(readRequest(JSON.stringify({ ...request, publicKey: 'invalid' })), /REQUEST_INVALID/);
    const file = path.join(root, 'admin-bootstrap/enrollment.enc.json');
    fs.writeFileSync(file, envelope, { mode: 0o600 });
    const tampered = JSON.parse(envelope); tampered.tag = Buffer.alloc(16).toString('base64');
    fs.writeFileSync(file, JSON.stringify(tampered));
    assert.throws(() => runPrivateBootstrap(database)); assert.equal(database.users.length, 0);
    fs.writeFileSync(file, envelope);
    assert.equal(runPrivateBootstrap(database), 'created'); assert.equal(database.users.length, 1);
    assert.equal(decryptData(database.users[0].mfaSecretEncrypted!).toString(), secret);
    assert.equal(verifyPassword(password, database.users[0].passwordHash!, database.users[0].passwordSalt!), true);
    assert.equal(runPrivateBootstrap(database), 'closed');
  } finally {
    for (const key of Object.keys(process.env)) if (!(key in previous)) delete process.env[key];
    Object.assign(process.env, previous); fs.rmSync(root, { recursive: true, force: true });
  }
});

test('preparation has no network submission, storage, telemetry or external script', () => {
  const app = fs.readFileSync('public/enrollment/app.mjs', 'utf8');
  const cryptoModule = fs.readFileSync('public/enrollment/crypto.mjs', 'utf8');
  const html = fs.readFileSync('public/preparer-administrateur.html', 'utf8');
  assert.doesNotMatch(app + cryptoModule, /\bfetch\s*\(|XMLHttpRequest|sendBeacon|WebSocket|localStorage|sessionStorage|indexedDB|console\./);
  assert.doesNotMatch(html, /<script[^>]*src=["']https?:/);
  assert.match(app, /pagehide/); assert.match(app, /revokeObjectURL/);
  const server = fs.readFileSync('server.ts', 'utf8');
  assert.match(server, /connect-src 'none'/); assert.match(server, /form-action 'none'/);
});

test('canonical browser preparation passes through Node and enforces security headers', async () => {
  const app = express(); registerBrowserEnrollment(app, path.resolve('public'));
  const server = app.listen(0, '127.0.0.1'); await new Promise<void>(resolve => server.once('listening', resolve));
  try {
    const response = await fetch(`http://127.0.0.1:${(server.address() as { port: number }).port}/preparer-administrateur`);
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.equal(response.headers.get('referrer-policy'), 'no-referrer');
    assert.equal(response.headers.get('x-frame-options'), 'DENY');
    const csp = response.headers.get('content-security-policy')!;
    for (const directive of ["connect-src 'none'", "form-action 'none'", "frame-ancestors 'none'"]) assert.ok(csp.includes(directive));
    const html = await response.text();
    assert.ok(html.includes('step-credentials'));
    assert.match(html, /http-equiv="Content-Security-Policy"/);
    const script = fs.readFileSync('public/enrollment/app.mjs', 'utf8');
    assert.match(script, /window.top !== window.self/);
    assert.match(script, /location.replace\('\/preparer-administrateur'\)/);
    for (const name of ['app', 'crypto']) {
      const asset = await fetch(`http://127.0.0.1:${(server.address() as { port: number }).port}/enrollment/${name}.js`);
      assert.equal(asset.status, 200);
      assert.match(asset.headers.get('content-type')!, /application\/javascript/);
      assert.equal(asset.headers.get('cache-control'), 'no-store');
    }
    assert.match(html, /src="\/enrollment\/app.js"/);
    assert.match(script, /from '.\/crypto.js'/);
  } finally { await new Promise<void>((resolve, reject) => server.close(err => err ? reject(err) : resolve())); }
});
