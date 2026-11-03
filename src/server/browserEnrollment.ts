import type express from 'express';
import path from 'node:path';

export function registerBrowserEnrollment(app: express.Express, publicDirectory: string) {
  // Hostinger currently serves .mjs as text/plain; explicit .js routes preserve module MIME.
  for (const name of ['app', 'crypto']) {
    app.get('/enrollment/' + name + '.js', (_req, res) => {
      res.setHeader('Cache-Control', 'no-store');
      res.setHeader('Referrer-Policy', 'no-referrer');
      res.type('application/javascript').sendFile(path.join(publicDirectory, 'enrollment', name + '.mjs'));
    });
  }
  // Extensionless route must pass through Node: Hostinger may serve .html directly.
  app.get('/preparer-administrateur', (_req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Referrer-Policy', 'no-referrer');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
    res.setHeader('Content-Security-Policy', "default-src 'none'; script-src 'self'; style-src 'unsafe-inline'; connect-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; object-src 'none'");
    res.sendFile(path.join(publicDirectory, 'preparer-administrateur.html'));
  });
}
