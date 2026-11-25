import test from 'node:test';
import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import express from 'express';

const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'fidcogest-admin-users-'));
Object.assign(process.env, {
  NODE_ENV: 'test',
  PERSISTENT_STORAGE_DIR: temp,
  FIDCOGEST_TEST_FIXTURES: 'false',
  PORTAL_ENCRYPTION_KEY: crypto.randomBytes(32).toString('hex')
});

const [{ setupPortalApi }, { db }] = await Promise.all([
  import('../src/server/portalApi'),
  import('../src/server/db')
]);

const app = express();
app.use(express.json());
setupPortalApi(app);
const company = (id: string) => ({
  id,
  legalName: `Société fictive ${id}`,
  legalForm: 'SRL' as const,
  vatNumber: `BE00000000${id.endsWith('a') ? '1' : '2'}`,
  bceNumber: '0000.000.000',
  address: 'Rue de Test 1',
  city: 'Liège',
  postalCode: '4000',
  assignedManagerId: '',
  assignedManagerName: '',
  clientUserIds: [] as string[],
  contactEmail: `${id}@example.invalid`,
  contactPhone: '',
  accountingRegime: 'Régime Trimestriel' as const,
  fiscalYearEnd: '31/12',
  status: 'actif' as const
});
const makeUser = (id: string, role: 'admin' | 'supervisor' | 'manager' | 'client', assignedCompanyIds: string[] = [], status: 'actif' | 'en_attente_invitation' | 'suspendu' = 'actif') => ({
  id, email: `${id}@example.invalid`, fullName: `Utilisateur fictif ${id}`, role,
  assignedCompanyIds, status, mfaEnabled: true, createdAt: new Date().toISOString()
});
db.getCompanies().push(company('company-a'), company('company-b'));
db.save();
db.saveUser(makeUser('admin-1', 'admin'));
db.saveUser(makeUser('admin-2', 'admin'));
db.saveUser(makeUser('supervisor-1', 'supervisor'));
db.saveUser(makeUser('manager-1', 'manager'));
db.saveUser(makeUser('client-a', 'client', ['company-a']));
db.saveUser(makeUser('client-b', 'client', ['company-b']));

const server = app.listen(0, '127.0.0.1');
await new Promise<void>((resolve) => server.once('listening', resolve));
const base = `http://127.0.0.1:${(server.address() as { port: number }).port}`;
const adminToken = db.createSession('admin-1', '127.0.0.1', 'fictitious-test').token;
const supervisorToken = db.createSession('supervisor-1', '127.0.0.1', 'fictitious-test').token;
const clientAToken = db.createSession('client-a', '127.0.0.1', 'fictitious-test').token;
const clientBToken = db.createSession('client-b', '127.0.0.1', 'fictitious-test').token;
const call = (path: string, token: string, init: RequestInit = {}) => fetch(base + '/api/portal' + path, {
  ...init,
  headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...init.headers }
});

test('administrative user operations enforce MFA, tenant boundaries and session revocation', async (t) => {
  try {
    await t.test('cross-company reads are denied for two separate client accounts', async () => {
      assert.equal((await call('/companies/company-b', clientAToken)).status, 403);
      assert.equal((await call('/documents?companyId=company-b', clientAToken)).status, 403);
      assert.equal((await call('/companies/company-a', clientBToken)).status, 403);
    });

    await t.test('invitation tokens are unique, hashed in storage and expire after 72 hours', async () => {
      const staleToken = db.createSession('admin-1', '127.0.0.1', 'stale-mfa', Date.now() - 6 * 60 * 1000).token;
      const stale = await call('/admin/users/invitations', staleToken, { method: 'POST', body: JSON.stringify({
        email: 'blocked@example.invalid', fullName: 'Compte Fictif', role: 'client', companyIds: ['company-a']
      }) });
      assert.equal(stale.status, 403);

      const denied = await call('/admin/users/invitations', supervisorToken, { method: 'POST', body: JSON.stringify({
        email: 'blocked@example.invalid', fullName: 'Compte Fictif', role: 'client', companyIds: ['company-a']
      }) });
      assert.equal(denied.status, 403);

      const response = await call('/admin/users/invitations', adminToken, { method: 'POST', body: JSON.stringify({
        email: 'invitee@example.invalid', fullName: 'Gestionnaire Fictif', role: 'manager', companyIds: ['company-a']
      }) });
      assert.equal(response.status, 201);
      const payload = await response.json();
      assert.equal(typeof payload.invitationToken, 'string');
      const invited = db.getUserById(payload.user.id)!;
      assert.equal(invited.status, 'en_attente_invitation');
      assert.notEqual(invited.inviteTokenHash, payload.invitationToken);
      assert.equal(invited.inviteTokenHash, crypto.createHash('sha256').update(payload.invitationToken).digest('hex'));
      assert.equal(Math.round((Date.parse(invited.inviteExpiresAt!) - Date.now()) / 3600000), 72);
      const duplicate = await call('/admin/users/invitations', adminToken, { method: 'POST', body: JSON.stringify({
        email: 'invitee@example.invalid', fullName: 'Autre Compte Fictif', role: 'client', companyIds: ['company-a']
      }) });
      assert.equal(duplicate.status, 409);
      assert.equal((await call('/admin/users/invitations', adminToken, { method: 'POST', body: JSON.stringify({
        email: 'other@example.invalid', fullName: 'Compte Fictif', role: 'admin', companyIds: ['company-a']
      }) })).status, 400);
    });

    await t.test('manager assignment updates both sides and is audited', async () => {
      const response = await call('/admin/companies/company-b/manager', adminToken, {
        method: 'PUT', body: JSON.stringify({ managerId: 'manager-1' })
      });
      assert.equal(response.status, 200);
      assert.equal(db.getCompanyById('company-b')?.assignedManagerId, 'manager-1');
      assert.ok(db.getUserById('manager-1')?.assignedCompanyIds.includes('company-b'));
      assert.ok(db.getAuditLogs().some((entry) => entry.action === 'Gestionnaire affecté à une entreprise'));
    });

    await t.test('suspension revokes sessions immediately and last active admin is protected', async () => {
      const suspension = await call('/admin/users/client-a/suspend', adminToken, { method: 'POST' });
      assert.equal(suspension.status, 200);
      assert.equal(db.getSession(clientAToken), undefined);
      assert.equal((await call('/auth/session', clientAToken)).status, 401);
      assert.equal(db.getUserById('client-a')?.status, 'suspendu');

      const lastAdmin = await call('/admin/users/admin-1/suspend', adminToken, { method: 'POST' });
      assert.equal(lastAdmin.status, 409);
      assert.equal(db.getUserById('admin-1')?.status, 'actif');
    });

    await t.test('administrative events are journalled without invitation tokens', async () => {
      const logs = db.getAuditLogs();
      assert.ok(logs.some((entry) => entry.action === 'Invitation utilisateur créée'));
      assert.ok(logs.some((entry) => entry.action === 'Utilisateur suspendu'));
      const serializedLogs = JSON.stringify(logs);
      assert.ok(!serializedLogs.includes('invitee@example.invalid') || serializedLogs.includes('Invitation créée pour invitee@example.invalid'));
      assert.ok(!serializedLogs.includes('invitationToken'));
    });
  } finally {
    await new Promise<void>((resolve) => server.close(() => resolve()));
    fs.rmSync(temp, { recursive: true, force: true });
  }
});
