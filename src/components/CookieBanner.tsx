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
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 z-50 max-w-lg bg-white border border-[#E8E6DF] rounded-2xl p-5 shadow-2xl backdrop-blur-md text-xs space-y-3.5 animate-in fade-in slide-in-from-bottom-4 duration-300 text-[#1F2937]">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-2.5 text-[#142B45] font-serif font-bold text-sm">
          <Cookie className="w-4 h-4 text-[#B79661]" />
          <span>Gestion des Cookies &amp; Confidentialité (RGPD)</span>
        </div>
        <button
          onClick={handleAcceptEssential}
          className="text-[#6B7280] hover:text-[#142B45] transition-colors p-1"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-[#4B5563] leading-relaxed font-sans text-xs">
        Le cabinet Fidcogest utilise exclusivement des traceurs techniques indispensables au bon fonctionnement du portail client et à l'analyse d'audience anonymisée, conformément au Règlement Général sur la Protection des Données (RGPD).
      </p>

      <div className="flex flex-wrap items-center gap-2.5 pt-1">
        <button
          onClick={handleAcceptAll}
          className="cabinet-btn-primary text-xs py-2 px-4"
        >
          <Check className="w-3.5 h-3.5" />
          Tout Accepter
        </button>
        <button
          onClick={handleAcceptEssential}
          className="cabinet-btn-secondary text-xs py-2 px-3.5"
        >
          Uniquement Essentiels
        </button>
      </div>
    </div>
  );
};
