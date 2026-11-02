import React, { useState } from 'react';
import { Calculator, ArrowRightLeft, Percent, TrendingUp, TrendingDown, DollarSign, ShieldCheck, Sparkles } from 'lucide-react';

export const VatCalculatorModule: React.FC = () => {
  const [vatMode, setVatMode] = useState<'htva_to_ttc' | 'ttc_to_htva' | 'periodic_balance'>('htva_to_ttc');

  // Mode 1 & 2: Quick Invoice Calculator
  const [inputAmount, setInputAmount] = useState<number>(1000);
  const [vatRate, setVatRate] = useState<number>(21); // 21, 12, 6, 0
  const [deductibilityPercent, setDeductibilityPercent] = useState<number>(100); // 100, 75, 50

  // Mode 3: Periodic Return Balance
  const [salesHtva, setSalesHtva] = useState<number>(25000);
  const [purchasesHtva, setPurchasesHtva] = useState<number>(12000);
  const [salesVatRate, setSalesVatRate] = useState<number>(21);
  const [purchasesVatRate, setPurchasesVatRate] = useState<number>(21);
  const [purchasesDeductibility, setPurchasesDeductibility] = useState<number>(100);

  // Calculations Mode 1 & 2
  const computedVatAmount = vatMode === 'htva_to_ttc'
    ? inputAmount * (vatRate / 100)
    : inputAmount - (inputAmount / (1 + vatRate / 100));

  const computedTotalTtc = vatMode === 'htva_to_ttc'
    ? inputAmount + computedVatAmount
    : inputAmount;

  const computedTotalHtva = vatMode === 'htva_to_ttc'
    ? inputAmount
    : inputAmount / (1 + vatRate / 100);

  const deductibleVatShare = computedVatAmount * (deductibilityPercent / 100);
  const nonDeductibleVatShare = computedVatAmount - deductibleVatShare;

  // Calculations Mode 3 (Periodic Balance)
  const collectedVatSales = salesHtva * (salesSalesVatRate(salesVatRate) / 100);
  function salesSalesVatRate(r: number) { return r; }

  const grossPurchasesVat = purchasesHtva * (purchasesVatRate / 100);
  const deductiblePurchasesVat = grossPurchasesVat * (purchasesDeductibility / 100);

  const netVatBalance = collectedVatSales - deductiblePurchasesVat;

  return (
    <div className="p-6 sm:p-8 rounded-2xl bg-slate-900 border border-slate-800 space-y-6">
      
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-amber-950/80 border border-amber-800/80 text-amber-300 font-mono text-[11px] mb-1">
            <Calculator className="w-3.5 h-3.5 text-amber-400" />
            <span>Calculateur Officiel TVA Belge (Code TVA 1969)</span>
          </div>
          <h3 className="font-display font-bold text-lg text-white">
            Calcul Rapide de la TVA (Déduction &amp; Majoration)
          </h3>
          <p className="text-xs text-slate-400">
            Estimez la TVA de vos factures et anticipez le solde de votre déclaration périodique TVA.
          </p>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono shrink-0">
          <button
            onClick={() => setVatMode('htva_to_ttc')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              vatMode === 'htva_to_ttc'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            HTVA → TTC (+TVA)
          </button>
          <button
            onClick={() => setVatMode('ttc_to_htva')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              vatMode === 'ttc_to_htva'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            TTC → HTVA (-TVA)
          </button>
          <button
            onClick={() => setVatMode('periodic_balance')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              vatMode === 'periodic_balance'
                ? 'bg-amber-500 text-slate-950 font-bold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Solde Déclaration TVA
          </button>
        </div>
      </div>

      {/* MODE 1 & 2: INVOICE QUICK CALCULATOR */}
      {(vatMode === 'htva_to_ttc' || vatMode === 'ttc_to_htva') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs font-sans">
          
          {/* Form Inputs */}
          <div className="lg:col-span-6 space-y-5">
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                {vatMode === 'htva_to_ttc' ? 'Montant Hors TVA (HTVA) en €' : 'Montant Toutes Taxes Comprises (TTC) en €'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={inputAmount}
                  onChange={(e) => setInputAmount(Number(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-base font-mono font-bold text-amber-400 focus:border-amber-500 focus:outline-none"
                />
                <span className="absolute right-4 top-3 text-slate-500 font-mono">EUR €</span>
              </div>
            </div>

            {/* Select Belgian VAT Rate */}
            <div>
              <label className="block text-slate-300 font-medium mb-1.5">
                Taux de TVA Belgique applicable :
              </label>
              <div className="grid grid-cols-4 gap-2 font-mono">
                {[
                  { rate: 21, label: '21% Standard' },
                  { rate: 12, label: '12% Resto/Log.' },
                  { rate: 6, label: '6% Rénov/Essentiel' },
                  { rate: 0, label: '0% Exonéré' }
                ].map((r) => (
                  <button
                    key={r.rate}
                    type="button"
                    onClick={() => setVatRate(r.rate)}
                    className={`py-2 px-2 rounded-xl border text-center transition-all ${
                      vatRate === r.rate
                        ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="font-bold text-sm">{r.rate}%</div>
                    <div className="text-[9px] opacity-80">{r.label.split(' ')[1] || ''}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Professional Deductibility Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-slate-300 font-medium">Taux de déductibilité professionnelle de la TVA :</label>
                <span className="font-mono font-bold text-emerald-400">{deductibilityPercent}%</span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={100}
                  step={25}
                  value={deductibilityPercent}
                  onChange={(e) => setDeductibilityPercent(Number(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
                <span>0% Privé</span>
                <span>50% Télecom/GSM</span>
                <span>75% Voiture/Voiture mixte</span>
                <span>100% Pro Stricte</span>
              </div>
            </div>
          </div>

          {/* Results Summary Box */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-4 font-mono">
            <h4 className="font-bold text-sm text-white border-b border-slate-800 pb-2 flex items-center justify-between">
              <span>Détail de la Facture :</span>
              <span className="text-amber-400 text-xs">Taux {vatRate}%</span>
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">Montant HTVA :</span>
                <span className="text-white font-bold text-sm">{computedTotalHtva.toFixed(2)} €</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-800/80">
                <span className="text-slate-400">Montant de la TVA ({vatRate}%) :</span>
                <span className="text-amber-300 font-bold text-sm">+{computedVatAmount.toFixed(2)} €</span>
              </div>

              <div className="flex justify-between items-center py-2 border-t border-b border-slate-800 bg-slate-900/60 px-3 rounded-xl">
                <span className="text-slate-200 font-bold">Total TTC (Toutes Taxes Comprises) :</span>
                <span className="text-emerald-400 font-extrabold text-base">{computedTotalTtc.toFixed(2)} €</span>
              </div>

              <div className="pt-2 space-y-1 text-xs text-slate-300 font-sans">
                <div className="flex justify-between font-mono text-emerald-400">
                  <span>Part TVA Récupérable / Déductible ({deductibilityPercent}%) :</span>
                  <span>{deductibleVatShare.toFixed(2)} €</span>
                </div>
                {deductibilityPercent < 100 && (
                  <div className="flex justify-between font-mono text-slate-400 text-[11px]">
                    <span>Part TVA Non-déductible (Frais rejetés) :</span>
                    <span>{nonDeductibleVatShare.toFixed(2)} €</span>
                  </div>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-amber-500/20 text-[11px] font-sans text-slate-300 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>Note Expert Fidcogest :</strong> La TVA récupérée sur vos achats professionnels vient directement diminuer la TVA que vous devez reverser à l'État lors de votre déclaration trimestrielle.
              </span>
            </div>
          </div>

        </div>
      )}

      {/* MODE 3: PERIODIC VAT RETURN BALANCE */}
      {vatMode === 'periodic_balance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs font-sans">
          
          {/* Left Inputs */}
          <div className="lg:col-span-6 space-y-5">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="font-bold text-xs text-amber-400 uppercase font-mono flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                1. Chiffre d'Affaires Ventes (TVA Collectée)
              </h4>

              <div>
                <label className="block text-slate-300 text-[11px] mb-1">Total Ventes HTVA du trimestre (€)</label>
                <input
                  type="number"
                  step={500}
                  value={salesHtva}
                  onChange={(e) => setSalesHtva(Number(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-[11px] mb-1">Taux moyen de TVA appliqué aux ventes</label>
                <select
                  value={salesVatRate}
                  onChange={(e) => setSalesVatRate(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                >
                  <option value={21}>21% Taux Normal (Prestations / Ventes B2B)</option>
                  <option value={12}>12% Restauration</option>
                  <option value={6}>6% Taux Réduit</option>
                  <option value={0}>0% Exonéré / Intracommunautaire</option>
                </select>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <h4 className="font-bold text-xs text-emerald-400 uppercase font-mono flex items-center gap-1.5">
                <TrendingDown className="w-4 h-4 text-emerald-400" />
                2. Achats &amp; Charges Professionnelles (TVA Déductible)
              </h4>

              <div>
                <label className="block text-slate-300 text-[11px] mb-1">Total Achats &amp; Frais HTVA du trimestre (€)</label>
                <input
                  type="number"
                  step={500}
                  value={purchasesHtva}
                  onChange={(e) => setPurchasesHtva(Number(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-white font-mono focus:border-amber-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-300 text-[11px] mb-1">Taux TVA Achats</label>
                  <select
                    value={purchasesVatRate}
                    onChange={(e) => setPurchasesVatRate(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  >
                    <option value={21}>21% Standard</option>
                    <option value={12}>12%</option>
                    <option value={6}>6%</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 text-[11px] mb-1">Déductibilité Pro</label>
                  <select
                    value={purchasesDeductibility}
                    onChange={(e) => setPurchasesDeductibility(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  >
                    <option value={100}>100% Pro</option>
                    <option value={75}>75% Véhicule</option>
                    <option value={50}>50% Telecom</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Right Results Balance */}
          <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-950 border border-slate-800 space-y-5 font-mono">
            <h4 className="font-bold text-sm text-white border-b border-slate-800 pb-2">
              Estimation du Solde de Déclaration TVA :
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-1">
                <span className="text-slate-400">TVA Collectée sur Ventes (À reverser) :</span>
                <span className="text-amber-400 font-bold text-sm">+{collectedVatSales.toFixed(2)} €</span>
              </div>

              <div className="flex justify-between items-center py-1 border-t border-slate-800/80">
                <span className="text-slate-400">TVA Déductible sur Achats (À récupérer) :</span>
                <span className="text-emerald-400 font-bold text-sm">-{deductiblePurchasesVat.toFixed(2)} €</span>
              </div>

              <div className={`p-4 rounded-xl border font-bold flex flex-col gap-1 ${
                netVatBalance >= 0
                  ? 'bg-amber-950/20 border-amber-500/40 text-amber-300'
                  : 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
              }`}>
                <div className="text-[11px] text-slate-400 uppercase">
                  {netVatBalance >= 0 ? 'Solde à Payer au SPF Finances :' : 'Crédit de TVA en votre Faveur :'}
                </div>
                <div className="text-xl font-extrabold font-mono">
                  {Math.abs(netVatBalance).toFixed(2)} €
                </div>
                <div className="text-[10px] font-sans text-slate-300 pt-1 border-t border-slate-800/60">
                  {netVatBalance >= 0
                    ? 'Montant net à verser au SPF Finances avant le 20 du mois suivant le trimestre.'
                    : 'Montant à vous faire rembourser ou à reporter sur le trimestre suivant.'}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-[11px] font-sans text-slate-300 space-y-1">
              <div className="font-bold text-amber-400 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Validation Expert Fidcogest
              </div>
              <p>
                Nos experts-comptables certifiés ITAA établissent et vérifient l'intégralité de vos grille-TVA officielles avant envoi sécurisé via Intervat.
              </p>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
