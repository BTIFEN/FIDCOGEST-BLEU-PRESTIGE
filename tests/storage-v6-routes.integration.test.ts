import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';
import express from 'express';
import { assertPrivateStorageDirectory } from '../src/server/privateStorage';

test('V6 private destinations reject webroots, builds and disguised symlinks', () => {
  assert.throws(() => assertPrivateStorageDirectory('relative'));
  assert.throws(() => assertPrivateStorageDirectory(process.cwd()));
  assert.throws(() => assertPrivateStorageDirectory(path.join(process.cwd(), 'private')));
  assert.throws(() => assertPrivateStorageDirectory('/home/test/hbuilds/current/private'));
  assert.throws(() => assertPrivateStorageDirectory('/home/test/public_html/private'));
  assert.throws(() => assertPrivateStorageDirectory('/'));
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'fidco-path-'));
  try {
    const publicDir = path.join(root, 'public_html');
    fs.mkdirSync(publicDir, {mode:0o700});
    fs.symlinkSync(publicDir, path.join(root, 'disguised'));
    assert.throws(() => assertPrivateStorageDirectory(path.join(root, 'disguised', 'new')));
    const insecure = path.join(root, 'insecure');
    fs.mkdirSync(insecure, {mode:0o755});
    assert.throws(() => assertPrivateStorageDirectory(insecure));
    assert.doesNotThrow(() => assertPrivateStorageDirectory(root));
  } finally { fs.rmSync(root, {recursive:true,force:true}); }
});

