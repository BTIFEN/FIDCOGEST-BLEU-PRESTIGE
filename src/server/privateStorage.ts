import fs from 'node:fs';
import path from 'node:path';

// Resolve existing ancestors too: a symlink must not disguise a web/build directory.
function resolvedDestination(directory: string): string {
  if (fs.existsSync(directory)) return fs.realpathSync(directory);
  const parent = path.dirname(directory);
  if (parent === directory) return directory;
  return path.join(resolvedDestination(parent), path.basename(directory));
}

export function assertPrivateStorageDirectory(directory = process.env.PERSISTENT_STORAGE_DIR): asserts directory is string {
  if (!directory || !path.isAbsolute(directory)) {
    throw new Error('PERSISTENT_STORAGE_DIR doit être configuré avec un chemin absolu privé.');
  }
  const destination = resolvedDestination(path.resolve(directory));
  const codeRoot = fs.realpathSync(process.cwd());
  const insideCode = path.relative(codeRoot, destination);
  if (!insideCode || (!insideCode.startsWith('..' + path.sep) && !path.isAbsolute(insideCode))) {
    throw new Error('Le stockage privé doit être hors du code déployé.');
  }
  if (destination === path.parse(destination).root || /(^|[/\\])(hbuilds|public_html)([/\\]|$)/i.test(directory) || /(^|[/\\])(hbuilds|public_html)([/\\]|$)/i.test(destination)) {
    throw new Error('Le stockage privé doit être hors de hbuilds et public_html.');
  }
  if (fs.existsSync(destination)) {
    const stat = fs.statSync(destination);
    if (!stat.isDirectory() || (process.platform !== 'win32' && (stat.mode & 0o077) !== 0)) {
      throw new Error('Le répertoire privé doit être un dossier réservé à son propriétaire (0700).');
    }
    fs.accessSync(destination, fs.constants.R_OK | fs.constants.W_OK | fs.constants.X_OK);
  }
}

export function isPrivateStorageConfigured(): boolean {
  try { assertPrivateStorageDirectory(); return true; } catch { return false; }
}
