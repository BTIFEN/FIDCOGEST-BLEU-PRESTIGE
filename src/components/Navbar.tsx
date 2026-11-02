import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Language } from '../types';
import { Phone, Calendar, Lock, Menu, X, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  lang: Language;
  setLang: (lang: Language) => void;
  onOpenBooking: () => void;
  onOpenVault: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  setLang,
  onOpenBooking,
  onOpenVault
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: '/', label: { fr: 'Accueil', nl: 'Home', en: 'Home' } },
    { path: '/a-propos', label: { fr: 'Le Cabinet', nl: 'Kantoor', en: 'About Us' } },
    { path: '/services', label: { fr: 'Services & Offres', nl: 'Diensten', en: 'Services' } },
    { path: '/outils-simulateurs', label: { fr: 'Outils & Simulateurs', nl: 'Tools & Simulaties', en: 'Tools & Simulators' } },
    { path: '/actualites', label: { fr: 'Actualités Fiscales', nl: 'Fiscaal Nieuws', en: 'Tax News' } },
    { path: '/contact', label: { fr: 'Contact & Accès', nl: 'Contact', en: 'Contact' } }
  ];

  return (
    <header className="fid-navbar sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/95 backdrop-blur-md">
      {/* Top micro announcement bar */}
      <div className="hidden md:flex items-center justify-between px-6 py-1.5 text-xs text-slate-400 border-b border-slate-800/60 bg-slate-900/80 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            Agrément Officiel ITAA n° 10.842.109 • Belgique
          </span>
          <span className="text-slate-600">|</span>
          <span>BCE BE 0842.109.812</span>
        </div>
        <div className="flex items-center gap-5">
          <a href="tel:+3225550188" className="hover:text-amber-400 transition-colors flex items-center gap-1">
            <Phone className="w-3 h-3 text-slate-400" /> +32 2 555 01 88
          </a>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse"></span>
            Permanence Fiscale Ouverte (8h30 - 18h00)
          </span>
        </div>
      </div>

      {/* Main 3-Zone Top Navigation */}
      <div className="mx-auto max-w-7xl flex items-center justify-between gap-8 px-4 sm:px-6 py-3">
        
        {/* Zone 1: Single Brand Wordmark */}
        <Link 
          to="/" 
          className="flex items-center gap-3 text-left focus:outline-none group shrink-0"
        >
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center text-slate-950 font-display font-extrabold text-xl shadow-lg shadow-amber-500/10 group-hover:scale-105 transition-transform">
            F
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="id-brand text-xl font-display font-bold tracking-tight text-white whitespace-nowrap">
                FIDCOGEST
              </span>
              <span className="id-badge id-badge-amber">
                ITAA
              </span>
            </div>
            <p className="text-[11px] text-slate-400 tracking-wide font-sans hidden sm:block">
              Expertise Comptable &amp; Conseils Fiscaux
            </p>
          </div>
        </Link>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-2 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <NavLink
                key={item.path}
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                className={`id-nav-item py-2 px-3.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'is-active bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                {item.label[lang]}
              </NavLink>
            );
          })}
        </nav>

        {/* Zone 3: Actions & Language Selector */}
        <div className="hidden sm:flex items-center gap-3 shrink-0">
          {/* Language Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-xs font-mono">
            {(['fr', 'nl', 'en'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                aria-pressed={lang === l}
                className={`id-filter px-2 py-1 rounded text-[11px] uppercase transition-colors ${
                  lang === l
                    ? 'is-selected bg-amber-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Dépôt Express Client Portal CTA */}
          <button
            onClick={onOpenVault}
            className="id-button id-button--secondary text-xs"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden md:inline">Portail &amp;</span> Dépôt Express
          </button>

          {/* RDV Booking CTA */}
          <button
            onClick={onOpenBooking}
            className="id-button id-button--accent text-xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            Prendre RDV
          </button>
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:text-white"
          aria-label="Toggle Navigation"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-slate-950 px-4 pt-3 pb-6 space-y-4">
          <nav className="flex flex-col space-y-1.5">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`id-nav-item text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'is-active bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-300 hover:bg-slate-900'
                  }`}
                >
                  {item.label[lang]}
                </NavLink>
              );
            })}
          </nav>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-center justify-between text-xs text-slate-400 font-mono mb-1">
              <span>Langue / Taal / Language:</span>
              <div className="flex gap-1">
                {(['fr', 'nl', 'en'] as Language[]).map((l) => (
                  <button
                    key={l}
                    onClick={() => setLang(l)}
                    aria-pressed={lang === l}
                    className={`id-filter px-2 py-0.5 rounded text-xs uppercase ${
                      lang === l ? 'is-selected bg-amber-500 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onOpenVault();
                setMobileMenuOpen(false);
              }}
              className="id-button id-button--secondary w-full"
            >
              <Lock className="w-4 h-4 text-amber-400" />
              Espace Client &amp; Dépôt Sécurisé
            </button>

            <button
              onClick={() => {
                onOpenBooking();
                setMobileMenuOpen(false);
              }}
              className="id-button id-button--accent w-full"
            >
              <Calendar className="w-4 h-4" />
              Prendre un Rendez-vous en Ligne
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
