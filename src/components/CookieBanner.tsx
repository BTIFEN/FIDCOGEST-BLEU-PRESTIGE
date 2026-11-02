import React, { useState, useEffect } from 'react';
import { ShieldCheck, Cookie, X, Check } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('fidcogest_cookie_consent');
    if (!consent) {
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('fidcogest_cookie_consent', 'accepted_all');
    setShow(false);
  };

  const handleAcceptEssential = () => {
    localStorage.setItem('fidcogest_cookie_consent', 'accepted_essential');
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 max-w-lg bg-slate-900/95 border border-slate-700 rounded-2xl p-4 shadow-2xl backdrop-blur-lg text-xs space-y-3 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2 text-amber-400 font-display font-bold text-sm">
          <Cookie className="w-4 h-4 text-amber-400" />
          <span>Gestion des Cookies & Confidentialité (RGPD)</span>
        </div>
        <button onClick={handleAcceptEssential} className="text-slate-400 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-slate-300 leading-relaxed font-sans">
        Le cabinet Fidcogest utilise des cookies stricts nécessaires au fonctionnement sécurisé du portail client et à la mesure d'audience anonyme conformément au Règlement Général sur la Protection des Données (RGPD).
      </p>

      <div className="flex items-center gap-2 pt-1">
        <button
          onClick={handleAcceptAll}
          className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1.5"
        >
          <Check className="w-3.5 h-3.5" />
          Tout Accepter
        </button>
        <button
          onClick={handleAcceptEssential}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-lg transition-colors"
        >
          Uniquement Essentiels
        </button>
      </div>
    </div>
  );
};
