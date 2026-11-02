import React, { useState } from 'react';
import { SERVICE_POLES } from '../data/mockData';
import { Calculator, TrendingUp, Rocket, PieChart, CheckCircle2, ShieldCheck } from 'lucide-react';

interface ServicesPageProps {
  onOpenBooking: () => void;
  onOpenVault: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onOpenBooking,
  onOpenVault
}) => {
  const [activePoleId, setActivePoleId] = useState('comptabilite');

  const selectedPole = SERVICE_POLES.find((p) => p.id === activePoleId) || SERVICE_POLES[0];

  const pricingPackages = [
    {
      name: 'Formule Indépendant',
      subtitle: 'Personne physique (Starter / Consultant / Artisan)',
      price: 'À partir de 120 € HTVA / mois',
      features: [
        'Tenue complète de la comptabilité simplifiée',
        'Déclarations périodiques TVA & listing clients',
        'Déclaration Impôt des Personnes Physiques (IPP)',
        'Accès illimité au portail de dépôt express & WhatsApp'
      ],
      recommendedFor: 'Consultants, freelances, commerçants et professions libérales.'
    },
    {
      name: 'Formule SRL Starter',
      subtitle: 'Création ou jeune société (1 à 3 associés)',
      price: 'À partir de 250 € HTVA / mois',
      isPopular: true,
      features: [
        'Rédaction du Plan Financier Légal constitutif',
        'Tenue comptable complète PCMN & déclarations TVA',
        'Déclaration ISOC & calcul des Versements Anticipés (VA)',
        'Optimisation Rémunération Dirigeant vs VVPR-bis 15%',
        'Inclus : Connexion au réseau Peppol 2026'
      ],
      recommendedFor: 'Nouvelles SRL, passage en société et petites entreprises.'
    },
    {
      name: 'Formule PME Croissance',
      subtitle: 'Société établie & Conseil de gestion avancé',
      price: 'Sur devis personnalisé',
      features: [
        'Gestion comptable globale & situations intermédiaires',
        'Tableaux de bord de trésorerie trimestriels',
        'Assistance lors des réunions de conseil d\'administration',
        'Représentation & défense complète lors des contrôles fiscaux',
        'Holding, intégration fiscale & gestion de groupe'
      ],
      recommendedFor: 'PME en expansion, sociétés avec personnel et holdings.'
    }
  ];

  return (
    <div className="space-y-16 pb-12 font-sans">
      
      {/* Header Banner */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-xs font-mono text-amber-300">
          <ShieldCheck className="w-4 h-4 text-amber-400" />
          <span>Normes Comptables Belges &amp; Déontologie ITAA</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Services &amp; Solutions Spécialisées
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Une gamme complète de prestations modulables adaptées à la taille et aux ambitions de votre entreprise en Belgique.
        </p>
      </section>

      {/* Interactive Poles Tabs Navigation */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-mono">
          {SERVICE_POLES.map((pole) => (
            <button
              key={pole.id}
              onClick={() => setActivePoleId(pole.id)}
              className={`p-3 rounded-xl transition-all text-left flex items-center gap-2.5 ${
                activePoleId === pole.id
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md'
                  : 'text-slate-300 hover:bg-slate-800/80'
              }`}
            >
              {pole.id === 'comptabilite' && <Calculator className="w-4 h-4 shrink-0" />}
              {pole.id === 'fiscalite' && <TrendingUp className="w-4 h-4 shrink-0" />}
              {pole.id === 'starters' && <Rocket className="w-4 h-4 shrink-0" />}
              {pole.id === 'pilotage' && <PieChart className="w-4 h-4 shrink-0" />}
              <span className="truncate">{pole.title.split(' ')[0]} {pole.title.split(' ')[1] || ''}</span>
            </button>
          ))}
        </div>

        {/* Selected Pole Active Deep Dive */}
        <div className="p-8 sm:p-10 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-8 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800 pb-6">
            <div className="space-y-2">
              <span className="text-xs font-mono text-amber-400 uppercase tracking-wider">
                Focus Expertise
              </span>
              <h2 className="text-2xl sm:text-3xl font-display font-bold text-white">
                {selectedPole.title}
              </h2>
              <p className="text-sm text-slate-300">{selectedPole.subtitle}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={onOpenBooking}
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors"
              >
                Prendre RDV sur ce pôle
              </button>
              <button
                onClick={onOpenVault}
                className="px-4 py-2.5 bg-slate-950 border border-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
              >
                Déposer un dossier
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-xs font-sans">
            <div className="space-y-4">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider font-mono">
                Description de la mission :
              </h3>
              <p className="text-slate-300 leading-relaxed text-sm">
                {selectedPole.description}
              </p>
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-slate-400">
                <div className="text-amber-400 font-bold">Public cible &amp; Formes juridiques :</div>
                <div>{selectedPole.suitedFor}</div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-sm text-white uppercase tracking-wider font-mono">
                Livrables &amp; Inclusions clés :
              </h3>
              <ul className="space-y-2.5">
                {selectedPole.keyFeatures.map((feat, fIdx) => (
                  <li key={fIdx} className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 flex items-start gap-3">
                    <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Transparency Pricing Formules Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8 pt-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xs font-mono uppercase text-amber-400 tracking-widest">
            Transparence Honoraires
          </h2>
          <h3 className="text-2xl sm:text-3xl font-display font-bold text-white">
            Formules d'accompagnement forfaitaires
          </h3>
          <p className="text-xs text-slate-400">
            Forfaits mensuels prévisibles adaptés au stade de développement de votre entreprise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {pricingPackages.map((pkg, idx) => (
            <div
              key={idx}
              className={`p-6 sm:p-8 rounded-2xl bg-slate-900 border flex flex-col justify-between space-y-6 relative ${
                pkg.isPopular
                  ? 'border-amber-500/80 shadow-2xl shadow-amber-950/30'
                  : 'border-slate-800'
              }`}
            >
              {pkg.isPopular && (
                <span className="absolute -top-3 right-6 px-3 py-1 text-[10px] font-mono font-bold text-slate-950 bg-amber-400 rounded-full shadow-md">
                  Recommandé SRL
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h4 className="font-display font-bold text-xl text-white">{pkg.name}</h4>
                  <p className="text-xs font-mono text-amber-400 mt-1">{pkg.subtitle}</p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono font-bold text-lg text-emerald-400">
                  {pkg.price}
                </div>

                <ul className="space-y-2 text-xs text-slate-300">
                  {pkg.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-3">
                <p className="text-[11px] font-mono text-slate-400">
                  {pkg.recommendedFor}
                </p>

                <button
                  onClick={onOpenBooking}
                  className={`w-full py-3 text-xs font-bold rounded-xl transition-all shadow-md ${
                    pkg.isPopular
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  Demander une proposition d'honoraires
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
