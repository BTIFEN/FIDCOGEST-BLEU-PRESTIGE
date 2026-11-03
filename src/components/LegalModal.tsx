import React from 'react';
import { X, ShieldCheck, FileText, Lock, Building } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white border border-[#E8E6DF] shadow-2xl overflow-hidden text-[#1F2937] my-8 animate-in fade-in zoom-in-95 duration-200 modal-white-card">
        
        {/* Header */}
        <div className="p-6 border-b border-[#1D3B5C] bg-[#142B45] text-white flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-white/10 text-[#F3D085] border border-white/20 flex items-center justify-center font-serif text-lg font-bold shadow-xs">
              <ShieldCheck className="w-5 h-5 text-[#F3D085]" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-white">
                Mentions Légales, Agréments ITAA &amp; RGPD
              </h3>
              <p className="text-xs text-[#E2E8F0] font-sans mt-0.5 font-medium">
                Cabinet Fidcogest SRL • Édition Révisée 2026
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 space-y-6 text-xs sm:text-sm text-[#4B5563] max-h-[500px] overflow-y-auto leading-relaxed font-sans">
          <section className="space-y-2.5">
            <h4 className="font-serif font-bold text-base text-[#142B45]">
              1. Identification de l'Éditeur &amp; Agrément Officiel
            </h4>
            <p>
              Le présent site internet est édité par la société <strong>Fidcogest SRL</strong>, cabinet d'expertise comptable et de conseil fiscal certifié sous le numéro d'agrément officiel <strong>ITAA 10.842.109</strong> (Institute for Tax Advisors and Accountants).
            </p>
            <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] space-y-1.5 font-mono text-xs text-[#374151]">
              <div><strong>Forme juridique :</strong> Société à Responsabilité Limitée (SRL)</div>
              <div><strong>Siège social :</strong> Avenue Louise 240, 1050 Bruxelles, Belgique</div>
              <div><strong>Implantation secondaire :</strong> Boulevard Dolez 12, 7000 Mons, Belgique</div>
              <div><strong>Numéro d'entreprise (BCE) :</strong> 0842.109.812</div>
              <div><strong>Numéro de TVA :</strong> BE 0842.109.812</div>
              <div><strong>Courriel :</strong> contact@fidcogest.be | <strong>Tél :</strong> +32 2 555 01 88</div>
            </div>
          </section>

          <section className="space-y-2.5 pt-4 border-t border-[#E8E6DF]">
            <h4 className="font-serif font-bold text-base text-[#142B45]">
              2. Secret Professionnel &amp; Déontologie ITAA
            </h4>
            <p>
              En qualité d'experts-comptables certifiés et de conseillers fiscaux certifiés par l'ITAA, l'ensemble des associés et collaborateurs de Fidcogest sont tenus au respect strict du <strong>secret professionnel</strong> (article 458 du Code pénal belge) et des normes déontologiques instituées par l'Institut des Conseillers Fiscaux et des Experts-Comptables.
            </p>
          </section>

          <section className="space-y-2.5 pt-4 border-t border-[#E8E6DF]">
            <h4 className="font-serif font-bold text-base text-[#142B45]">
              3. Protection des Données Personnelles (RGPD)
            </h4>
            <p>
              Conformément au Règlement Général sur la Protection des Données (UE 2016/679), les données traitées via nos interfaces numériques (prise de rendez-vous, simulateurs, dépôt sécurisé de pièces comptables) sont destinées exclusivement à l'accomplissement des missions fiduciaires et fiscales convenues dans la lettre de mission.
            </p>
            <p>
              Toutes les données sont hébergées au sein de l'Union Européenne sous chiffrement TLS de niveau bancaire. Pour exercer vos droits d'accès, de rectification ou de suppression, adressez votre demande à : <code className="text-[#142B45] font-semibold">dpo@fidcogest.be</code>.
            </p>
          </section>

          <section className="space-y-2.5 pt-4 border-t border-[#E8E6DF]">
            <h4 className="font-serif font-bold text-base text-[#142B45]">
              4. Avertissement relatif aux Outils de Simulation
            </h4>
            <p>
              Les résultats délivrés par les simulateurs en ligne (Arbitrage Rémunération Dirigeant, Versements Anticipés ISOC, Droits d'Auteur) sont communiqués à titre indicatif et pédagogique. Ils ne sauraient se substituer à une consultation formelle et une analyse individualisée réalisée par un membre agréé ITAA.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#F7F6F2] border-t border-[#E8E6DF] flex justify-end">
          <button
            onClick={onClose}
            className="cabinet-btn-primary text-xs"
          >
            Fermer les mentions
          </button>
        </div>
      </div>
    </div>
  );
};
