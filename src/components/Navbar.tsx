import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Language } from '../types';
import { useCabinet } from '../context/CabinetContext';
import { Phone, Calendar, Lock, Menu, X, ShieldCheck, Clock, ChevronDown, Sparkles, Smartphone, Building, Users } from 'lucide-react';

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
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const location = useLocation();
  const { config } = useCabinet();
  const { cabinet } = config;

  const navItems = [
    { path: '/', label: { fr: 'Accueil', nl: 'Home', en: 'Home' } },
    { path: '/a-propos', label: { fr: 'Le Cabinet', nl: 'Kantoor', en: 'About Us' } },
    { path: '/notre-equipe', label: { fr: 'Notre Équipe', nl: 'Ons Team', en: 'Our Team' } },
    {
      path: '/services',
      label: { fr: 'Services & Offres', nl: 'Diensten', en: 'Services' },
      hasSubmenu: true
    },
    { path: '/outils-simulateurs', label: { fr: 'Outils & Simulateurs', nl: 'Tools & Simulaties', en: 'Tools & Simulators' } },
    { path: '/e-compta', label: { fr: 'E-Compta & Basecone', nl: 'E-Boekhouding', en: 'E-Accounting' } },
    { path: '/actualites', label: { fr: 'Actualités', nl: 'Nieuws', en: 'Tax News' } },
    { path: '/contact', label: { fr: 'Contact', nl: 'Contact', en: 'Contact' } }
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-[#E8E6DF] shadow-[0_2px_12px_rgba(20,43,69,0.03)] font-sans">
      
      {/* Top Institutional Accreditation Microbar */}
      <div className="bg-[#142B45] text-[#CBD6E0] text-[11px] sm:text-xs py-2 px-4 sm:px-8 border-b border-[#1D3B5C]">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-y-1 gap-x-4">
          <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-[#D9BD8E] font-medium tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5 text-[#B79661] shrink-0" />
              <span>{cabinet.name} • {cabinet.accreditationStatus}</span>
            </span>
            <span className="text-[#3A536E] hidden md:inline">|</span>
            <span className="text-[#A2B4C5] hidden md:inline font-mono">TVA {cabinet.vatNumber}</span>
            <span className="text-[#3A536E] hidden lg:inline">|</span>
            <span className="text-[#A2B4C5] hidden lg:inline">{cabinet.headquarters.address}, {cabinet.headquarters.postalCode} {cabinet.headquarters.city}</span>
          </div>

          <div className="flex items-center gap-4 text-[#A2B4C5]">
            <span className="hidden xl:flex items-center gap-1.5">
              <Clock className="w-3 h-3 text-[#B79661]" />
              {cabinet.openingHours}
            </span>
            <span className="text-[#3A536E] hidden xl:inline">|</span>
            <a 
              href={`tel:${cabinet.phone.replace(/[^0-9+]/g, '')}`} 
              className="text-white hover:text-[#D9BD8E] transition-colors flex items-center gap-1.5 font-medium font-mono"
            >
              <Phone className="w-3 h-3 text-[#B79661]" />
              <span>{cabinet.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-3.5 flex items-center justify-between gap-6">
        
        {/* Brand Logo & ITAA Seal */}
        <Link 
          to="/" 
          className="flex items-center gap-3.5 group focus:outline-none shrink-0"
        >
          <div className="w-11 h-11 rounded-xl bg-[#142B45] border border-[#B79661]/40 flex items-center justify-center text-[#D9BD8E] font-serif text-2xl font-bold shadow-md shadow-[#142B45]/10 group-hover:border-[#B79661] transition-all">
            F
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-xl font-bold tracking-wider text-[#142B45]">
                FIDCOGEST
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold tracking-wider bg-[#B79661]/15 text-[#8C6A34] border border-[#B79661]/30">
                ITAA
              </span>
            </div>
            <span className="text-[10px] uppercase tracking-widest text-[#6B7280] font-medium hidden sm:block">
              Expertise Comptable &amp; Conseil Fiscal
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

            if (item.hasSubmenu) {
              return (
                <div
                  key={item.path}
                  className="relative"
                  onMouseEnter={() => setServicesDropdownOpen(true)}
                  onMouseLeave={() => setServicesDropdownOpen(false)}
                >
                  <NavLink
                    to={item.path}
                    className={`px-3 py-2 rounded-lg text-xs tracking-wide transition-all flex items-center gap-1 ${
                      isActive
                        ? 'text-[#142B45] font-bold bg-[#142B45]/5 shadow-[inset_0_-2px_0_#B79661]'
                        : 'text-[#4B5563] font-medium hover:text-[#142B45] hover:bg-[#142B45]/5'
                    }`}
                  >
                    <span>{item.label[lang] || item.label.fr}</span>
                    <ChevronDown className="w-3 h-3 text-[#B79661]" />
                  </NavLink>

                  {/* Dropdown Menu */}
                  {servicesDropdownOpen && (
                    <div className="absolute top-full left-0 w-64 pt-1 z-50 animate-in fade-in zoom-in-95 duration-150">
                      <div className="bg-white rounded-xl border border-[#E8E6DF] shadow-xl p-2 space-y-1">
                        <Link
                          to="/services"
                          onClick={() => setServicesDropdownOpen(false)}
                          className="p-2.5 rounded-lg hover:bg-[#F7F6F2] transition-colors flex items-center gap-2.5 text-xs text-[#142B45] font-semibold"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#B79661]"></span>
                          <span>Vue d'ensemble des 7 Pôles</span>
                        </Link>
                        <Link
                          to="/creation-entreprise"
                          onClick={() => setServicesDropdownOpen(false)}
                          className="p-2.5 rounded-lg hover:bg-[#F7F6F2] transition-colors flex items-center gap-2.5 text-xs text-[#4B5563] hover:text-[#142B45]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#142B45]"></span>
                          <span>Création d'Entreprise &amp; SRL</span>
                        </Link>
                        <Link
                          to="/fiscalite"
                          onClick={() => setServicesDropdownOpen(false)}
                          className="p-2.5 rounded-lg hover:bg-[#F7F6F2] transition-colors flex items-center gap-2.5 text-xs text-[#4B5563] hover:text-[#142B45]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#142B45]"></span>
                          <span>Fiscalité ISOC, IPP &amp; Contrôles</span>
                        </Link>
                        <Link
                          to="/e-compta"
                          onClick={() => setServicesDropdownOpen(false)}
                          className="p-2.5 rounded-lg hover:bg-[#F7F6F2] transition-colors flex items-center gap-2.5 text-xs text-[#4B5563] hover:text-[#142B45]"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#142B45]"></span>
                          <span>E-Compta, E-Documents &amp; Basecone</span>
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              );
            }

            return (
              <NavLink
                key={item.path}
                to={item.path}
                aria-current={isActive ? 'page' : undefined}
                className={`px-3 py-2 rounded-lg text-xs tracking-wide transition-all ${
                  isActive
                    ? 'text-[#142B45] font-bold bg-[#142B45]/5 shadow-[inset_0_-2px_0_#B79661]'
                    : 'text-[#4B5563] font-medium hover:text-[#142B45] hover:bg-[#142B45]/5'
                }`}
              >
                {item.label[lang] || item.label.fr}
              </NavLink>
            );
          })}
        </nav>

        {/* Right CTA Actions & Language Selector */}
        <div className="hidden md:flex items-center gap-3">
          
          {/* Language Selector */}
          <div className="flex items-center rounded-lg border border-[#E8E6DF] p-0.5 bg-[#F7F6F2] text-[11px] font-semibold text-[#6B7280]">
            {(['fr', 'nl', 'en'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 rounded transition-all uppercase ${
                  lang === l
                    ? 'bg-white text-[#142B45] shadow-xs font-bold'
                    : 'hover:text-[#142B45]'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Client Portal Button (Basecone / Vault) */}
          <button
            onClick={onOpenVault}
            className="cabinet-btn-secondary text-xs py-2 px-3.5"
            title="Espace Client & Basecone"
          >
            <Lock className="w-3.5 h-3.5 text-[#B79661]" />
            <span>Espace Client</span>
          </button>

          {/* Booking CTA Button */}
          <button
            onClick={onOpenBooking}
            className="cabinet-btn-primary text-xs py-2 px-4"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Prendre RDV</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#142B45] hover:bg-[#F7F6F2] focus:outline-none"
            aria-label="Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#E8E6DF] bg-white px-4 pt-3 pb-6 space-y-3 animate-in slide-in-from-top-2 duration-200">
          <nav className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#142B45] text-white font-bold'
                      : 'text-[#4B5563] hover:bg-[#F7F6F2] hover:text-[#142B45]'
                  }`}
                >
                  {item.label[lang] || item.label.fr}
                </NavLink>
              );
            })}
          </nav>

          {/* Mobile Direct Links to Specialist Pages */}
          <div className="pt-2 border-t border-[#E8E6DF] space-y-1">
            <span className="text-[11px] font-semibold text-[#6B7280] uppercase tracking-wider px-3 block">
              Accès directs spécialisés :
            </span>
            <Link
              to="/creation-entreprise"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs text-[#142B45] hover:bg-[#F7F6F2] block font-medium"
            >
              → Création d'Entreprise &amp; SRL
            </Link>
            <Link
              to="/fiscalite"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs text-[#142B45] hover:bg-[#F7F6F2] block font-medium"
            >
              → Fiscalité ISOC, IPP &amp; Contrôles
            </Link>
            <Link
              to="/e-compta"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs text-[#142B45] hover:bg-[#F7F6F2] block font-medium"
            >
              → E-Compta &amp; Basecone
            </Link>
            <Link
              to="/mentions-legales"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs text-[#6B7280] hover:bg-[#F7F6F2] block"
            >
              → Mentions Légales &amp; RGPD
            </Link>
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg text-xs text-[#B79661] hover:bg-[#F7F6F2] block font-semibold"
            >
              🔒 Espace Administration
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="pt-3 border-t border-[#E8E6DF] flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="cabinet-btn-primary w-full justify-center text-xs py-2.5"
            >
              <Calendar className="w-4 h-4" />
              Prendre Rendez-vous
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenVault();
              }}
              className="cabinet-btn-secondary w-full justify-center text-xs py-2.5"
            >
              <Lock className="w-4 h-4 text-[#B79661]" />
              Espace Client / Dépôt Express
            </button>
          </div>
        </div>
      )}

    </header>
  );
};
