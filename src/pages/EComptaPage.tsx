import React from 'react';
import { useCabinet } from '../context/CabinetContext';
import { Smartphone, CloudUpload, ShieldCheck, CheckCircle2, Lock, FileText, ArrowRight, ExternalLink, HelpCircle } from 'lucide-react';

interface EComptaPageProps {
  onOpenVault: () => void;
}

export const EComptaPage: React.FC<EComptaPageProps> = ({ onOpenVault }) => {
  const { config } = useCabinet();
  const ecomptaPole = config.services.find(s => s.id === 'e-compta');

  return (
    <div className="space-y-12 pb-20 font-sans">
      
      {/* Editorial Header */}
      <section className="bg-gradient-to-b from-[#142B45]/5 to-transparent pt-12 pb-8 border-b border-[#E8E6DF]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#B79661]/40 text-xs font-serif text-[#142B45] shadow-xs">
            <Smartphone className="w-3.5 h-3.5 text-[#B79661]" />
            <span className="font-semibold tracking-wide">E-Compta &amp; Dématérialisation Fidcogest</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#142B45] tracking-tight">
            E-Compta, E-Documents &amp; Basecone
          </h1>

          <p className="text-base text-[#4B5563] max-w-2xl mx-auto leading-relaxed">
            Fini le dépôt physique de fardes papier : transmettez vos factures d'achat et justificatifs en temps réel grâce à notre solution officielle Basecone.
          </p>
        </div>
      </section>

      {/* Presentation of Basecone */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="cabinet-card p-8 sm:p-10 border border-[#B79661]/40 bg-gradient-to-br from-white via-white to-[#F7F6F2]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#142B45] text-[#B79661] text-xs font-serif font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Outil Officiel Déployé chez Fidcogest SRL</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#142B45]">
                Basecone : L'Alliance du Numérique et de l'Expertise Humaine
              </h2>

              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                Utilisé historiquement par notre cabinet, <strong>Basecone</strong> est une plateforme cloud certifiée (Wolters Kluwer) qui fluidifie les échanges entre vous et votre gestionnaire de dossier.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-white border border-[#E8E6DF] space-y-1.5 shadow-xs">
                  <div className="font-serif font-bold text-sm text-[#142B45] flex items-center gap-2">
                    <CloudUpload className="w-4 h-4 text-[#B79661]" />
                    Numérisation Instantanée
                  </div>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Prenez en photo votre ticket de restaurant ou déposez votre facture PDF depuis votre application mobile ou ordinateur.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-white border border-[#E8E6DF] space-y-1.5 shadow-xs">
                  <div className="font-serif font-bold text-sm text-[#142B45] flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#B79661]" />
                    Archivage Légal 10 Ans
                  </div>
                  <p className="text-xs text-[#4B5563] leading-relaxed">
                    Toutes vos pièces comptables sont conservées sur des serveurs sécurisés en Europe conformément aux obligations fiscales belges.
                  </p>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenVault}
                  className="cabinet-btn-primary text-xs"
                >
                  <CloudUpload className="w-4 h-4" />
                  Tester le dépôt express &amp; OCR
                </button>
                <a
                  href="https://www.basecone.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="cabinet-btn-secondary text-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#B79661]" />
                  Découvrir Basecone ↗
                </a>
              </div>
            </div>

            <div className="lg:col-span-4 p-6 rounded-2xl bg-[#142B45] text-white space-y-4 text-center">
              <div className="w-16 h-16 rounded-full bg-[#B79661] text-[#142B45] flex items-center justify-center font-serif text-2xl font-bold mx-auto shadow-md">
                B
              </div>
              <h4 className="font-serif font-bold text-base text-white">
                Accès Client Basecone
              </h4>
              <p className="text-xs text-[#CBD5E1] leading-relaxed">
                Chaque client sous contrat dispose d'un identifiant dédié pour soumettre ses factures sans déplacement.
              </p>
              <div className="text-[11px] text-[#B79661] font-mono border-t border-white/10 pt-3">
                Identifiant Peppol Fidcogest :<br />
                <span className="text-white font-bold">0208:0899441309</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How the Process Works */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h3 className="font-serif font-bold text-2xl text-[#142B45]">
            Comment Fonctionne Votre E-Compta au Quotidien ?
          </h3>
          <p className="text-xs sm:text-sm text-[#4B5563]">
            Un circuit sans friction pour ne plus jamais accumuler de reçus perdus.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: '1',
              title: 'Vous photographiez',
              desc: 'À la réception d\'une facture ou d\'un ticket, vous le numérisez avec l\'app mobile ou par transfert email direct.'
            },
            {
              step: '2',
              title: 'Reconnaissance OCR',
              desc: 'Le moteur extrait automatiquement le numéro BCE du fournisseur, le montant HTVA, le taux de TVA et la date.'
            },
            {
              step: '3',
              title: 'Validation Fidcogest',
              desc: 'Votre gestionnaire vérifie l\'imputation comptable exacte selon le Plan Comptable belge.'
            },
            {
              step: '4',
              title: 'Déclarations à jour',
              desc: 'Vos déclarations périodiques de TVA et vos bilans se construisent en continu, sans stress de clôture.'
            }
          ].map((item) => (
            <div key={item.step} className="cabinet-card p-6 space-y-3">
              <div className="w-8 h-8 rounded-full bg-[#142B45] text-[#B79661] flex items-center justify-center font-bold text-xs">
                {item.step}
              </div>
              <h4 className="font-serif font-bold text-base text-[#142B45]">
                {item.title}
              </h4>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Transparent Disclaimer Box */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="p-6 rounded-2xl bg-[#F7F6F2] border border-[#E8E6DF] space-y-2 text-xs text-[#4B5563]">
          <div className="flex items-center gap-2 font-serif font-bold text-sm text-[#142B45]">
            <HelpCircle className="w-4 h-4 text-[#B79661]" />
            Précision déontologique et technique
          </div>
          <p className="leading-relaxed">
            Le module de démonstration de dépôt express intégré à ce site permet de tester la reconnaissance optique de caractères (OCR). L'accès complet à votre espace comptable pérenne Basecone et l'activation des flux automatisés nécessitent la signature préalable d'une lettre de mission auprès de FIDCOGEST SRL.
          </p>
        </div>
      </section>

    </div>
  );
};
