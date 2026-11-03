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
  const collectedVatSales = salesHtva * (salesVatRate / 100);
  const grossPurchasesVat = purchasesHtva * (purchasesVatRate / 100);
  const deductiblePurchasesVat = grossPurchasesVat * (purchasesDeductibility / 100);
  const netVatBalance = collectedVatSales - deductiblePurchasesVat;

  return (
    <div className="p-7 sm:p-9 rounded-2xl bg-white border border-[#E8E6DF] space-y-8 shadow-[0_4px_24px_rgba(20,43,69,0.03)] font-sans">
      
      {/* Module Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 border-b border-[#F0EFEA] pb-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#B79661]/40 text-[#8C6A34] text-xs font-semibold mb-2">
            <Calculator className="w-3.5 h-3.5 text-[#B79661]" />
            <span>Calculateur Officiel TVA Belge (Code TVA 1969)</span>
          </div>
          <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#142B45]">
            Calcul Rapide de la TVA &amp; Déductibilité Professionnelle
          </h3>
          <p className="text-xs sm:text-sm text-[#6B7280]">
            Estimez la TVA de vos factures et anticipez le solde de votre déclaration périodique TVA en Belgique.
          </p>
        </div>

        {/* Mode Selector Buttons */}
        <div className="flex p-1 bg-[#F7F6F2] rounded-xl border border-[#E8E6DF] text-xs shrink-0">
          <button
            onClick={() => setVatMode('htva_to_ttc')}
            className={`px-3 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
              vatMode === 'htva_to_ttc'
                ? 'bg-[#142B45] text-white shadow-xs'
                : 'text-[#4B5563] hover:text-[#142B45]'
            }`}
          >
            HTVA → TTC (+TVA)
          </button>
          <button
            onClick={() => setVatMode('ttc_to_htva')}
            className={`px-3 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
              vatMode === 'ttc_to_htva'
                ? 'bg-[#142B45] text-white shadow-xs'
                : 'text-[#4B5563] hover:text-[#142B45]'
            }`}
          >
            TTC → HTVA (-TVA)
          </button>
          <button
            onClick={() => setVatMode('periodic_balance')}
            className={`px-3 py-2 rounded-lg font-semibold transition-all cursor-pointer ${
              vatMode === 'periodic_balance'
                ? 'bg-[#142B45] text-white shadow-xs'
                : 'text-[#4B5563] hover:text-[#142B45]'
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
              <label className="block text-[#142B45] font-semibold text-xs mb-1.5">
                {vatMode === 'htva_to_ttc' ? 'Montant Hors TVA (HTVA) en €' : 'Montant Toutes Taxes Comprises (TTC) en €'}
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={0}
                  step={10}
                  value={inputAmount}
                  onChange={(e) => setInputAmount(Number(e.target.value) || 0)}
                  className="w-full bg-[#FAF9F6] border border-[#D1D5DB] focus:border-[#B79661] rounded-xl px-4 py-3 text-base font-bold text-[#142B45] focus:outline-none transition-colors"
                />
                <span className="absolute right-4 top-3 text-[#6B7280] font-semibold text-sm">EUR €</span>
              </div>
            </div>

            {/* Select Belgian VAT Rate */}
            <div>
              <label className="block text-[#142B45] font-semibold text-xs mb-1.5">
                Taux de TVA Belgique applicable :
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { rate: 21, label: '21% Standard' },
                  { rate: 12, label: '12% Resto' },
                  { rate: 6, label: '6% Rénov.' },
                  { rate: 0, label: '0% Exonéré' }
                ].map((r) => (
                  <button
                    key={r.rate}
                    type="button"
                    onClick={() => setVatRate(r.rate)}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      vatRate === r.rate
                        ? 'bg-[#142B45] text-white font-bold border-[#142B45]'
                        : 'bg-[#FAF9F6] border-[#E8E6DF] text-[#4B5563] hover:border-[#B79661]'
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Professional Deductibility % */}
            <div>
              <label className="block text-[#142B45] font-semibold text-xs mb-1.5">
                Taux de déductibilité professionnelle :
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { val: 100, label: '100% (Frais pur)' },
                  { val: 75, label: '75% (Mixte partiel)' },
                  { val: 50, label: '50% (Auto standard)' }
                ].map((d) => (
                  <button
                    key={d.val}
                    type="button"
                    onClick={() => setDeductibilityPercent(d.val)}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      deductibilityPercent === d.val
                        ? 'bg-[#142B45] text-white font-bold border-[#142B45]'
                        : 'bg-[#FAF9F6] border-[#E8E6DF] text-[#4B5563] hover:border-[#B79661]'
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result Column */}
          <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-[#FAF9F6] border border-[#E8E6DF] space-y-5">
            <h4 className="font-serif font-bold text-base text-[#142B45] border-b border-[#E8E6DF] pb-3">
              Ventilation Comptable &amp; Fiscale
            </h4>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6B7280]">Montant Net Hors TVA (HTVA) :</span>
                <span className="font-bold text-sm text-[#142B45]">{computedTotalHtva.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#6B7280]">Montant TVA ({vatRate}%) :</span>
                <span className="font-bold text-sm text-[#8C6A34]">{computedVatAmount.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between items-center text-xs pt-2 border-t border-[#E8E6DF]">
                <span className="font-semibold text-[#142B45]">Total TTC (Facture Client / Fournisseur) :</span>
                <span className="font-serif font-bold text-lg text-[#142B45]">{computedTotalTtc.toFixed(2)} €</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E8E6DF] space-y-2">
              <div className="text-xs font-semibold text-[#8C6A34] uppercase tracking-wider">
                Impact sur Déclaration TVA (Grille 59) :
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-[#6B7280]">TVA Récupérable déductible ({deductibilityPercent}%) :</span>
                <span className="font-bold text-[#0E5E3A]">{deductibleVatShare.toFixed(2)} €</span>
              </div>
              {deductibilityPercent < 100 && (
                <div className="flex justify-between text-xs">
                  <span className="text-[#6B7280]">TVA Non-déductible (rejet fiscal) :</span>
                  <span className="font-bold text-[#DC2626]">{nonDeductibleVatShare.toFixed(2)} €</span>
                </div>
              )}
            </div>
          </div>

        </div>
      )}

      {/* MODE 3: PERIODIC RETURN BALANCE */}
      {vatMode === 'periodic_balance' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs font-sans">
          
          <div className="lg:col-span-6 space-y-5">
            <h4 className="font-serif font-bold text-base text-[#142B45]">
              Ventes &amp; Achats du Trimestre
            </h4>

            <div>
              <label className="block text-[#142B45] font-semibold text-xs mb-1.5">
                Ventes / Prestations HTVA réalisées (€) :
              </label>
              <input
                type="number"
                min={0}
                value={salesHtva}
                onChange={(e) => setSalesHtva(Number(e.target.value) || 0)}
                className="w-full bg-[#FAF9F6] border border-[#D1D5DB] focus:border-[#B79661] rounded-xl px-4 py-2.5 text-sm font-bold text-[#142B45] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#142B45] font-semibold text-xs mb-1.5">
                Achats &amp; Frais généraux HTVA engagés (€) :
              </label>
              <input
                type="number"
                min={0}
                value={purchasesHtva}
                onChange={(e) => setPurchasesHtva(Number(e.target.value) || 0)}
                className="w-full bg-[#FAF9F6] border border-[#D1D5DB] focus:border-[#B79661] rounded-xl px-4 py-2.5 text-sm font-bold text-[#142B45] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[#142B45] font-semibold text-xs mb-1.5">
                Déductibilité moyenne des achats (%) :
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[100, 85, 75].map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPurchasesDeductibility(p)}
                    className={`py-2 rounded-xl border text-center transition-all cursor-pointer ${
                      purchasesDeductibility === p
                        ? 'bg-[#142B45] text-white font-bold border-[#142B45]'
                        : 'bg-[#FAF9F6] border-[#E8E6DF] text-[#4B5563]'
                    }`}
                  >
                    {p}% déductible
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 p-6 sm:p-7 rounded-2xl bg-[#FAF9F6] border border-[#E8E6DF] space-y-5">
            <h4 className="font-serif font-bold text-base text-[#142B45] border-b border-[#E8E6DF] pb-3">
              Solde de Déclaration Périodique (Grille 71 / 72)
            </h4>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#6B7280]">TVA Collectée sur ventes (Grille 54) :</span>
                <span className="font-bold text-[#142B45]">{collectedVatSales.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#6B7280]">TVA Déductible sur achats (Grille 59) :</span>
                <span className="font-bold text-[#0E5E3A]">- {deductiblePurchasesVat.toFixed(2)} €</span>
              </div>
              <div className="pt-3 border-t border-[#E8E6DF] flex justify-between items-center">
                <span className="font-semibold text-sm text-[#142B45]">
                  {netVatBalance >= 0 ? 'TVA à verser à l\'État (Grille 71) :' : 'Crédit TVA en votre faveur (Grille 72) :'}
                </span>
                <span className={`font-serif font-bold text-xl ${netVatBalance >= 0 ? 'text-[#8C6A34]' : 'text-[#0E5E3A]'}`}>
                  {Math.abs(netVatBalance).toFixed(2)} €
                </span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-[#E8E6DF] text-xs text-[#6B7280] leading-relaxed">
              💡 <strong>Rappel Fidcogest :</strong> Le solde TVA doit être versé au SPF Finances au plus tard le 20 du mois qui suit le trimestre (ou mois). Le cabinet se charge de la validation et du dépôt de vos déclarations.
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
