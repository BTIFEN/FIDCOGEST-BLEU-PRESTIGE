import React from 'react';
import { useCabinet } from '../context/CabinetContext';
import { Rocket, ShieldCheck, FileText, CheckCircle2, Building, ArrowRight, Calendar, Calculator, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CreationEntreprisePageProps {
  onOpenBooking: () => void;
}

export const CreationEntreprisePage: React.FC<CreationEntreprisePageProps> = ({ onOpenBooking }) => {
  const { config } = useCabinet();
  const creationPole = config.services.find(s => s.id === 'creation-entreprises');

  return (
    <div className="space-y-12 pb-20 font-sans">
      
      {/* Header */}
      <section className="bg-gradient-to-b from-[#142B45]/5 to-transparent pt-12 pb-8 border-b border-[#E8E6DF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#B79661]/40 text-xs font-serif text-[#142B45] shadow-xs">
            <Rocket className="w-3.5 h-3.5 text-[#B79661]" />
            <span className="font-semibold tracking-wide">Pôle Starters &amp; Constitution de Sociétés en Belgique</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#142B45] tracking-tight">
            Création d'Entreprise &amp; Constitution de SRL
          </h1>

          <p className="text-base text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
            De la validation de votre projet à la remise des statuts officiels : nous sécurisons le plan financier légal, le choix de la structure et l'ensemble des démarches administratives.
          </p>
        </div>
      </section>

      {/* Comparison: Personne Physique vs Société SRL */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
          <h2 className="font-serif font-bold text-2xl text-[#142B45]">
            Personne Physique ou Société (SRL) : Quelle Structure Choisir ?
          </h2>
          <p className="text-xs sm:text-sm text-[#4B5563]">
            Un choix déterminant pour votre patrimoine personnel, votre taux d'imposition et le développement de votre activité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Personne Physique Card */}
          <div className="cabinet-card p-8 space-y-5 border border-[#E8E6DF]">
            <div className="flex items-center justify-between border-b border-[#E8E6DF] pb-4">
              <div>
                <span className="text-xs font-serif text-[#6B7280] font-semibold uppercase">Forme simplifiée</span>
                <h3 className="font-serif font-bold text-xl text-[#142B45]">Indépendant en Personne Physique</h3>
              </div>
              <span className="cabinet-badge-neutral text-xs">Lancement Rapide</span>
            </div>

            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              Idéal pour démarrer une activité avec des investissements limités, tester un concept ou exercer une profession libérale en phase de démarrage.
            </p>

            <ul className="space-y-2 text-xs text-[#374151]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B79661] shrink-0 mt-0.5" />
                <span>Pas de capital minimum requis ni d'acte notarié obligatoire.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B79661] shrink-0 mt-0.5" />
                <span>Comptabilité simplifiée (recettes / dépenses) pour les chiffres d'affaires réduits.</span>
              </li>
              <li className="flex items-start gap-2 text-[#991B1B]">
                <span className="font-bold">Attention :</span>
                <span>Responsabilité illimitée sur votre patrimoine personnel et tranches d'IPP progressives jusqu'à 50%.</span>
              </li>
            </ul>

            <div className="pt-3 border-t border-[#E8E6DF]">
              <span className="text-xs text-[#6B7280]">Recommandé si bénéfice annuel estimé &lt; 40.000 €</span>
            </div>
          </div>

          {/* Société SRL Card */}
          <div className="cabinet-card p-8 space-y-5 border-2 border-[#B79661] bg-gradient-to-b from-[#F7F6F2] to-white relative shadow-md">
            <div className="absolute -top-3 right-6 bg-[#142B45] text-white text-[11px] font-serif font-bold px-3 py-1 rounded-full shadow-xs">
              Recommandé par Fidcogest
            </div>

            <div className="flex items-center justify-between border-b border-[#E8E6DF] pb-4">
              <div>
                <span className="text-xs font-serif text-[#B79661] font-semibold uppercase">Protection Patrimoniale</span>
                <h3 className="font-serif font-bold text-xl text-[#142B45]">Société à Responsabilité Limitée (SRL)</h3>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
              La forme de société par excellence en Belgique : séparation stricte des patrimoines, crédibilité accrue et taxation des bénéfices à taux avantageux.
            </p>

            <ul className="space-y-2 text-xs text-[#374151]">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B79661] shrink-0 mt-0.5" />
                <span>Protection totale du patrimoine personnel en cas de faillite (sauf faute grave).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B79661] shrink-0 mt-0.5" />
                <span>Accès au taux réduit de l'Impôt des Sociétés (ISOC) à 20% sur les premiers 100.000 €.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#B79661] shrink-0 mt-0.5" />
                <span>Distribution de dividendes au taux de précompte mobilier réduit de 15% (régime VVPR-bis).</span>
              </li>
            </ul>

            <div className="pt-3 border-t border-[#E8E6DF] flex items-center justify-between">
              <span className="text-xs font-semibold text-[#142B45]">Exige un Plan Financier Légal certifié</span>
              <button
                onClick={onOpenBooking}
                className="text-xs font-semibold text-[#B79661] hover:underline flex items-center gap-1"
              >
                Planifier ma création →
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* The 5 Steps of Business Setup */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="cabinet-card p-8 sm:p-10 space-y-8">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-serif text-[#B79661] uppercase tracking-wider font-semibold block">
              Parcours Starter Fidcogest
            </span>
            <h3 className="font-serif font-bold text-2xl text-[#142B45]">
              Les 5 Étapes Indispensables de Votre Création de Société
            </h3>
            <p className="text-xs sm:text-sm text-[#4B5563]">
              Fidcogest vous prend par la main du premier brouillon jusqu'à l'obtention de votre numéro de TVA activé.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              {
                step: '01',
                title: 'Plan Financier',
                desc: 'Modélisation du compte de résultat sur 2 à 3 ans et attestation de solidité financière par Paul Holl Mpeck (ITAA).'
              },
              {
                step: '02',
                title: 'Compte Bancaire',
                desc: 'Ouverture du compte bloqué au nom de la société en constitution et obtention de l\'attestation bancaire.'
              },
              {
                step: '03',
                title: 'Acte Notarié',
                desc: 'Passage par-devant notaire pour la signature des statuts authentiques et dépôt au greffe du tribunal de l\'entreprise.'
              },
              {
                step: '04',
                title: 'Immatriculation BCE',
                desc: 'Enregistrement à la Banque-Carrefour des Entreprises et obtention du numéro d\'entreprise officiel (0XXX.XXX.XXX).'
              },
              {
                step: '05',
                title: 'Activation TVA & Caisse',
                desc: 'Dépôt du formulaire 604A auprès du SPF Finances pour activer le numéro TVA et affiliation sociale du dirigeant.'
              }
            ].map((st) => (
              <div key={st.step} className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] space-y-2 flex flex-col justify-between">
                <div>
                  <div className="font-serif font-bold text-lg text-[#B79661]">{st.step}</div>
                  <div className="font-serif font-bold text-sm text-[#142B45] mt-1">{st.title}</div>
                  <p className="text-xs text-[#4B5563] mt-2 leading-relaxed">{st.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-[#142B45] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <div className="font-serif font-bold text-sm text-white">
                Besoin d'un audit préliminaire de faisabilité pour votre future SRL ?
              </div>
              <div className="text-xs text-[#CBD5E1]">
                Nos experts-comptables certifiés ITAA vous reçoivent à Ganshoren ou en visioconférence.
              </div>
            </div>
            <button
              onClick={onOpenBooking}
              className="cabinet-btn-gold text-xs whitespace-nowrap"
            >
              <Calendar className="w-4 h-4" />
              Prendre rendez-vous starter
            </button>
          </div>
        </div>
      </section>

      {/* Detail of All Creation Subservices */}
      {creationPole && (
        <section className="mx-auto max-w-6xl px-4 sm:px-6 space-y-6">
          <h3 className="font-serif font-bold text-2xl text-[#142B45] text-center">
            Détail des Prestations de Notre Pôle Création d'Entreprises
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {creationPole.subServices?.map((sub, i) => (
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

      {/* Direct link to Simulator */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="cabinet-card p-8 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-white via-white to-[#F7F6F2]">
          <div className="space-y-1">
            <h4 className="font-serif font-bold text-lg text-[#142B45]">
              Simulez dès aujourd'hui vos impôts : Indépendant vs SRL
            </h4>
            <p className="text-xs text-[#4B5563]">
              Accédez directement à notre simulateur certifié selon les barèmes fiscaux belges 2026.
            </p>
          </div>
          <Link
            to="/outils-simulateurs"
            className="cabinet-btn-primary text-xs shrink-0"
          >
            <Calculator className="w-4 h-4" />
            Accéder au simulateur en ligne
          </Link>
        </div>
      </section>

    </div>
  );
};
