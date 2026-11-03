import React, { useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { Language } from '../types';
import { useCabinet } from '../context/CabinetContext';
import { Phone, Calendar, Lock, Menu, X, ChevronDown, Building, Users, Briefcase, Rocket, TrendingUp, Smartphone, ShieldCheck } from 'lucide-react';

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
  const [cabinetDropdownOpen, setCabinetDropdownOpen] = useState(false);
  const [servicesDropdownOpen, setServicesDropdownOpen] = useState(false);
  const location = useLocation();
  const { config } = useCabinet();
  const { cabinet } = config;

  const navLabels = {
    fr: {
      home: "Accueil",
      cabinet: "Le Cabinet",
      about: "Présentation & Histoire",
      team: "Notre Équipe & Direction",
      services: "Services",
      allServices: "Vue d'ensemble des 7 Services",
      creation: "Création d'Entreprise & SRL",
      tax: "Fiscalité des Sociétés & IPP",
      ecompta: "E-Compta & Dématérialisation",
      tools: "Outils & Simulateurs",
      news: "Actualités",
      contact: "Contact",
      clientSpace: "Espace Client",
      bookRdv: "Prendre RDV"
    },
    nl: {
      home: "Home",
      cabinet: "Het Kantoor",
      about: "Presentatie & Historiek",
      team: "Ons Team & Directie",
      services: "Diensten",
      allServices: "Overzicht van de 7 Diensten",
      creation: "Oprichting Ondernemingen & SRL",
      tax: "Vennootschapsbelasting & IPP",
      ecompta: "E-Compta & Digitalisering",
      tools: "Tools & Simulatoren",
      news: "Nieuws",
      contact: "Contact",
      clientSpace: "Klantenportaal",
      bookRdv: "Afspraak Maken"
    },
    en: {
      home: "Home",
      cabinet: "The Firm",
      about: "About & History",
      team: "Our Team & Management",
      services: "Services",
      allServices: "Overview of 7 Services",
      creation: "Company Incorporation & SRL",
      tax: "Corporate & Personal Tax",
      ecompta: "E-Compta & Digital Services",
      tools: "Tools & Simulators",
      news: "News",
      contact: "Contact",
      clientSpace: "Client Portal",
      bookRdv: "Book Appointment"
    }
  }[lang || 'fr'];

  const isCabinetActive = location.pathname === '/a-propos' || location.pathname === '/notre-equipe';
  const isServicesActive =
    location.pathname === '/services' ||
    location.pathname === '/creation-entreprise' ||
    location.pathname === '/fiscalite' ||
    location.pathname === '/e-compta';

  return (
    <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-[#E8E6DF] shadow-xs font-sans transition-all">
      {/* Top Discrete Contact Line (Sobre & Chaleureux) */}
      <div className="bg-[#142B45] text-slate-300 text-xs py-1.5 px-4 sm:px-8 border-b border-[#1D3B5C]/60">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B79661]"></span>
            <span className="font-medium text-[#F7F6F2]">
              Bruxelles (Ganshoren) &bull; Cabinet d'Expertise Comptable &amp; Conseil Fiscal Certifié ITAA
            </span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs font-mono">
            <a
              href={`tel:${cabinet.phone.replace(/[^0-9+]/g, '')}`}
              className="text-[#D9BD8E] hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3 h-3 text-[#B79661]" />
              <span>{cabinet.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link 
          to="/" 
          className="flex items-center gap-3.5 group focus:outline-none shrink-0"
        >
          {config.images?.logo && config.images.logo !== '/assets/images/logo_fidcogest.svg' ? (
            <img
              src={config.images.logo}
              alt={cabinet.name}
              className="h-10 w-auto max-w-[200px] object-contain"
            />
          ) : (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#142B45] border border-[#B79661]/40 flex items-center justify-center text-[#D9BD8E] font-serif text-xl font-bold shadow-xs group-hover:border-[#B79661] transition-all">
                F
              </div>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2">
                  <span className="font-serif text-lg font-bold tracking-wider text-[#142B45]">
                    FIDCOGEST
                  </span>
                  <span className="px-1.5 py-0.5 rounded text-xs font-bold tracking-wider bg-[#B79661]/15 text-[#8C6A34] border border-[#B79661]/30">
                    ITAA
                  </span>
                </div>
                <span className="text-xs uppercase tracking-wider text-[#6B7280] font-medium hidden sm:block">
                  Conseil Fiscal &bull; Comptabilité
                </span>
              </div>
            </div>
          )}
        </Link>

        {/* Desktop Navigation Links (6 éléments épurés et hautement contrastés) */}
        <nav className="hidden xl:flex items-center gap-1">
          {/* 1. Accueil */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `px-3.5 py-2 rounded-xl text-[13px] font-bold tracking-wide transition-all ${
                isActive
                  ? 'text-[#142B45] bg-[#142B45]/10 shadow-[inset_0_-2.5px_0_#B79661]'
                  : 'text-[#142B45] hover:text-[#0A1624] hover:bg-[#142B45]/8'
              }`
            }
          >
            Accueil
          </NavLink>

          {/* 2. Le Cabinet (Dropdown avec Présentation, Équipe) */}
          <div
            className="relative"
            onMouseEnter={() => setCabinetDropdownOpen(true)}
            onMouseLeave={() => setCabinetDropdownOpen(false)}
          >
            <button
              type="button"
              style={{ color: '#142B45' }}
              className={`px-3.5 py-2 rounded-xl text-[13px] font-bold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer ${
                isCabinetActive
                  ? 'bg-slate-100 shadow-[inset_0_-2.5px_0_#B79661]'
                  : 'hover:text-[#0A1624] hover:bg-slate-100'
              }`}
            >
              <span style={{ color: '#142B45' }} className="font-bold">Le Cabinet</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#B79661]" />
            </button>

            {cabinetDropdownOpen && (
              <div className="absolute top-full left-0 w-72 pt-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="bg-white rounded-2xl border-2 border-[#E2DFD8] shadow-2xl p-2.5 space-y-1">
                  <Link
                    to="/a-propos"
                    onClick={() => setCabinetDropdownOpen(false)}
                    className="p-3 rounded-xl hover:bg-[#F7F6F2] transition-colors flex items-center gap-3 text-xs text-[#142B45] font-semibold"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FAF9F6] border border-[#E2DFD8] flex items-center justify-center shrink-0">
                      <Building className="w-4 h-4 text-[#B79661]" />
                    </div>
                    <div>
                      <div className="font-bold text-[#142B45] text-[13px]">Présentation &amp; Histoire</div>
                      <div className="text-xs text-[#475569] font-medium">Fondé en 2008 à Bruxelles</div>
                    </div>
                  </Link>
                  <Link
                    to="/notre-equipe"
                    onClick={() => setCabinetDropdownOpen(false)}
                    className="p-3 rounded-xl hover:bg-[#F7F6F2] transition-colors flex items-center gap-3 text-xs text-[#142B45]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FAF9F6] border border-[#E2DFD8] flex items-center justify-center shrink-0">
                      <Users className="w-4 h-4 text-[#B79661]" />
                    </div>
                    <div>
                      <div className="font-bold text-[#142B45] text-[13px]">Notre Équipe &amp; Direction</div>
                      <div className="text-xs text-[#475569] font-medium">Paul Holl Mpeck (Gérant ITAA)</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 3. Services (Dropdown avec 7 Pôles, Création, Fiscalité, E-compta) */}
          <div
            className="relative"
            onMouseEnter={() => setServicesDropdownOpen(true)}
            onMouseLeave={() => setServicesDropdownOpen(false)}
          >
            <button
              type="button"
              style={{ color: '#142B45' }}
              className={`px-3.5 py-2 rounded-xl text-[13px] font-bold tracking-wide transition-all flex items-center gap-1.5 cursor-pointer ${
                isServicesActive
                  ? 'bg-slate-100 shadow-[inset_0_-2.5px_0_#B79661]'
                  : 'hover:text-[#0A1624] hover:bg-slate-100'
              }`}
            >
              <span style={{ color: '#142B45' }} className="font-bold">Services</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#B79661]" />
            </button>

            {servicesDropdownOpen && (
              <div className="absolute top-full left-0 w-80 pt-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="bg-white rounded-2xl border-2 border-[#E2DFD8] shadow-2xl p-2.5 space-y-1">
                  <Link
                    to="/services"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="p-3 rounded-xl hover:bg-[#F7F6F2] transition-colors flex items-center gap-3 text-xs text-[#142B45] font-semibold border-b border-[#F0EFEA]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FAF9F6] border border-[#E2DFD8] flex items-center justify-center shrink-0">
                      <Briefcase className="w-4 h-4 text-[#B79661]" />
                    </div>
                    <div>
                      <div className="font-bold text-[#142B45] text-[13px]">Vue d'ensemble des Services</div>
                      <div className="text-xs text-[#475569] font-medium">Les 7 Pôles d'intervention</div>
                    </div>
                  </Link>
                  <Link
                    to="/creation-entreprise"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="p-3 rounded-xl hover:bg-[#F7F6F2] transition-colors flex items-center gap-3 text-xs text-[#142B45]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FAF9F6] border border-[#E2DFD8] flex items-center justify-center shrink-0">
                      <Rocket className="w-4 h-4 text-[#B79661]" />
                    </div>
                    <div>
                      <div className="font-bold text-[#142B45] text-[13px]">Création d'Entreprise &amp; SRL</div>
                      <div className="text-xs text-[#475569] font-medium">Plan financier notarié &amp; Starters</div>
                    </div>
                  </Link>
                  <Link
                    to="/fiscalite"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="p-3 rounded-xl hover:bg-[#F7F6F2] transition-colors flex items-center gap-3 text-xs text-[#142B45]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FAF9F6] border border-[#E2DFD8] flex items-center justify-center shrink-0">
                      <TrendingUp className="w-4 h-4 text-[#B79661]" />
                    </div>
                    <div>
                      <div className="font-bold text-[#142B45] text-[13px]">Fiscalité des Sociétés &amp; IPP</div>
                      <div className="text-xs text-[#475569] font-medium">ISOC 20%, TVA &amp; VVPR-bis</div>
                    </div>
                  </Link>
                  <Link
                    to="/e-compta"
                    onClick={() => setServicesDropdownOpen(false)}
                    className="p-3 rounded-xl hover:bg-[#F7F6F2] transition-colors flex items-center gap-3 text-xs text-[#142B45]"
                  >
                    <div className="w-8 h-8 rounded-lg bg-[#FAF9F6] border border-[#E2DFD8] flex items-center justify-center shrink-0">
                      <Smartphone className="w-4 h-4 text-[#B79661]" />
                    </div>
                    <div>
                      <div className="font-bold text-[#142B45] text-[13px]">E-Compta &amp; Dématérialisation</div>
                      <div className="text-xs text-[#475569] font-medium">Zéro papier &amp; Facturation Peppol</div>
                    </div>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* 4. Outils & Simulateurs */}
          <NavLink
            to="/outils-simulateurs"
            className={({ isActive }) =>
              `px-3.5 py-2 rounded-xl text-[13px] font-bold tracking-wide transition-all ${
                isActive
                  ? 'text-[#142B45] bg-[#142B45]/10 shadow-[inset_0_-2.5px_0_#B79661]'
                  : 'text-[#142B45] hover:text-[#0A1624] hover:bg-[#142B45]/8'
              }`
            }
          >
            Outils &amp; Simulateurs
          </NavLink>

          {/* 5. Actualités */}
          <NavLink
            to="/actualites"
            className={({ isActive }) =>
              `px-3.5 py-2 rounded-xl text-[13px] font-bold tracking-wide transition-all ${
                isActive
                  ? 'text-[#142B45] bg-[#142B45]/10 shadow-[inset_0_-2.5px_0_#B79661]'
                  : 'text-[#142B45] hover:text-[#0A1624] hover:bg-[#142B45]/8'
              }`
            }
          >
            Actualités
          </NavLink>

          {/* 6. Contact */}
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `px-3.5 py-2 rounded-xl text-[13px] font-bold tracking-wide transition-all ${
                isActive
                  ? 'text-[#142B45] bg-[#142B45]/10 shadow-[inset_0_-2.5px_0_#B79661]'
                  : 'text-[#142B45] hover:text-[#0A1624] hover:bg-[#142B45]/8'
              }`
            }
          >
            Contact
          </NavLink>
        </nav>

        {/* Right CTA Actions & Language Selector */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Selector FR / NL / EN */}
          <div className="flex items-center rounded-xl border-2 border-[#CBD5E1] p-0.5 bg-[#F1F5F9] text-xs font-bold text-[#142B45]">
            {(['fr', 'nl', 'en'] as Language[]).map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2.5 py-1 rounded-lg transition-all uppercase cursor-pointer ${
                  lang === l
                    ? 'bg-[#142B45] text-white shadow-xs font-extrabold'
                    : 'text-[#1E293B] hover:text-[#142B45] hover:bg-white/80'
                }`}
                title={`Passer en ${l === 'fr' ? 'Français' : l === 'nl' ? 'Nederlands' : 'English'}`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Client Portal Button (Direct Link to Portal V1) */}
          <Link
            to="/portail"
            className="border-2 border-[#142B45] bg-white hover:bg-[#F7F6F2] text-[#142B45] font-bold text-xs py-2 px-3.5 rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            title="Plateforme Documentaire Sécurisée FIDCOGEST"
          >
            <Lock className="w-3.5 h-3.5 text-[#B79661]" />
            <span>Portail Client</span>
          </Link>

          {/* Booking CTA Button */}
          <button
            onClick={onOpenBooking}
            className="bg-[#142B45] hover:bg-[#1D3B5C] border-2 border-[#142B45] text-white font-bold text-xs py-2 px-4 rounded-xl shadow-md transition-all flex items-center gap-2 cursor-pointer ring-1 ring-white/20"
          >
            <Calendar className="w-3.5 h-3.5 text-[#F3D085]" />
            <span>Prendre RDV</span>
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 xl:hidden">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-[#142B45] hover:bg-[#F7F6F2] focus:outline-none cursor-pointer"
            aria-label="Menu de navigation"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Menu (Fluid, Sans Coupure de Mots, Haute Lisibilité) */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t-2 border-[#CBD5E1] bg-white px-5 pt-4 pb-6 space-y-4 animate-in slide-in-from-top-2 duration-200 shadow-2xl max-h-[85vh] overflow-y-auto">
          {/* Lang Selector Mobile */}
          <div className="flex items-center justify-between pb-3 border-b border-[#E2DFD8]">
            <span className="text-xs text-[#142B45] font-extrabold">Langue du site :</span>
            <div className="flex items-center gap-1 bg-[#F1F5F9] p-1 rounded-xl border border-[#CBD5E1]">
              {(['fr', 'nl', 'en'] as Language[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold uppercase ${
                    lang === l ? 'bg-[#10243C] text-white shadow-xs' : 'text-[#1E293B] hover:text-[#10243C]'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <nav className="flex flex-col space-y-1 text-sm">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive ? 'bg-[#10243C] text-white font-extrabold shadow-sm' : 'text-[#142B45] hover:bg-[#F7F6F2]'
                }`
              }
            >
              {navLabels.home}
            </NavLink>

            {/* Le Cabinet Accordion/Group */}
            <div className="pt-1">
              <span className="px-3.5 text-xs font-extrabold uppercase tracking-wider text-[#8C6A34] block mb-1">
                {navLabels.cabinet}
              </span>
              <div className="pl-3 space-y-1 border-l-2 border-[#B79661]">
                <Link
                  to="/a-propos"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-bold text-[#142B45] hover:bg-[#F7F6F2] block"
                >
                  {navLabels.about}
                </Link>
                <Link
                  to="/notre-equipe"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-bold text-[#142B45] hover:bg-[#F7F6F2] block"
                >
                  {navLabels.team}
                </Link>
              </div>
            </div>

            {/* Services Accordion/Group */}
            <div className="pt-2">
              <span className="px-3.5 text-xs font-extrabold uppercase tracking-wider text-[#8C6A34] block mb-1">
                {navLabels.services}
              </span>
              <div className="pl-3 space-y-1 border-l-2 border-[#B79661]">
                <Link
                  to="/services"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-bold text-[#142B45] hover:bg-[#F7F6F2] block"
                >
                  {navLabels.allServices}
                </Link>
                <Link
                  to="/creation-entreprise"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-bold text-[#142B45] hover:bg-[#F7F6F2] block"
                >
                  {navLabels.creation}
                </Link>
                <Link
                  to="/fiscalite"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-bold text-[#142B45] hover:bg-[#F7F6F2] block"
                >
                  {navLabels.tax}
                </Link>
                <Link
                  to="/e-compta"
                  onClick={() => setMobileMenuOpen(false)}
                  className="px-3 py-2 rounded-lg text-xs font-bold text-[#142B45] hover:bg-[#F7F6F2] block"
                >
                  {navLabels.ecompta}
                </Link>
              </div>
            </div>

            <NavLink
              to="/outils-simulateurs"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive ? 'bg-[#10243C] text-white font-extrabold shadow-sm' : 'text-[#142B45] hover:bg-[#F7F6F2]'
                }`
              }
            >
              {navLabels.tools}
            </NavLink>

            <NavLink
              to="/actualites"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive ? 'bg-[#10243C] text-white font-extrabold shadow-sm' : 'text-[#142B45] hover:bg-[#F7F6F2]'
                }`
              }
            >
              {navLabels.news}
            </NavLink>

            <NavLink
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) =>
                `px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isActive ? 'bg-[#10243C] text-white font-extrabold shadow-sm' : 'text-[#142B45] hover:bg-[#F7F6F2]'
                }`
              }
            >
              {navLabels.contact}
            </NavLink>
          </nav>

          {/* Direct CTA Buttons Mobile */}
          <div className="pt-3 border-t-2 border-[#CBD5E1] flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenBooking();
              }}
              className="bg-[#10243C] hover:bg-[#1A385C] text-white font-extrabold text-xs py-3 px-4 rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
            >
              <Calendar className="w-4 h-4 text-[#F3D085]" />
              <span>{navLabels.bookRdv}</span>
            </button>

            <Link
              to="/portail"
              onClick={() => setMobileMenuOpen(false)}
              className="bg-white hover:bg-[#F8FAFC] border-2 border-[#10243C] text-[#10243C] font-extrabold text-xs py-3 px-4 rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
            >
              <Lock className="w-4 h-4 text-[#B79661]" />
              <span>Portail Client &amp; Cockpit Gestionnaire</span>
            </Link>
          </div>
        </div>
      )}

    </header>
  );
};
