import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import './styles/indusall-theme.css';
import './styles/fidcogest-prestige.css';
import './styles/cabinet-premium.css';

const rootEl = document.getElementById('root');

if (rootEl) {
  try {
    const root = createRoot(rootEl);
    root.render(<App />);
  } catch (err) {
    console.error('[FIDCOGEST Boot Error] Erreur de montage de l’application:', err);
    rootEl.innerHTML = `
      <div style="min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #F7F6F2; font-family: sans-serif; padding: 20px;">
        <div style="max-width: 480px; width: 100%; background: #ffffff; border: 1px solid #E8E6DF; border-radius: 16px; padding: 32px; text-align: center; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
          <div style="font-size: 32px; margin-bottom: 12px;">🛡️</div>
          <h2 style="font-size: 20px; font-weight: bold; color: #142B45; margin: 0 0 8px;">Cabinet FIDCOGEST SRL</h2>
          <p style="font-size: 13px; color: #4B5563; margin: 0 0 20px; line-height: 1.5;">Initialisation du site en cours. Si l'affichage ne se met pas à jour automatiquement, cliquez ci-dessous.</p>
          <button onclick="window.location.reload()" style="background: #142B45; color: #F3D085; font-weight: bold; border: none; padding: 10px 24px; border-radius: 8px; cursor: pointer; font-size: 13px;">
            Actualiser le site
          </button>
        </div>
      </div>
    `;
  }
}
