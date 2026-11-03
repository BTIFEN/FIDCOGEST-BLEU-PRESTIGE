import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Language } from '../types';
import { useCabinet } from '../context/CabinetContext';
import { Button } from '../components/ui';
import {
  Calendar,
  ShieldCheck,
  ArrowRight,
  Lock,
  CheckCircle2,
  Rocket,
  Building,
  Briefcase,
  Award,
  Clock,
  MapPin,
  Phone,
  Mail,
  FileText,
  HelpCircle,
  TrendingUp,
  FileCheck,
  Users
} from 'lucide-react';

interface HomePageProps {
  lang?: Language;
  onOpenBooking: () => void;
  onOpenVault: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  lang = 'fr',
  onOpenBooking,
  onOpenVault
}) => {
  const navigate = useNavigate();
  const { config } = useCabinet();
  const { cabinet, services } = config;

  const heroIntroLabels = {
    fr: {
      eyebrow: "CABINET D'EXPERTISE COMPTABLE · BELGIQUE",
      titleLine1: "Vos chiffres éclairent vos décisions.",
      titleLine2: "Nous accompagnons vos ambitions.",
      description: "Un accompagnement rigoureux et humain pour les entrepreneurs, indépendants et sociétés à Bruxelles et partout en Belgique.",
      btnBooking: "Prendre rendez-vous",
      btnServices: "Nos services",
      portal: "Portail Client Sécurisé",
      trustPillars: ["Expertise", "Proximité", "Confiance"]
    },
    nl: {
      eyebrow: "ACCOUNTANTSKANTOOR · BELGIË",
      titleLine1: "Uw cijfers verlichten uw beslissingen.",
      titleLine2: "Wij begeleiden uw ambities.",
      description: "Een nauwkeurige en menselijke begeleiding voor ondernemers, zelfstandigen en bedrijven in Brussel en heel België.",
      btnBooking: "Afspraak maken",
      btnServices: "Onze diensten",
      portal: "Beveiligd klantenportaal",
      trustPillars: ["Expertise", "Nabijheid", "Vertrouwen"]
    },
    en: {
      eyebrow: "ACCOUNTING FIRM · BELGIUM",
      titleLine1: "Your numbers enlighten your decisions.",
      titleLine2: "We support your ambitions.",
      description: "Rigorous and human guidance for entrepreneurs, freelancers and companies in Brussels and throughout Belgium.",
      btnBooking: "Book an appointment",
      btnServices: "Our services",
      portal: "Secure Client Portal",
      trustPillars: ["Expertise", "Proximity", "Trust"]
    }
  }[lang || 'fr'];

  const getServiceWpId = (poleId: string): string => {
    switch (poleId) {
      case 'comptabilite':
        return 'service-accounting';
      case 'fiscalite':
        return 'service-tax';
      case 'creation-entreprises':
        return 'service-creation';
      case 'conseil-consultance':
      case 'conseil-gestion':
        return 'service-consulting';
      case 'audit-restructuration':
      case 'audit-evaluation':
        return 'service-audit';
      case 'recherche-financement':
      case 'financement-subsides':
        return 'service-financing';
      case 'e-compta':
        return 'service-digital';
      default:
        return 'service-accounting';
    }
  };

  const getServiceAlt = (poleId: string): string => {
    switch (poleId) {
      case 'comptabilite':
        return 'Fidcogest - Comptabilité générale, calculatrice professionnelle et bilans PCMN';
      case 'fiscalite':
        return 'Fidcogest - Conseil fiscal certifié ITAA, conformité fiscale et déclarations';
      case 'creation-entreprises':
        return 'Fidcogest - Création d\'entreprise en Belgique, business plan et statuts SRL';
      case 'conseil-consultance':
      case 'conseil-gestion':
        return 'Fidcogest - Conseil stratégique et pilotage de gestion pour dirigeants';
      case 'audit-restructuration':
      case 'audit-evaluation':
        return 'Fidcogest - Audit rigoureux, revue de conformité et instruments de contrôle financier';
      case 'recherche-financement':
      case 'financement-subsides':
        return 'Fidcogest - Recherche de financements d\'entreprise et plans d\'investissement';
      case 'e-compta':
        return 'Fidcogest - E-compta dématérialisée et facturation électronique Peppol 2026';
      default:
        return 'Fidcogest - Cabinet d\'expertise comptable et conseil fiscal certifié ITAA';
    }
  };

  const getServiceImage = (poleId: string): string => {
    const wpId = getServiceWpId(poleId);
    // 1. Image administrée WordPress si présente et valide
    if (config.images && (config.images as any)[wpId]) {
      return (config.images as any)[wpId];
    }
    // 2. Ressource locale WebP optimisée 16:9
    return `/assets/images/services/${wpId}.webp`;
  };

  return (
    <div className="space-y-16 lg:space-y-24 pb-20 font-sans">
      
      {/* ========================================================= */}
      {/* 1. BANDEAU HERO BLEU PRESTIGE AVEC PHOTO D'ACCUEIL        */}
      {/* ========================================================= */}
      <section className="bg-[#102B47] text-[#FFFFFF] pt-12 pb-14 lg:pt-16 lg:pb-20 border-b border-[#1E3B5C] relative overflow-hidden shadow-lg fid-photo-hero">
        <div className="fid-photo-hero-image" role="img" aria-label="Réunion professionnelle FIDCOGEST" />
        <div className="fid-photo-hero-fade" aria-hidden="true" />

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 space-y-8">
          
          <div className="max-w-3xl space-y-4 text-left">
            {/* Sur-titre */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#183A5E] border border-[#D1B47E]/40 text-xs font-bold text-[#D1B47E] tracking-wider uppercase shadow-xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#D1B47E] shrink-0" />
              <span>{heroIntroLabels.eyebrow}</span>
            </div>

            {/* Titre Principal & Ligne Dorée */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#FFFFFF] tracking-tight leading-tight text-balance">
              {heroIntroLabels.titleLine1}
              <span className="block text-[#D1B47E] mt-1 font-serif">
                {heroIntroLabels.titleLine2}
              </span>
            </h1>

            {/* Description avec contraste certifié */}
            <p className="text-sm sm:text-base lg:text-lg text-slate-100 leading-relaxed font-sans max-w-2xl" style={{ color: '#E2E8F0' }}>
              {heroIntroLabels.description}
            </p>

            {/* Boutons contrastés, accessibles, visibles */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full sm:w-auto">
              <Button
                variant="primary"
                size="lg"
                onClick={onOpenBooking}
                icon={<Calendar className="w-5 h-5 text-[#FFFFFF]" />}
                className="bg-[#183A5E] hover:bg-[#224B78] text-[#FFFFFF] border-[#D1B47E]/50 shadow-md"
              >
                {heroIntroLabels.btnBooking}
              </Button>

              <Link
                to="/services"
                className="inline-flex items-center justify-center font-extrabold transition-all rounded-xl cursor-pointer min-h-[52px] px-6 py-3.5 text-base gap-2.5 bg-white hover:bg-[#F8FAFC] border-2 border-white shadow-sm select-none w-full sm:w-auto"
                style={{ backgroundColor: '#FFFFFF', color: '#102B47' }}
              >
                <span className="font-extrabold tracking-wide" style={{ color: '#102B47' }}>
                  {heroIntroLabels.btnServices}
                </span>
                <ArrowRight className="w-4 h-4 shrink-0" style={{ color: '#102B47' }} />
              </Link>

              <Button
                variant="discrete"
                size="md"
                onClick={onOpenVault}
                icon={<Lock className="w-4 h-4 text-[#D1B47E]" />}
                className="text-slate-200 hover:text-[#FFFFFF] hover:bg-white/10"
              >
                {heroIntroLabels.portal}
              </Button>
            </div>
          </div>

          {/* Bandeau inférieur : Expertise · Proximité · Confiance */}
          <div className="pt-6 border-t border-[#1E3B5C] flex flex-wrap items-center gap-6 sm:gap-10 text-xs sm:text-sm font-semibold text-slate-200">
            {heroIntroLabels.trustPillars.map((pillar, pIdx) => (
              <div key={pIdx} className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#D1B47E] shrink-0" />
                <span className="text-[#FFFFFF] font-bold tracking-wide">{pillar}</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Bandeau de réassurance discret */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-5 sm:p-6 rounded-2xl bg-white border border-[#E8E6DF] shadow-[0_4px_20px_rgba(20,43,69,0.04)]">
          
          <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-[#FAF9F6] transition-colors">
            <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF] flex items-center justify-center text-[#B79661] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#142B45]">Certifié ITAA</div>
              <div className="text-xs text-[#4B5563]">Institut des Experts-comptables &amp; Conseils fiscaux</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-[#FAF9F6] transition-colors sm:border-l sm:border-[#E8E6DF]">
            <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF] flex items-center justify-center text-[#B79661] shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#142B45]">Fondé en 2008</div>
              <div className="text-xs text-[#4B5563]">Plus de 18 ans d'ancrage local à Ganshoren (Bruxelles)</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-[#FAF9F6] transition-colors lg:border-l lg:border-[#E8E6DF]">
            <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF] flex items-center justify-center text-[#B79661] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#142B45]">BCE 0899.441.309</div>
              <div className="text-xs text-[#4B5563]">Numéro d'entreprise et TVA officiel en Belgique</div>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3 rounded-xl hover:bg-[#FAF9F6] transition-colors lg:border-l lg:border-[#E8E6DF]">
            <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF] flex items-center justify-center text-[#B79661] shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-[#142B45]">Dématérialisation &amp; Peppol</div>
              <div className="text-xs text-[#4B5563]">Facturation électronique et archivage sécurisé 10 ans</div>
            </div>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. QUATRE PARCOURS VISITEURS                              */}
      {/* ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-semibold text-[#8C6A34] tracking-widest uppercase">
            Accompagnement Sur Mesure
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#142B45]">
            Un conseil adapté à chaque profil d'entrepreneur
          </h2>
          <p className="text-sm text-[#4B5563] leading-relaxed">
            Choisissez votre situation pour découvrir l'accompagnement comptable, fiscal et stratégique conçu pour vos objectifs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          
          {/* Parcours 1 : Entreprise */}
          <div className="p-6 rounded-2xl bg-white border border-[#E8E6DF] hover:border-[#B79661] transition-all flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF] flex items-center justify-center text-[#142B45] group-hover:text-[#8C6A34] transition-colors">
                <Building className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#8C6A34] uppercase tracking-wide">
                  SRL · SA · PME
                </span>
                <h3 className="font-serif text-lg font-bold text-[#142B45] mt-1">
                  Je dirige une entreprise
                </h3>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Optimisation de la rémunération dirigeant, bilans annuels BNB, gestion de l'ISOC, dividendes VVPR-bis à 15% et tableaux de bord financiers.
              </p>
              <ul className="space-y-2 text-xs text-[#374151]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B79661] shrink-0" />
                  <span>Arbitrage rémunération vs dividendes</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B79661] shrink-0" />
                  <span>Taux réduit ISOC 20%</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B79661] shrink-0" />
                  <span>Bilans BNB &amp; assemblées générales</span>
                </li>
              </ul>
            </div>

            <Link
              to="/fiscalite"
              className="w-full py-2.5 px-4 rounded-xl bg-[#FAF9F6] hover:bg-[#142B45] hover:text-white border border-[#E8E6DF] hover:border-[#142B45] text-xs font-semibold text-[#142B45] text-center transition-all flex items-center justify-center gap-1.5"
            >
              <span>Découvrir nos solutions Société</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Parcours 2 : Création */}
          <div className="p-6 rounded-2xl bg-white border border-[#E8E6DF] hover:border-[#B79661] transition-all flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF] flex items-center justify-center text-[#142B45] group-hover:text-[#8C6A34] transition-colors">
                <Rocket className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#8C6A34] uppercase tracking-wide">
                  Starters · Porteurs de projet
                </span>
                <h3 className="font-serif text-lg font-bold text-[#142B45] mt-1">
                  Je crée mon activité
                </h3>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Accompagnement de A à Z : plan financier notarié sur 3 ans, choix de la structure juridique (SRL vs Personne Physique), guichet d'entreprises et immatriculation TVA.
              </p>
              <ul className="space-y-2 text-xs text-[#374151]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B79661] shrink-0" />
                  <span>Plan financier certifié notarié</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B79661] shrink-0" />
                  <span>Coordination avec le notaire</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B79661] shrink-0" />
                  <span>Activation BCE &amp; TVA rapide</span>
                </li>
              </ul>
            </div>

            <Link
              to="/creation-entreprise"
              className="w-full py-2.5 px-4 rounded-xl bg-[#FAF9F6] hover:bg-[#142B45] hover:text-white border border-[#E8E6DF] hover:border-[#142B45] text-xs font-semibold text-[#142B45] text-center transition-all flex items-center justify-center gap-1.5"
            >
              <span>Lancer mon activité</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Parcours 3 : Indépendant */}
          <div className="p-6 rounded-2xl bg-white border border-[#E8E6DF] hover:border-[#B79661] transition-all flex flex-col justify-between space-y-6 shadow-xs hover:shadow-md group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF] flex items-center justify-center text-[#142B45] group-hover:text-[#8C6A34] transition-colors">
                <Briefcase className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs font-semibold text-[#8C6A34] uppercase tracking-wide">
                  Indépendants · Professions Libérales
                </span>
                <h3 className="font-serif text-lg font-bold text-[#142B45] mt-1">
                  Je suis indépendant
                </h3>
              </div>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Déclarations TVA trimestrielles, cotisations sociales INASTI sans mauvaise surprise, optimisation IPP et déductibilité rigoureuse de vos frais réels.
              </p>
              <ul className="space-y-2 text-xs text-[#374151]">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B79661] shrink-0" />
                  <span>Déclarations TVA ponctuelles</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B79661] shrink-0" />
                  <span>Optimisation déductibilité IPP</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B79661] shrink-0" />
                  <span>Simulateur passage en société</span>
                </li>
              </ul>
            </div>

            <Link
              to="/outils-simulateurs"
              className="w-full py-2.5 px-4 rounded-xl bg-[#FAF9F6] hover:bg-[#142B45] hover:text-white border border-[#E8E6DF] hover:border-[#142B45] text-xs font-semibold text-[#142B45] text-center transition-all flex items-center justify-center gap-1.5"
            >
              <span>Optimiser mon statut</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Parcours 4 : Espace Client (Carte Sombre Haute Lisibilité) */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-[#163354] to-[#10243C] text-white border-2 border-[#386496] shadow-xl flex flex-col justify-between space-y-6 group hover:border-[#D1B47E] transition-all">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-[#183A5E] border border-[#D1B47E]/60 flex items-center justify-center text-[#D1B47E] shadow-xs">
                <Lock className="w-6 h-6 text-[#D1B47E]" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#F3D085] uppercase tracking-wider block">
                  ESPACE PARTENAIRE · PORTAIL SÉCURISÉ
                </span>
                <h3 className="font-serif text-lg font-bold !text-[#FFFFFF] text-[#FFFFFF] mt-1" style={{ color: '#FFFFFF' }}>
                  Votre espace client
                </h3>
              </div>
              <p className="text-xs !text-[#F8FAFC] text-[#F8FAFC] font-medium leading-relaxed" style={{ color: '#F8FAFC' }}>
                Transmettez vos pièces dématérialisées en quelques clics via notre portail sécurisé, consultez l'état de traitement de vos documents et contactez votre gestionnaire.
              </p>
              <ul className="space-y-2 text-xs text-[#FFFFFF] font-medium">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F3D085] shrink-0" />
                  <span className="text-[#FFFFFF]">Dépôt numérique instantané</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F3D085] shrink-0" />
                  <span className="text-[#FFFFFF]">Archivage légal 10 ans certifié</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#F3D085] shrink-0" />
                  <span className="text-[#FFFFFF]">Accompagnement continu</span>
                </li>
              </ul>
            </div>

            <button
              onClick={onOpenVault}
              className="w-full py-3 px-4 rounded-xl bg-[#F3D085] hover:bg-[#E8C06C] text-[#0D1E30] text-xs font-extrabold text-center transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
            >
              <span className="text-[#0D1E30] font-extrabold">Accéder à mon espace</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#0D1E30]" />
            </button>
          </div>

        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. SEPT EXPERTISES (CARTES ÉPURÉES SANS TRONCATURE)       */}
      {/* ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E6DF] pb-5">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-xs font-semibold text-[#8C6A34] tracking-widest uppercase">
              Prestations &amp; Savoir-faire
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#142B45]">
              Nos 7 domaines d'intervention
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              Des prestations comptables, fiscales et stratégiques complètes pour accompagner la croissance de votre entreprise.
            </p>
          </div>

          <Link
            to="/services"
            className="text-xs sm:text-sm font-semibold text-[#142B45] hover:text-[#8C6A34] flex items-center gap-1.5 shrink-0"
          >
            <span>Voir l'ensemble des services</span>
            <ArrowRight className="w-4 h-4 text-[#8C6A34]" />
          </Link>
        </div>

        {/* Grille 3x2 pour les 6 premiers domaines d'intervention */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services
            .filter((p) => p.id !== 'e-compta')
            .map((pole) => {
              const linkTarget =
                pole.id === 'creation-entreprises' ? '/creation-entreprise' :
                pole.id === 'fiscalite' ? '/fiscalite' :
                '/services';

              return (
                <div
                  key={pole.id}
                  className="rounded-2xl bg-white border border-[#E8E6DF] hover:border-[#B79661] transition-all flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md group"
                >
                  {/* Image 16:9 sans personnage */}
                  <div className="relative h-44 sm:h-48 overflow-hidden bg-[#FAF9F6]">
                    <img
                      src={getServiceImage(pole.id)}
                      alt={getServiceAlt(pole.id)}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                      onError={(e) => {
                        const wpId = getServiceWpId(pole.id);
                        (e.target as HTMLImageElement).src = `/assets/images/services/${wpId}.jpg`;
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  </div>

                  {/* Contenu */}
                  <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                    <div className="space-y-2.5">
                      <h3 className="font-serif text-lg font-bold text-[#142B45] group-hover:text-[#8C6A34] transition-colors leading-snug">
                        {pole.title}
                      </h3>
                      
                      <p className="text-xs text-[#4B5563] leading-relaxed">
                        {pole.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-[#F1EFEA]">
                      <Link
                        to={linkTarget}
                        className="w-full py-2.5 px-3.5 rounded-xl bg-[#FAF9F6] hover:bg-[#142B45] hover:text-white border border-[#E8E6DF] hover:border-[#142B45] text-xs font-semibold text-[#142B45] transition-all flex items-center justify-between group-hover:px-4 cursor-pointer"
                      >
                        <span>En savoir plus</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#8C6A34] group-hover:text-white transition-colors" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* 7e Pôle : E-compta & Services Digitaux — Composition horizontale prestigieuse mise en valeur */}
        {services.find((p) => p.id === 'e-compta') && (() => {
          const digitalPole = services.find((p) => p.id === 'e-compta')!;
          return (
            <div className="rounded-2xl bg-white border-2 border-[#1E3B5C]/20 hover:border-[#B79661] transition-all overflow-hidden shadow-xs hover:shadow-lg group">
              <div className="flex flex-col lg:flex-row items-stretch">
                {/* Image à gauche sur desktop, dessus sur mobile */}
                <div className="relative lg:w-5/12 min-h-[220px] sm:min-h-[260px] lg:min-h-[300px] overflow-hidden bg-[#102B47] shrink-0">
                  <img
                    src={getServiceImage('e-compta')}
                    alt={getServiceAlt('e-compta')}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-104 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/assets/images/services/service-digital.jpg';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-black/50 via-black/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#142B45]/90 border border-[#F3D085]/60 text-white text-[11px] font-bold tracking-wider uppercase backdrop-blur-xs shadow-xs">
                      <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                      Transition Peppol 2026
                    </span>
                  </div>
                </div>

                {/* Contenu à droite sur desktop, dessous sur mobile */}
                <div className="p-6 sm:p-8 lg:w-7/12 flex flex-col justify-between space-y-5 bg-[#FAF9F6]">
                  <div className="space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-[#8C6A34] tracking-wider uppercase">
                        7e Domaine · Pôle Numérique &amp; Dématérialisation
                      </span>
                      <span className="text-xs text-[#94A3B8]">•</span>
                      <span className="text-xs font-semibold text-[#142B45]">
                        Zéro Papier • Conformité Légale
                      </span>
                    </div>

                    <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45] group-hover:text-[#8C6A34] transition-colors">
                      {digitalPole.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                      {digitalPole.description}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#142B45]">
                        <CheckCircle2 className="w-4 h-4 text-[#B79661] shrink-0" />
                        <span>Dépôt instantané sans déplacement</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#142B45]">
                        <CheckCircle2 className="w-4 h-4 text-[#B79661] shrink-0" />
                        <span>Conformité facturation Peppol 2026</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#142B45]">
                        <CheckCircle2 className="w-4 h-4 text-[#B79661] shrink-0" />
                        <span>Archivage légal certifié 10 ans</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-semibold text-[#142B45]">
                        <CheckCircle2 className="w-4 h-4 text-[#B79661] shrink-0" />
                        <span>Suivi en temps réel de votre comptabilité</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E8E6DF] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    <Link
                      to="/e-compta"
                      className="cabinet-btn-primary text-xs justify-center"
                    >
                      <span>En savoir plus sur l'E-compta</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                    <span className="text-xs text-[#6B7280] font-medium text-center sm:text-right">
                      Id Peppol Fidcogest : <strong className="text-[#142B45] font-mono font-bold">0208:0899441309</strong>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
      </section>

      {/* ========================================================= */}
      {/* 4. POURQUOI FIDCOGEST (SECTION INSTITUTIONNELLE)          */}
      {/* ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="p-8 sm:p-12 rounded-3xl bg-white border border-[#E8E6DF] shadow-sm space-y-8">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-semibold text-[#8C6A34] tracking-widest uppercase">
              Valeurs &amp; Déontologie
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#142B45]">
              Pourquoi confier votre gestion à FIDCOGEST ?
            </h2>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              Plus de 18 ans d'ancrage local à Ganshoren (Bruxelles), fondé en 2008 par Paul Holl Mpeck. Une alliance éprouvée entre haute technicité fiscale et proximité humaine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 pt-2">
            
            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#E8E6DF] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E6DF] flex items-center justify-center text-[#B79661] shadow-xs">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#142B45]">
                Agrément &amp; Normes ITAA
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Cabinet agréé par l'Institut des Conseillers fiscaux et des Experts-comptables. Respect rigoureux de la formation continue et des normes déontologiques belges.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#E8E6DF] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E6DF] flex items-center justify-center text-[#B79661] shadow-xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#142B45]">
                Secret Professionnel Légal
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Toutes vos données financières et patrimoniales sont protégées par le secret professionnel le plus strict garanti par l'article 458 du Code pénal belge.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#E8E6DF] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E6DF] flex items-center justify-center text-[#B79661] shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#142B45]">
                Interlocuteur Dédié
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Un contact direct avec Paul Holl Mpeck et son équipe. Vous n'êtes pas un simple numéro de dossier mais un entrepreneur écouté et conseillé sur le long terme.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF9F6] border border-[#E8E6DF] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#E8E6DF] flex items-center justify-center text-[#B79661] shadow-xs">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#142B45]">
                Conseil Fiscal Proactif
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Anticipation des échéances, arbitrage salaire/dividendes VVPR-bis à 15%, et préparation de votre entreprise à la facturation Peppol 2026.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 5. ACTUALITÉS & PROCHAINES ÉCHÉANCES VÉRIFIÉES            */}
      {/* ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#E8E6DF] pb-5">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-[#8C6A34] tracking-widest uppercase">
              Veille &amp; Calendrier
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45]">
              Actualités &amp; Prochaines échéances fiscales vérifiées
            </h2>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              Anticipez sereinement vos prochaines déclarations officielles et versements auprès du SPF Finances.
            </p>
          </div>

          <Link
            to="/actualites"
            className="text-xs sm:text-sm font-semibold text-[#142B45] hover:text-[#8C6A34] flex items-center gap-1.5 shrink-0"
          >
            <span>Consulter le calendrier complet &amp; les actualités</span>
            <ArrowRight className="w-4 h-4 text-[#8C6A34]" />
          </Link>
        </div>

        {/* 3 prochaines échéances clés vérifiées de 2026 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          
          <div className="p-5 rounded-2xl bg-white border border-[#B79661] ring-1 ring-[#B79661]/30 flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-[#FAF9F6] text-[#8C6A34] border border-[#E8E6DF]">
                  ISOC &amp; IPP
                </span>
                <span className="text-xs font-semibold text-[#142B45] flex items-center gap-1.5 bg-[#F7F6F2] px-2.5 py-0.5 rounded-md">
                  <Calendar className="w-3.5 h-3.5 text-[#B79661]" /> 10 Avril 2026
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm text-[#142B45]">
                1er Versement Anticipé (VA1) 2026
              </h4>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Paiement du 1er versement anticipé d'impôt pour les sociétés (ISOC) et indépendants (IPP). Bonification fiscale maximale et évitement de toute majoration.
              </p>
            </div>
            <div className="pt-3 border-t border-[#F1EFEA] flex items-center justify-between text-xs text-[#4B5563]">
              <span>Périodicité : <strong className="text-[#142B45]">1er Trimestre</strong></span>
              <button
                onClick={onOpenBooking}
                className="text-[#142B45] hover:text-[#8C6A34] font-semibold hover:underline cursor-pointer"
              >
                Planifier le calcul →
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8E6DF] flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-[#FAF9F6] text-[#8C6A34] border border-[#E8E6DF]">
                  TVA
                </span>
                <span className="text-xs font-semibold text-[#142B45] flex items-center gap-1.5 bg-[#F7F6F2] px-2.5 py-0.5 rounded-md">
                  <Calendar className="w-3.5 h-3.5 text-[#B79661]" /> 20 Avril 2026
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm text-[#142B45]">
                Déclaration TVA &amp; Paiement (1er Trimestre)
              </h4>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Dépôt électronique de la déclaration TVA du 1er trimestre via Intervat et règlement du solde de TVA due auprès du SPF Finances.
              </p>
            </div>
            <div className="pt-3 border-t border-[#F1EFEA] flex items-center justify-between text-xs text-[#4B5563]">
              <span>Périodicité : <strong className="text-[#142B45]">Trimestrielle</strong></span>
              <button
                onClick={onOpenBooking}
                className="text-[#142B45] hover:text-[#8C6A34] font-semibold hover:underline cursor-pointer"
              >
                Confier ce dépôt →
              </button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8E6DF] flex flex-col justify-between space-y-4 shadow-xs">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-[#FAF9F6] text-[#8C6A34] border border-[#E8E6DF]">
                  BNB &amp; Greffe
                </span>
                <span className="text-xs font-semibold text-[#142B45] flex items-center gap-1.5 bg-[#F7F6F2] px-2.5 py-0.5 rounded-md">
                  <Calendar className="w-3.5 h-3.5 text-[#B79661]" /> 30 Juin 2026
                </span>
              </div>
              <h4 className="font-serif font-bold text-sm text-[#142B45]">
                Dépôt des Comptes Annuels BNB
              </h4>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Publication officielle des comptes annuels auprès de la Centrale des Bilans de la Banque Nationale de Belgique pour les exercices clôturés au 31 décembre.
              </p>
            </div>
            <div className="pt-3 border-t border-[#F1EFEA] flex items-center justify-between text-xs text-[#4B5563]">
              <span>Périodicité : <strong className="text-[#142B45]">Annuelle</strong></span>
              <button
                onClick={onOpenBooking}
                className="text-[#142B45] hover:text-[#8C6A34] font-semibold hover:underline cursor-pointer"
              >
                Préparer le bilan →
              </button>
            </div>
          </div>

        </div>

        {/* Note déontologique sur les simulations et données */}
        <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF] text-xs text-[#4B5563] flex items-center gap-2.5">
          <HelpCircle className="w-4 h-4 text-[#B79661] shrink-0" />
          <span>
            <strong>Avertissement déontologique :</strong> Les simulations et échéances présentées sur ce site sont fournies à titre indicatif et ne constituent pas un avis fiscal personnalisé. Chaque situation d'entreprise requiert une analyse circonstanciée par un conseiller fiscal certifié ITAA.
          </span>
        </div>
      </section>

      {/* ========================================================= */}
      {/* 6. CONTACT ET RENDEZ-VOUS (NOUVELLE COMPOSITION IVOIRE)    */}
      {/* ========================================================= */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="p-6 sm:p-8 lg:p-10 rounded-2xl bg-[#F7F6F2] border border-[#E5E1D8] shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center overflow-hidden">
          {/* Gauche : Textes, Coordonnées & Bouton (55%) */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="space-y-3">
              <h3 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#142B45] leading-snug">
                Prenons le temps de parler de votre entreprise.
              </h3>
              <p className="text-sm sm:text-base text-[#374151] font-normal leading-relaxed">
                Rencontrez notre cabinet à Ganshoren pour examiner vos besoins comptables, fiscaux et financiers.
              </p>
            </div>

            {/* Informations secondaires */}
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm font-semibold text-[#4B5563] pt-1">
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#B79661] shrink-0" />
                <span>Ganshoren, Bruxelles</span>
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#B79661] shrink-0" />
                <a href="tel:+3224251858" className="font-mono hover:text-[#142B45] transition-colors">
                  +32 2 425 18 58
                </a>
              </span>
            </div>

            {/* Bouton principal */}
            <div className="pt-2">
              <button
                onClick={onOpenBooking}
                className="w-full sm:w-auto px-6 py-3.5 bg-[#142B45] hover:bg-[#1D3B5C] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-[#D5B477]" />
                <span>Prendre rendez-vous</span>
              </button>
            </div>
          </div>

          {/* Droite : Photographie professionnelle du fondateur référent (45%) */}
          <div className="lg:col-span-5 w-full h-56 sm:h-64 lg:h-80 rounded-xl overflow-hidden border border-[#E5E1D8] bg-[#FAF9F6] shadow-xs">
            <img
              src={config.images?.consultationFounder || '/assets/images/senior_founder_desk.webp'}
              alt="Consultation d'expertise comptable et fiscale au cabinet FIDCOGEST avec Paul Holl Mpeck"
              className="w-full h-full object-cover"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/assets/images/senior_founder_desk.jpg';
              }}
            />
          </div>
        </div>
      </section>

    </div>
  );
};
