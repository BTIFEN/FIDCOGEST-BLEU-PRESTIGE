import React, { useState } from 'react';
import { useCabinet } from '../context/CabinetContext';
import { Calculator, TrendingUp, Rocket, PieChart, CheckCircle2, ShieldCheck, ArrowRight, Lock, Building, Smartphone, FileText, ChevronRight, Calendar } from 'lucide-react';
import { Button } from '../components/ui';

interface ServicesPageProps {
  onOpenBooking: () => void;
  onOpenVault: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = ({
  onOpenBooking,
  onOpenVault
}) => {
  const { config } = useCabinet();
  const { services, cabinet } = config;
  const [activePoleId, setActivePoleId] = useState(services[0]?.id || 'comptabilite');

  const selectedPole = services.find((p) => p.id === activePoleId) || services[0];

  const getPoleIcon = (id: string) => {
    switch (id) {
      case 'comptabilite': return <Calculator className="w-4 h-4" />;
      case 'fiscalite': return <TrendingUp className="w-4 h-4" />;
      case 'creation-entreprises': return <Rocket className="w-4 h-4" />;
      case 'conseil-consultance': return <PieChart className="w-4 h-4" />;
      case 'audit-restructuration': return <Building className="w-4 h-4" />;
      case 'recherche-financement': return <ShieldCheck className="w-4 h-4" />;
      case 'e-compta': return <Smartphone className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  const pricingPackages = [
    {
      name: 'Formule Indépendant & Starter',
      subtitle: 'Personne physique, consultant, profession libérale',
      price: 'Forfait sur-mesure dès 120 € HTVA / mois',
      features: [
        'Tenue de la comptabilité simplifiée ou complète',
        'Déclarations périodiques TVA & listing clients annuel',
        'Déclaration Impôt des Personnes Physiques (IPP)',
        'Transmission dématérialisée et sécurisée de vos pièces justificatives',
        'Accompagnement continu par téléphone et email'
      ],
      recommendedFor: 'Consultants, indépendants complémentaires, artisans et professions médicales.'
    },
    {
      name: 'Formule Société SRL Complète',
      subtitle: 'Société à responsabilité limitée en activité ou création',
      price: 'Forfait mensuel à partir de 250 € HTVA',
      isPopular: true,
      features: [
        'Plan financier légal et accompagnement notarié (création)',
        'Tenue comptable complète PCMN et situations périodiques',
        'Déclarations TVA, déclarations ISOC et versements anticipés (VA1-VA4)',
        'Optimisation fiscale rémunération dirigeant vs dividendes VVPR-bis 15%',
        'Transmission numérique sécurisée et conformité facturation Peppol 2026',
        'Dépôt officiel du bilan et des comptes annuels à la BNB'
      ],
      recommendedFor: 'Dirigeants de SRL, PME bruxelloises et wallonnes, sociétés de management.'
    },
    {
      name: 'Formule Conseil & Audit Avancé',
      subtitle: 'PME en croissance, restructuration et transmission',
      price: 'Sur devis & lettre de mission',
      features: [
        'Tableaux de bord trimestriels et analyse financière prévisionnelle',
        'Audit comptable, contrôle interne et valorisation d\'entreprise',
        'Assistance lors des fusions, acquisitions et liquidations',
        'Défense et représentation complète lors des contrôles fiscaux',
        'Dossiers d\'aides, subsides régionaux et crédits bancaires'
      ],
      recommendedFor: 'PME établies, structures en réorganisation et holdings d\'investissement.'
    }
  ];

  return (
    <div className="space-y-16 pb-16 font-sans">
      
      {/* Header Banner */}
      <section className="text-center max-w-3xl mx-auto space-y-4 pt-10 px-4">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#B79661]/40 text-xs font-semibold text-[#8C6A34] shadow-xs">
          <ShieldCheck className="w-4 h-4 text-[#B79661]" />
          <span>Normes Comptables Belges &amp; Déontologie ITAA</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142B45] tracking-tight">
          Les 7 Pôles d'Expertise du Cabinet Fidcogest
        </h1>
        <p className="text-base text-[#4B5563] leading-relaxed">
          Une gamme structurée de prestations certifiées pour sécuriser, optimiser et propulser vos affaires en Belgique.
        </p>
      </section>

      {/* Navigation des 7 pôles (2 colonnes mobile, flex desktop) */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8 space-y-8">
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-2.5 p-2 rounded-2xl bg-white border border-[#E8E6DF] shadow-xs">
          {services.map((pole) => {
            const isActive = activePoleId === pole.id;
            return (
              <button
                key={pole.id}
                type="button"
                onClick={() => setActivePoleId(pole.id)}
                className={`min-h-[48px] py-2.5 px-3 rounded-xl transition-all flex items-center justify-center sm:justify-start gap-2 cursor-pointer text-xs font-bold sm:flex-1 min-w-[140px] border ${
                  isActive
                    ? 'bg-[#142B45] text-[#FFFFFF] border-[#142B45] shadow-xs'
                    : 'bg-[#FAF9F6] text-[#374151] hover:text-[#142B45] hover:bg-[#F0EEE9] border-[#E8E6DF]'
                }`}
              >
                <span className={`shrink-0 ${isActive ? 'text-[#F3D085]' : 'text-[#B79661]'}`}>
                  {getPoleIcon(pole.id)}
                </span>
                <span className={`leading-tight text-center sm:text-left ${isActive ? 'text-[#FFFFFF] font-bold' : 'text-[#374151]'}`}>
                  {pole.shortTitle || pole.title}
                </span>
              </button>
            );
          })}
        </div>

        {/* Fiche détaillée du pôle sélectionné */}
        {selectedPole && (
          <div className="p-6 sm:p-10 rounded-2xl bg-white border border-[#E8E6DF] space-y-8 shadow-[0_6px_30px_rgba(20,43,69,0.04)]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#F0EFEA] pb-6">
              <div className="space-y-1.5">
                <span className="text-xs font-semibold text-[#8C6A34] uppercase tracking-wider">
                  Mission Spécialisée
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45]">
                  {selectedPole.title}
                </h2>
                {selectedPole.tagline && (
                  <p className="text-sm text-[#6B7280]">{selectedPole.tagline}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={onOpenBooking}
                  icon={<Calendar className="w-4 h-4 text-[#FFFFFF]" />}
                >
                  Prendre RDV sur ce pôle
                </Button>
                {selectedPole.id === 'creation-entreprises' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    to="/creation-entreprise"
                  >
                    Guide Création SRL →
                  </Button>
                )}
                {selectedPole.id === 'fiscalite' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    to="/fiscalite"
                  >
                    Détails Fiscalité &amp; Contrôles →
                  </Button>
                )}
                {selectedPole.id === 'e-compta' && (
                  <Button
                    variant="secondary"
                    size="sm"
                    to="/e-compta"
                  >
                    E-Compta &amp; Dématérialisation →
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-6">
              <p className="text-[#4B5563] leading-relaxed text-sm sm:text-base max-w-4xl">
                {selectedPole.description}
              </p>

              {/* Subservices List */}
              {selectedPole.subServices && selectedPole.subServices.length > 0 && (
                <div className="space-y-4 pt-2">
                  <h3 className="font-serif font-bold text-lg text-[#142B45]">
                    Livrables et Missions Comprises dans ce Pôle :
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedPole.subServices.map((sub, sIdx) => (
                      <div key={sIdx} className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF] space-y-1.5">
                        <div className="font-bold text-xs sm:text-sm text-[#142B45] flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#B79661] shrink-0" />
                          <span>{sub.name}</span>
                        </div>
                        <p className="text-xs text-[#4B5563] leading-relaxed pl-6">
                          {sub.details}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {/* Transparency Pricing Formules Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-8 space-y-8 pt-4">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-semibold text-[#8C6A34] uppercase tracking-widest">
            Transparence des Honoraires
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#142B45]">
            Formules d'accompagnement forfaitaires
          </h2>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Forfaits annuels mensualisés, transparents et sans surprise, fixés dès la lettre de mission.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {pricingPackages.map((pkg, idx) => (
            <div
              key={idx}
              className={`p-7 sm:p-8 rounded-2xl bg-white border flex flex-col justify-between space-y-6 relative transition-all shadow-xs ${
                pkg.isPopular
                  ? 'border-[#B79661] ring-2 ring-[#B79661]/25 shadow-lg'
                  : 'border-[#E8E6DF] hover:border-[#B79661]'
              }`}
            >
              {pkg.isPopular && (
                <span className="absolute -top-3 right-6 px-3 py-1 text-xs font-bold text-white bg-[#B79661] rounded-full shadow-xs">
                  Recommandé SRL
                </span>
              )}

              <div className="space-y-4">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#142B45]">{pkg.name}</h3>
                  <p className="text-xs text-[#8C6A34] font-medium mt-1">{pkg.subtitle}</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF] font-serif font-bold text-base text-[#142B45]">
                  {pkg.price}
                </div>

                <ul className="space-y-2.5 text-xs text-[#4B5563]">
                  {pkg.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#B79661] shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-[#F0EFEA] space-y-3">
                <p className="text-xs text-[#6B7280]">
                  {pkg.recommendedFor}
                </p>

                <button
                  onClick={onOpenBooking}
                  className={`w-full py-3 text-xs font-semibold rounded-xl transition-all shadow-xs cursor-pointer ${
                    pkg.isPopular
                      ? 'bg-[#142B45] hover:bg-[#1D3B5C] text-white'
                      : 'bg-[#F7F6F2] hover:bg-[#FAF9F6] border border-[#D1D5DB] text-[#142B45]'
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
