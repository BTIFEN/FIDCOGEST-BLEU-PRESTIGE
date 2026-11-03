import React, { useState } from 'react';
import { TAX_DEADLINES_2026, PRACTICAL_GUIDES } from '../data/mockData';
import { VatCalculatorModule } from '../components/VatCalculatorModule';
import { Calculator, Calendar, Download, ShieldCheck, Sparkles, TrendingUp, AlertTriangle, FileText, CheckCircle2, ArrowRight, Percent, Check } from 'lucide-react';

export const ToolsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'simulators' | 'vat' | 'calendar' | 'guides'>('simulators');

  // Simulator Form State
  const [entityType, setEntityType] = useState<'personne_physique' | 'srl'>('srl');
  const [grossRevenue, setGrossRevenue] = useState<number>(95000);
  const [professionalExpenses, setProfessionalExpenses] = useState<number>(20000);
  const [managerSalary, setManagerSalary] = useState<number>(45000);

  const [simResult, setSimResult] = useState<any>(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

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

  const handleDownloadGuide = (title: string) => {
    setDownloadSuccess(title);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-12 pb-16 font-sans">
      
      {/* Header */}
      <section className="text-center max-w-3xl mx-auto space-y-3 pt-10 px-4">
        <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[#B79661]/40 text-xs font-semibold text-[#8C6A34] shadow-xs">
          <Calculator className="w-4 h-4 text-[#B79661]" />
          <span>Calculateurs Fiscaux Belges &amp; Guides Officiels</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#142B45] tracking-tight">
          Espace Outils &amp; Simulateurs Fiscaux
        </h1>
        <p className="text-sm sm:text-base text-[#4B5563] leading-relaxed">
          Calculez votre TVA, évaluez votre rémunération optimale de dirigeant et consultez le calendrier des échéances de Belgique.
        </p>
      </section>

      {/* Main Tabs Navigation */}
      <div className="mx-auto max-w-7xl px-4 sm:px-8">
        <div className="flex border-b border-[#E8E6DF] text-xs overflow-x-auto no-scrollbar gap-2">
          <button
            onClick={() => setActiveTab('simulators')}
            className={`py-3.5 px-5 font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
              activeTab === 'simulators'
                ? 'border-[#B79661] text-[#142B45] font-bold bg-white/60 rounded-t-lg'
                : 'border-transparent text-[#6B7280] hover:text-[#142B45]'
            }`}
          >
            <Calculator className="w-4 h-4 text-[#B79661]" />
            Simulateur Rémunération &amp; SRL vs Indépendant
          </button>

          <button
            onClick={() => setActiveTab('vat')}
            className={`py-3.5 px-5 font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
              activeTab === 'vat'
                ? 'border-[#B79661] text-[#142B45] font-bold bg-white/60 rounded-t-lg'
                : 'border-transparent text-[#6B7280] hover:text-[#142B45]'
            }`}
          >
            <Percent className="w-4 h-4 text-[#B79661]" />
            Calculateur Rapide TVA &amp; Déduction
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`py-3.5 px-5 font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
              activeTab === 'calendar'
                ? 'border-[#B79661] text-[#142B45] font-bold bg-white/60 rounded-t-lg'
                : 'border-transparent text-[#6B7280] hover:text-[#142B45]'
            }`}
          >
            <Calendar className="w-4 h-4 text-[#B79661]" />
            Calendrier Interactif Échéances 2026
          </button>

          <button
            onClick={() => setActiveTab('guides')}
            className={`py-3.5 px-5 font-semibold transition-all flex items-center gap-2 whitespace-nowrap shrink-0 border-b-2 cursor-pointer ${
              activeTab === 'guides'
                ? 'border-[#B79661] text-[#142B45] font-bold bg-white/60 rounded-t-lg'
                : 'border-transparent text-[#6B7280] hover:text-[#142B45]'
            }`}
          >
            <Download className="w-4 h-4 text-[#B79661]" />
            Guides &amp; Checklists Téléchargeables
          </button>
        </div>
      </div>

      {/* TAB 1: SIMULATOR REMUNERATION */}
      {activeTab === 'simulators' && (
        <section className="mx-auto max-w-7xl px-4 sm:px-8 space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Input Form Column */}
            <div className="lg:col-span-5 p-7 rounded-2xl bg-white border border-[#E8E6DF] space-y-6 shadow-[0_4px_24px_rgba(20,43,69,0.03)]">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-lg text-[#142B45]">Paramètres de Simulation</h3>
                <p className="text-xs text-[#6B7280]">Renseignez vos estimations financières annuelles en Belgique</p>
              </div>

              {/* Entity Type Toggle */}
              <div>
                <label className="block text-xs font-semibold text-[#142B45] mb-2 uppercase tracking-wider">Forme Juridique :</label>
                <div className="grid grid-cols-2 gap-2 p-1 bg-[#FAF9F6] rounded-xl border border-[#E8E6DF] text-xs">
                  <button
                    type="button"
                    onClick={() => setEntityType('personne_physique')}
                    className={`py-2 px-3 rounded-lg font-semibold transition-all cursor-pointer ${
                      entityType === 'personne_physique'
                        ? 'bg-[#142B45] text-white shadow-xs'
                        : 'text-[#4B5563] hover:text-[#142B45]'
                    }`}
                  >
                    Indépendant (IPP)
                  </button>
                  <button
                    type="button"
                    onClick={() => setEntityType('srl')}
                    className={`py-2 px-3 rounded-lg font-semibold transition-all cursor-pointer ${
                      entityType === 'srl'
                        ? 'bg-[#142B45] text-white shadow-xs'
                        : 'text-[#4B5563] hover:text-[#142B45]'
                    }`}
                  >
                    Société SRL (ISOC)
                  </button>
                </div>
              </div>

              {/* Revenue Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label className="text-[#374151] font-semibold">Chiffre d'Affaires Brut HTVA</label>
                  <span className="font-bold text-[#142B45]">{grossRevenue.toLocaleString('fr-BE')} €</span>
                </div>
                <input
                  type="range"
                  min={30000}
                  max={300000}
                  step={5000}
                  value={grossRevenue}
                  onChange={(e) => setGrossRevenue(Number(e.target.value))}
                  className="w-full accent-[#142B45] cursor-pointer"
                />
              </div>

              {/* Expenses Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <label className="text-[#374151] font-semibold">Frais Professionnels Déductibles</label>
                  <span className="font-bold text-[#374151]">{professionalExpenses.toLocaleString('fr-BE')} €</span>
                </div>
                <input
                  type="range"
                  min={5000}
                  max={80000}
                  step={2500}
                  value={professionalExpenses}
                  onChange={(e) => setProfessionalExpenses(Number(e.target.value))}
                  className="w-full accent-[#142B45] cursor-pointer"
                />
              </div>

              {/* Manager Salary (if SRL) */}
              {entityType === 'srl' && (
                <div className="space-y-2 pt-3 border-t border-[#F0EFEA]">
                  <div className="flex justify-between text-xs">
                    <label className="text-[#374151] font-semibold">Rémunération Dirigeant Brute / An</label>
                    <span className="font-bold text-[#8C6A34]">{managerSalary.toLocaleString('fr-BE')} €</span>
                  </div>
                  <input
                    type="range"
                    min={15000}
                    max={100000}
                    step={5000}
                    value={managerSalary}
                    onChange={(e) => setManagerSalary(Number(e.target.value))}
                    className="w-full accent-[#8C6A34] cursor-pointer"
                  />
                  <p className="text-xs text-[#6B7280] leading-snug">
                    💡 45.000 €/an est le seuil légal pour accéder au taux réduit d'ISOC à 20% sur la 1ère tranche de 100.000 €.
                  </p>
                </div>
              )}
            </div>

            {/* Results Column */}
            <div className="lg:col-span-7 p-7 sm:p-8 rounded-2xl bg-white border border-[#E8E6DF] space-y-6 shadow-[0_4px_24px_rgba(20,43,69,0.03)]">
              <div className="flex items-center justify-between border-b border-[#F0EFEA] pb-4">
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#142B45]">Résultat de l'Estimation Fiscale</h3>
                  <p className="text-xs text-[#6B7280]">Barème fiscal belge 2026 • IPP, Cotisations Sociales &amp; ISOC</p>
                </div>
                <span className="px-3 py-1 text-xs font-semibold bg-[#FAF9F6] text-[#8C6A34] border border-[#B79661]/30 rounded-full">
                  Législation Conforme
                </span>
              </div>

              {simResult && (
                <div className="space-y-6 text-xs font-sans">
                  
                  {/* KPI Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF]">
                      <div className="text-[#6B7280] text-xs">Bénéfice Avant Impôt :</div>
                      <div className="font-serif text-xl font-bold text-[#142B45] mt-1">
                        {simResult.netProfitBeforeTax.toLocaleString('fr-BE')} €
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF]">
                      <div className="text-[#6B7280] text-xs">Revenu Net Poche Global :</div>
                      <div className="font-serif text-xl font-bold text-[#0E5E3A] mt-1">
                        {(simResult.netIncomeAfterAllTaxes || simResult.totalNetTakeHome).toFixed(0)} €
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF]">
                      <div className="text-[#6B7280] text-xs">Pression Fiscale Globale :</div>
                      <div className="font-serif text-xl font-bold text-[#8C6A34] mt-1">
                        {simResult.effectiveTaxRatePercent} %
                      </div>
                    </div>
                  </div>

                  {/* Breakdown details */}
                  <div className="p-5 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF] space-y-2.5 text-xs">
                    <div className="font-bold text-[#142B45] border-b border-[#E8E6DF] pb-2 font-serif text-sm">
                      Décomposition Fiscale Détaillée :
                    </div>
                    {entityType === 'personne_physique' ? (
                      <>
                        <div className="flex justify-between py-1">
                          <span className="text-[#6B7280]">Cotisations Sociales Indépendant (~20.5%) :</span>
                          <span className="font-semibold text-[#142B45]">{simResult.socialContributions.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between py-1 border-t border-[#E8E6DF]">
                          <span className="text-[#6B7280]">Impôt des Personnes Physiques (IPP) :</span>
                          <span className="font-semibold text-[#8C6A34]">{simResult.taxAmount.toFixed(2)} €</span>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="flex justify-between py-1">
                          <span className="text-[#6B7280]">Taux d'ISOC Appliqué :</span>
                          <span className="text-[#0E5E3A] font-bold">{simResult.isocRatePercent}%</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-[#6B7280]">Impôt des Sociétés (ISOC) :</span>
                          <span className="font-semibold text-[#142B45]">{simResult.isocTaxAmount.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between py-1 border-t border-[#E8E6DF]">
                          <span className="text-[#6B7280]">Précompte Mobilier Dividendes VVPR-bis (15%) :</span>
                          <span className="font-semibold text-[#8C6A34]">{simResult.dividendTaxAmount.toFixed(2)} €</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Expert Recommendation Notice */}
                  <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#B79661]/40 text-[#4B5563] leading-relaxed space-y-1.5">
                    <div className="font-bold flex items-center gap-1.5 text-[#8C6A34] font-serif text-sm">
                      <Sparkles className="w-4 h-4 text-[#B79661]" /> Orientation Stratégique Fidcogest :
                    </div>
                    <p className="text-xs leading-relaxed">{simResult.recommendation}</p>
                    <div className="pt-2 border-t border-[#E8E6DF] text-xs text-[#6B7280]">
                      ℹ️ <strong>Mention légale et déontologique :</strong> Cette simulation chiffrée est fournie à titre indicatif et ne constitue pas un avis fiscal personnalisé. Toute décision d'arbitrage requiert l'examen approfondi de votre dossier par un conseiller fiscal certifié ITAA.
                    </div>
                  </div>

                </div>
              )}
            </div>

          </div>
        </section>
      )}

      {/* TAB 2: VAT CALCULATOR MODULE */}
      {activeTab === 'vat' && (
        <section className="mx-auto max-w-7xl px-4 sm:px-8">
          <VatCalculatorModule />
        </section>
      )}

      {/* TAB 3: FISCAL CALENDAR */}
      {activeTab === 'calendar' && (
        <section className="mx-auto max-w-7xl px-4 sm:px-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {TAX_DEADLINES_2026.map((dl) => (
              <div
                key={dl.id}
                className="p-6 rounded-2xl bg-white border border-[#E8E6DF] hover:border-[#B79661] transition-all flex justify-between gap-5 shadow-[0_2px_12px_rgba(20,43,69,0.03)]"
              >
                <div className="space-y-2">
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-md bg-[#FAF9F6] text-[#8C6A34] border border-[#E8E6DF]">
                    {dl.category} • {dl.period}
                  </span>
                  <h4 className="font-serif font-bold text-base text-[#142B45]">{dl.title}</h4>
                  <p className="text-xs text-[#6B7280] leading-relaxed">{dl.description}</p>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-[#0E5E3A] font-bold text-xs bg-[#FAF9F6] px-2.5 py-1 rounded-md border border-[#E8E6DF] inline-block">
                    {dl.dueDate}
                  </div>
                  {dl.isUrgent && (
                    <div className="mt-2 text-xs font-bold text-[#8C6A34] bg-[#B79661]/12 px-2 py-0.5 rounded-full inline-block">
                      Prioritaire
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TAB 4: GUIDES */}
      {activeTab === 'guides' && (
        <section className="mx-auto max-w-7xl px-4 sm:px-8 space-y-6">
          {downloadSuccess && (
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Téléchargement préparé avec succès pour : <strong>{downloadSuccess}</strong></span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {PRACTICAL_GUIDES.map((guide) => (
              <div
                key={guide.id}
                className="p-7 rounded-2xl bg-white border border-[#E8E6DF] flex flex-col justify-between space-y-5 text-xs shadow-[0_4px_24px_rgba(20,43,69,0.03)]"
              >
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <FileText className="w-8 h-8 text-[#B79661]" />
                    <span className="px-2.5 py-0.5 text-xs font-semibold bg-[#FAF9F6] text-[#8C6A34] border border-[#E8E6DF] rounded-md">
                      {guide.format}
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-[#142B45]">{guide.title}</h4>
                  <p className="text-[#6B7280] leading-relaxed">{guide.description}</p>
                </div>

                <button
                  onClick={() => handleDownloadGuide(guide.title)}
                  className="w-full py-2.5 bg-[#142B45] hover:bg-[#1D3B5C] text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer shadow-xs"
                >
                  <Download className="w-4 h-4 text-[#D9BD8E]" />
                  <span>Télécharger le Guide (.PDF)</span>
                </button>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
};