test('V6 admin routes, OAuth browser binding, Picker and encrypted Drive round-trip', async t => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'fidco-routes-'));
  Object.assign(process.env, {
    NODE_ENV:'test', PERSISTENT_STORAGE_DIR:temp,
    PORTAL_ENCRYPTION_KEY:crypto.randomBytes(32).toString('hex'),
    GOOGLE_OAUTH_CLIENT_ID:'test-client', GOOGLE_OAUTH_CLIENT_SECRET:'test-only-secret',
    GOOGLE_OAUTH_REDIRECT_URI:'https://portal.example/api/portal/storage/google/callback',
    GOOGLE_PICKER_API_KEY:'test-picker', GOOGLE_CLOUD_PROJECT_NUMBER:'1234567890'
  });
  delete process.env.FIDCOGEST_TEST_FIXTURES;
  const storage = await import('../src/server/storageProviders');
  const app = express();
  app.use(express.json());
  storage.registerStorageAdminRoutes(app, req => {
    const token = req.headers.authorization;
    return token === 'Bearer admin-test' ? {user:{id:'admin',role:'admin'}}
      : token === 'Bearer client-test' ? {user:{id:'client',role:'client'}} : null;
  }, id => id === 'test-company' ? {} : null);
  const server = app.listen(0, '127.0.0.1');
  await new Promise<void>(resolve => server.once('listening',resolve));
  const address = server.address() as {port:number};
  const base = 'http://127.0.0.1:' + address.port;
  const realFetch = globalThis.fetch;
  let uploaded = Buffer.alloc(0);
  let folderWritable = true;
  let tokenExchanges = 0;
  globalThis.fetch = (async (input:any, init:any = {}) => {
    const url = String(input);
    if (url.startsWith(base)) return realFetch(input,init);
    if (url === 'https://oauth2.googleapis.com/token') {
      const body = new URLSearchParams(init.body);
      if (body.get('grant_type') === 'authorization_code') {
        assert.ok(body.get('code_verifier'));
        tokenExchanges++;
      }
      return Response.json({access_token:'test-access-token',refresh_token:'test-refresh-token'});
    }
    if (url.includes('/about?')) return Response.json({user:{emailAddress:'test@example.invalid'}});
    if (url.includes('/upload/')) {
      const body = Buffer.from(init.body).toString('utf8');
      const record = body.split('Content-Type: application/octet-stream\r\n\r\n')[1].split('\r\n--')[0];
      uploaded = Buffer.from(record);
      return Response.json({id:'test-file-123456'});
    }
    if (url.includes('alt=media')) return new Response(uploaded);
    if (url.includes('/files/test-folder-123')) return Response.json({id:'test-folder-123',name:'FIDCOGEST-TEST',mimeType:'application/vnd.google-apps.folder',capabilities:{canAddChildren:folderWritable}});
    if (url.includes('/files?') && init.method === 'POST') return Response.json({id:'test-folder-123',name:'FIDCOGEST-TEST'});
    if (url.includes('/files?')) return Response.json({files:[{id:'test-folder-123',name:'FIDCOGEST-TEST'}]});
    throw new Error('Unexpected test URL');
  }) as typeof fetch;
  const adminHeaders = {Authorization:'Bearer admin-test','Content-Type':'application/json'};
  const call = (endpoint:string,init:RequestInit={}) => fetch(base+'/api/portal/admin/storage'+endpoint,{...init,headers:{...adminHeaders,...init.headers}});
  try {
    await t.test('all configuration routes reject anonymous users and clients', async () => {
      for (const [method, endpoint] of [['GET',''],['PUT',''],['DELETE','/companies/test-company'],['GET','/google/authorize'],['GET','/google/picker-session'],['GET','/google/folders'],['POST','/google/folders']]) {
        for (const Authorization of ['', 'Bearer client-test']) {
          const res = await call(endpoint,{method,headers:{Authorization}});
          assert.equal(res.status,403);
          assert.equal(res.headers.get('cache-control'),'no-store');
        }
      }
    });
    await t.test('OAuth is bound to initiating browser and can be used only once', async () => {
      const auth = await call('/google/authorize');
      const url = new URL((await auth.json()).url);
      assert.equal(url.searchParams.get('scope'),'https://www.googleapis.com/auth/drive.file');
      assert.equal(url.searchParams.get('code_challenge_method'),'S256');
      const cookie = auth.headers.get('set-cookie')!.split(';')[0];
      assert.match(auth.headers.get('set-cookie')!,/HttpOnly/);
      const callback = base+'/api/portal/storage/google/callback?state='+url.searchParams.get('state')+'&code=test-code';
      assert.equal((await fetch(callback)).status,400);
      assert.equal(tokenExchanges,0);
      assert.equal((await fetch(callback,{headers:{Cookie:cookie}})).status,200);
      assert.equal((await fetch(callback,{headers:{Cookie:cookie}})).status,400);
      const disk = fs.readFileSync(path.join(temp,'storage-settings.json'),'utf8');
      assert.ok(!disk.includes('test-refresh-token'));
      const config = await (await call('')).json();
      assert.equal(config.googleConnected,true);
      assert.ok(!JSON.stringify(config).includes('test-refresh-token'));
    });
    await t.test('Picker accepts numeric project number and rejects invalid values', async () => {
      let res = await call('/google/picker-session');
      assert.equal(res.status,200);
      assert.equal(res.headers.get('cache-control'),'no-store');
      assert.equal((await res.json()).appId,'1234567890');
      process.env.GOOGLE_CLOUD_PROJECT_NUMBER = 'not-a-number';
      assert.equal((await call('/google/picker-session')).status,503);
      process.env.GOOGLE_CLOUD_PROJECT_NUMBER = '1234567890';
    });
    await t.test('folder creation, destination permissions and provider preservation', async () => {
      assert.equal((await call('/google/folders',{method:'POST',body:JSON.stringify({name:'FIDCOGEST-TEST'})})).status,201);
      const legacy = await storage.savePortalDocument('test-company','local-test.pdf',Buffer.from('%PDF-1.4 local fictitious test'));
      folderWritable = false;
      const init = {method:'PUT',body:JSON.stringify({companyId:'test-company',provider:'google_drive',folderId:'test-folder-123'})};
      assert.equal((await call('',init)).status,503);
      folderWritable = true;
      assert.equal((await call('',init)).status,200);
      const input = Buffer.from('%PDF-1.4\nFIDCOGEST FICTITIOUS DRIVE TEST\n%%EOF');
      const saved = await storage.savePortalDocument('test-company','fictitious.pdf',input);
      assert.equal(saved.provider,'google_drive');
      assert.ok(!uploaded.includes(Buffer.from('FIDCOGEST FICTITIOUS DRIVE TEST')));
      assert.deepEqual((await storage.readPortalDocument(saved.storagePath)).buffer,input);
      assert.deepEqual((await storage.readPortalDocument(legacy.storagePath)).buffer,Buffer.from('%PDF-1.4 local fictitious test'));
      const record = JSON.parse(uploaded.toString());
      record.payload.authTag = '00'.repeat(16);
      uploaded = Buffer.from(JSON.stringify(record));
      await assert.rejects(storage.readPortalDocument(saved.storagePath));
    });
  } finally {
    globalThis.fetch = realFetch;
    await new Promise<void>(resolve => server.close(()=>resolve()));
    fs.rmSync(temp,{recursive:true,force:true});
  }
});
