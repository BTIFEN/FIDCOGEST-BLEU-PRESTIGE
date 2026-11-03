import React from 'react';
import { useCabinet } from '../context/CabinetContext';
import { TrendingUp, ShieldCheck, FileCheck, CheckCircle2, AlertTriangle, ArrowRight, Calendar, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FiscalitePageProps {
  onOpenBooking: () => void;
}

export const FiscalitePage: React.FC<FiscalitePageProps> = ({ onOpenBooking }) => {
  const { config } = useCabinet();
  const fiscalPole = config.services.find(s => s.id === 'fiscalite');

  return (
    <div className="space-y-12 pb-20 font-sans">
      
      {/* Editorial Header */}
      <section className="bg-gradient-to-b from-[#142B45]/5 to-transparent pt-12 pb-8 border-b border-[#E8E6DF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#B79661]/40 text-xs font-serif text-[#142B45] shadow-xs">
            <TrendingUp className="w-3.5 h-3.5 text-[#B79661]" />
            <span className="font-semibold tracking-wide">Conseil Fiscal Agréé ITAA • CIR 92 &amp; Code TVA Belge</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#142B45] tracking-tight">
            Fiscalité des Entreprises, des Dirigeants &amp; des Indépendants
          </h1>

          <p className="text-base text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
            Optimisation légale proactive, conformité rigoureuse de vos déclarations et défense inconditionnelle de vos droits lors des contrôles fiscaux.
          </p>
        </div>
      </section>

      {/* Triad of Tax Pillars: ISOC, IPP, TVA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* ISOC Card */}
          <div className="cabinet-card p-7 space-y-4 border border-[#E8E6DF]">
            <div className="w-10 h-10 rounded-xl bg-[#142B45] text-[#B79661] flex items-center justify-center font-bold font-serif text-sm">
              ISOC
            </div>
            <h3 className="font-serif font-bold text-xl text-[#142B45]">
              Impôt des Sociétés
            </h3>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              Nous structurons les charges déductibles de votre société afin de viser le <strong>taux réduit de 20%</strong> sur la première tranche de 100.000 € de bénéfice imposable (taux standard 25%).
            </p>
            <ul className="space-y-1.5 text-xs text-[#374151]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B79661]" />
                <span>Régime des dividendes VVPR-bis à 15%</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B79661]" />
                <span>Versements anticipés (VA1 à VA4) planifiés</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B79661]" />
                <span>Constitution de réserves de liquidation</span>
              </li>
            </ul>
          </div>

          {/* IPP Card */}
          <div className="cabinet-card p-7 space-y-4 border border-[#E8E6DF]">
            <div className="w-10 h-10 rounded-xl bg-[#142B45] text-[#B79661] flex items-center justify-center font-bold font-serif text-sm">
              IPP
            </div>
            <h3 className="font-serif font-bold text-xl text-[#142B45]">
              Impôt des Personnes Physiques
            </h3>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              Conseil sur-mesure pour les indépendants et dirigeants : choix entre frais réels et forfaitaires, déductions pour investissement et optimisation de votre revenu net disponible.
            </p>
            <ul className="space-y-1.5 text-xs text-[#374151]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B79661]" />
                <span>Déclaration fiscale annuelle via MyMinfin</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B79661]" />
                <span>Cotisations sociales d'indépendant optimisées</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B79661]" />
                <span>Épargne-pension et EIP dirigeants</span>
              </li>
            </ul>
          </div>

          {/* TVA & Peppol Card */}
          <div className="cabinet-card p-7 space-y-4 border border-[#E8E6DF]">
            <div className="w-10 h-10 rounded-xl bg-[#142B45] text-[#B79661] flex items-center justify-center font-bold font-serif text-sm">
              TVA
            </div>
            <h3 className="font-serif font-bold text-xl text-[#142B45]">
              TVA &amp; Facturation Peppol
            </h3>
            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              Sécurisation de la déductibilité de la TVA sur vos achats (21%, 12%, 6%) et accompagnement à la transition obligatoire vers la facturation structurée Peppol dès 2026.
            </p>
            <ul className="space-y-1.5 text-xs text-[#374151]">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B79661]" />
                <span>Déclarations périodiques et relevés intra-UE</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B79661]" />
                <span>Listing clients annuel transmis à temps</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B79661]" />
                <span>Vérification de la validité VIES des tiers</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Tax Audit & Litigation Assistance Focus */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="cabinet-card p-8 sm:p-10 border border-[#B79661]/40 bg-gradient-to-r from-white via-white to-[#F7F6F2] space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142B45] text-[#B79661] text-xs font-serif font-bold">
                <Scale className="w-3.5 h-3.5" />
                <span>Assistance Contrôles Fiscaux &amp; Réclamations</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#142B45]">
                Face à l'Administration Fiscale : Une Défense Professionnelle et Résolue
              </h2>

              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                Recevoir une demande de renseignements ou un avis de rectification du SPF Finances peut être source d'inquiétude. Paul Holl Mpeck et les conseillers certifiés de Fidcogest prennent immédiatement le relais :
              </p>

              <ul className="space-y-2 text-xs sm:text-sm text-[#374151]">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B79661] shrink-0 mt-0.5" />
                  <span><strong>Présence physique</strong> lors des vérifications des agents du fisc dans vos locaux ou au cabinet.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B79661] shrink-0 mt-0.5" />
                  <span><strong>Réponse motivée en droit</strong> aux avis de rectification d'imposition et aux notifications de taxation d'office.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#B79661] shrink-0 mt-0.5" />
                  <span><strong>Introduction de réclamations administratives</strong> et négociation d'accords amiables ou de plans d'apurement.</span>
                </li>
              </ul>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-gradient-to-br from-[#163354] to-[#0F2238] border-2 border-[#2B4E77] text-white space-y-4 text-center shadow-xl">
              <div className="w-12 h-12 rounded-full bg-[#B79661] text-[#142B45] flex items-center justify-center mx-auto shadow-md">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="font-serif font-bold text-base !text-white" style={{ color: '#FFFFFF' }}>
                Contrôle fiscal en cours ?
              </h4>
              <p className="text-xs !text-slate-100 font-medium leading-relaxed" style={{ color: '#F1F5F9' }}>
                Ne répondez pas seul sans avoir consulté un conseiller fiscal certifié ITAA.
              </p>
              <button
                onClick={onOpenBooking}
                className="cabinet-btn-gold text-xs font-extrabold w-full justify-center shadow-md"
              >
                <Calendar className="w-4 h-4" />
                Prendre rendez-vous urgent
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Subservices Grid */}
      {fiscalPole && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h3 className="font-serif font-bold text-2xl text-[#142B45]">
              Nos Interventions Fiscales au Quotidien
            </h3>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              Une prise en charge exhaustive et continue de toutes vos obligations fiscales belges.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fiscalPole.subServices?.map((sub, i) => (
              <div key={i} className="cabinet-card p-6 space-y-3">
                <div className="w-8 h-8 rounded-lg bg-[#142B45] text-[#B79661] flex items-center justify-center font-bold text-xs">
                  {i + 1}
                </div>
                <h4 className="font-serif font-bold text-base text-[#142B45]">
                  {sub.name}
                </h4>
                <p className="text-xs text-[#4B5563] leading-relaxed">
                  {sub.details}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA Box */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="cabinet-card p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-lg text-[#142B45]">
              Anticipez vos versements anticipés ISOC 2026
            </h4>
            <p className="text-xs text-[#4B5563]">
              Calculez l'économie d'impôt immédiate réalisable grâce à notre simulateur de VA1 à VA4.
            </p>
          </div>
          <Link
            to="/outils-simulateurs"
            className="cabinet-btn-primary text-xs shrink-0"
          >
            Accéder au simulateur ISOC
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

    </div>
  );
};
