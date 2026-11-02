import React, { useState } from 'react';
import { TAX_DEADLINES_2026, PRACTICAL_GUIDES } from '../data/mockData';
import { VatCalculatorModule } from '../components/VatCalculatorModule';
import { Calculator, Calendar, Download, ShieldCheck, Sparkles, TrendingUp, AlertTriangle, FileText, CheckCircle2, ArrowRight, Percent } from 'lucide-react';

export const ToolsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'simulators' | 'vat' | 'calendar' | 'guides'>('simulators');

  // Simulator Form State
  const [entityType, setEntityType] = useState<'personne_physique' | 'srl'>('srl');
  const [grossRevenue, setGrossRevenue] = useState<number>(95000);
  const [professionalExpenses, setProfessionalExpenses] = useState<number>(20000);
  const [managerSalary, setManagerSalary] = useState<number>(45000);

  const [simResult, setSimResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);

  // Run calculation via backend or local formula
  const handleCalculate = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/simulate-tax', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entityType,
          grossRevenue,
          professionalExpenses,
          managerSalary
        })
      });
      const data = await res.json();
      setSimResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSimulating(false);
    }
  };

  React.useEffect(() => {
    handleCalculate();
  }, [entityType, grossRevenue, professionalExpenses, managerSalary]);

  return (
    <div className="space-y-12 pb-12 font-sans">
      
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-3 pt-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-amber-500/30 text-xs font-mono text-amber-300">
          <Calculator className="w-4 h-4 text-amber-400" />
          <span>Calculateurs Fiscaux Belges &amp; Guides Officiels</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-display font-extrabold text-white tracking-tight">
          Espace Outils &amp; Simulateurs Fiscaux
        </h1>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Calculez votre TVA, évaluez votre rémunération de dirigeant et consultez le calendrier des échéances fiscales de Belgique.
        </p>
      </section>

      {/* Main Tabs Navigation */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex border-b border-slate-800 text-xs font-mono overflow-x-auto no-scrollbar">
          <button
            onClick={() => setActiveTab('simulators')}
            className={`py-3 px-5 border-b-2 font-bold transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'simulators'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            Simulateur Rémunération &amp; SRL vs Indépendant
          </button>

          <button
            onClick={() => setActiveTab('vat')}
            className={`py-3 px-5 border-b-2 font-bold transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'vat'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Percent className="w-4 h-4" />
            Calculateur Rapide TVA (Déduction &amp; Majoration)
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-3 px-5 border-b-2 font-bold transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'calendar'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Calendrier Interactif Échéances 2026
          </button>

          <button
            onClick={() => setActiveTab('guides')}
            className={`py-3 px-5 border-b-2 font-bold transition-colors flex items-center gap-2 whitespace-nowrap shrink-0 ${
              activeTab === 'guides'
                ? 'border-amber-400 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" />
            Guides &amp; Checklists Téléchargeables
          </button>
        </div>
      </div>

      {/* TAB 1: SIMULATOR REMUNERATION */}
      {activeTab === 'simulators' && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Form Column */}
            <div className="lg:col-span-5 p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="space-y-1">
                <h3 className="font-display font-bold text-lg text-white">Paramètres de Simulation</h3>
                <p className="text-xs text-slate-400">Renseignez vos estimations financières annuelles en Belgique</p>
              </div>

              {/* Entity Type Toggle */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-2">Forme Juridique :</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono">
                  <button
                    type="button"
                    onClick={() => setEntityType('personne_physique')}
                    className={`py-2 px-3 rounded-lg transition-colors ${
                      entityType === 'personne_physique'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Indépendant (Personne physique)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEntityType('srl')}
                    className={`py-2 px-3 rounded-lg transition-colors ${
                      entityType === 'srl'
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Société SRL
                  </button>
                </div>
              </div>

              {/* Revenue Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label className="text-slate-300 font-medium">Chiffre d'Affaires Brut HTVA (€)</label>
                  <span className="font-mono font-bold text-amber-400">{grossRevenue.toLocaleString('fr-BE')} €</span>
                </div>
                <input
                  type="range"
                  min={30000}
                  max={300000}
                  step={5000}
                  value={grossRevenue}
                  onChange={(e) => setGrossRevenue(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Expenses Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label className="text-slate-300 font-medium">Frais Professionnels Déductibles (€)</label>
                  <span className="font-mono font-bold text-slate-300">{professionalExpenses.toLocaleString('fr-BE')} €</span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={80000}
                  step={2500}
                  value={professionalExpenses}
                  onChange={(e) => setProfessionalExpenses(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Manager Salary (if SRL) */}
              {entityType === 'srl' && (
                <div className="space-y-2 pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs">
                    <label className="text-slate-300 font-medium">Rémunération Dirigeant Brute / An (€)</label>
                    <span className="font-mono font-bold text-emerald-400">{managerSalary.toLocaleString('fr-BE')} €</span>
                  </div>
                  <input
                    type="range"
                    min={15000}
                    max={100000}
                    step={5000}
                    value={managerSalary}
                    onChange={(e) => setManagerSalary(Number(e.target.value))}
                    className="w-full accent-emerald-500 cursor-pointer"
                  />
                  <p className="text-[10px] text-slate-400 font-mono">
                    💡 45.000 €/an est le seuil légal recommandé pour accéder au taux réduit d'ISOC à 20%.
                  </p>
                </div>
              )}
            </div>

            {/* Results Column */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h3 className="font-display font-bold text-lg text-white">Résultat de l'Estimation Fiscale</h3>
                  <p className="text-xs text-slate-400 font-mono">Barème belge 2026 • IPP, Cotisations Sociales &amp; ISOC</p>
                </div>
                <span className="px-3 py-1 text-xs font-mono bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-full">
                  Légalité Vériﬁée
                </span>
              </div>

              {simResult && (
                <div className="space-y-6 text-xs font-sans">
                  
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 text-[11px]">Bénéfice Avant Impôt :</div>
                      <div className="text-lg font-mono font-bold text-white mt-1">
                        {simResult.netProfitBeforeTax.toLocaleString('fr-BE')} €
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 text-[11px]">Revenu Net Poche Global :</div>
                      <div className="text-lg font-mono font-bold text-emerald-400 mt-1">
                        {(simResult.netIncomeAfterAllTaxes || simResult.totalNetTakeHome).toFixed(0)} €
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                      <div className="text-slate-400 text-[11px]">Pression Fiscale Globale :</div>
                      <div className="text-lg font-mono font-bold text-amber-400 mt-1">
                        {simResult.effectiveTaxRatePercent} %
                      </div>
                    </div>
                  </div>

                  {/* Breakdown details */}
                  <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-2 font-mono text-xs">
                    <div className="font-bold text-amber-400 border-b border-slate-800 pb-2">
                      Décomposition Fiscale Détaillée :
                    </div>
                    {entityType === 'personne_physique' ? (
                      <>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-400">Cotisations Sociales Indépendant (~20.5%) :</span>
                          <span className="text-slate-200">{simResult.socialContributions.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between py-1 border-t border-slate-800/60">
                          <span className="text-slate-400">Impôt des Personnes Physiques (IPP) :</span>
                          <span className="text-amber-300">{simResult.taxAmount.toFixed(2)} €</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-400">Taux d'ISOC Appliqué :</span>
                          <span className="text-emerald-400 font-bold">{simResult.isocRatePercent}%</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-slate-400">Impôt des Sociétés (ISOC) :</span>
                          <span className="text-slate-200">{simResult.isocTaxAmount.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between py-1 border-t border-slate-800/60">
                          <span className="text-slate-400">Précompte Mobilier Dividendes VVPR-bis (15%) :</span>
                          <span className="text-amber-300">{simResult.dividendTaxAmount.toFixed(2)} €</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Expert Recommendation Notice */}
                  <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 text-amber-200 leading-relaxed space-y-1">
                    <div className="font-bold flex items-center gap-1.5 text-amber-400">
                      <Sparkles className="w-4 h-4" /> Conseil Stratégique Fidcogest :
                    </div>
                    <p className="text-xs">{simResult.recommendation}</p>
                  </div>

                </div>
              )}
            </div>

          </div>
        </section>
      )}

      {/* TAB 2: VAT CALCULATOR MODULE */}
      {activeTab === 'vat' && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <VatCalculatorModule />
        </section>
      )}

      {/* TAB 3: FISCAL CALENDAR */}
      {activeTab === 'calendar' && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TAX_DEADLINES_2026.map((dl) => (
              <div
                key={dl.id}
                className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 transition-all flex justify-between gap-4"
              >
                <div className="space-y-2">
                  <span className="px-2.5 py-0.5 text-[10px] font-mono rounded bg-slate-950 text-amber-400 font-bold border border-slate-800">
                    {dl.category} • {dl.period}
                  </span>
                  <h4 className="font-bold text-sm text-white">{dl.title}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{dl.description}</p>
                </div>

                <div className="text-right shrink-0 font-mono">
                  <div className="text-emerald-400 font-bold text-xs">{dl.dueDate}</div>
                  {dl.isUrgent && (
                    <span className="inline-block mt-2 px-2 py-0.5 text-[10px] bg-amber-500 text-slate-950 font-bold rounded">
                      Prioritaire
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 4: GUIDES */}
      {activeTab === 'guides' && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PRACTICAL_GUIDES.map((guide) => (
              <div
                key={guide.id}
                className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4 text-xs"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <FileText className="w-8 h-8 text-amber-400" />
                    <span className="px-2 py-0.5 text-[10px] font-mono bg-slate-950 text-emerald-400 border border-slate-800 rounded">
                      {guide.format}
                    </span>
                  </div>
                  <h4 className="font-bold text-base text-white">{guide.title}</h4>
                  <p className="text-slate-400 leading-relaxed">{guide.description}</p>
                </div>

                <button
                  onClick={() => alert(`Téléchargement de ${guide.filename} démarré.`)}
                  className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-md"
                >
                  <Download className="w-4 h-4" />
                  Télécharger le Guide (.PDF)
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
