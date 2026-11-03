import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import crypto from 'node:crypto';

test('Hostinger provider stores encrypted bytes and reads exact content', async () => {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'fidcogest-storage-v6-'));
  process.env.PERSISTENT_STORAGE_DIR = temp;
  process.env.PORTAL_ENCRYPTION_KEY = crypto.randomBytes(32).toString('hex');
  process.env.NODE_ENV = 'test';
  delete process.env.FIDCOGEST_TEST_FIXTURES;
  try {
    const { savePortalDocument, readPortalDocument } = await import('../src/server/storageProviders.ts');
    const input = Buffer.from('%PDF-1.4\nFIDCOGEST STORAGE TEST\n%%EOF');
    const saved = await savePortalDocument('company-storage-v6', 'test.pdf', input);
    assert.equal(saved.provider,'hostinger');
    assert.equal(saved.storagePath.startsWith(temp),true);
    const raw = fs.readFileSync(saved.storagePath,'utf8');
    assert.equal(raw.includes('FIDCOGEST STORAGE TEST'),false);
    const retrieved = await readPortalDocument(saved.storagePath);
    assert.deepEqual(retrieved.buffer,input);
    assert.equal(retrieved.sha256Checksum, crypto.createHash('sha256').update(input).digest('hex'));
    const database = JSON.parse(fs.readFileSync(path.join(temp,'portal-database-v2.json'),'utf8'));
    assert.equal(database.users.length,0);
    assert.equal(database.documents.length,0);
  } finally {
    fs.rmSync(temp, {recursive:true,force:true});
    delete process.env.PERSISTENT_STORAGE_DIR;
    delete process.env.PORTAL_ENCRYPTION_KEY;
  }
});
