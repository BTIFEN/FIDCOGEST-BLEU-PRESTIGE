import React from 'react';
import { X, ShieldCheck, FileText, Lock } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl overflow-hidden text-slate-100 my-8">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Mentions Légales, Agréments ITAA & Protection des Données (RGPD)
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                Cabinet Fidcogest • Édition Révisée Octobre 2026
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 text-xs text-slate-300 max-h-[480px] overflow-y-auto leading-relaxed font-sans">
          <section className="space-y-2">
            <h4 className="font-bold text-sm text-amber-300 uppercase tracking-wider font-mono">
              1. Identification de l'Éditeur & Agrément Officiel
            </h4>
            <p>
              Le présent site internet est édité par la société <strong>Fidcogest SRL</strong>, cabinet d'expertise comptable et de conseil fiscal certifié sous le numéro d'agrément officiel <strong>ITAA 10.842.109</strong> (Institute for Tax Advisors and Accountants).
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 font-mono">
              <li><strong>Forme juridique :</strong> Société SRL (Société à Responsabilité Limitée)</li>
              <li><strong>Siège social :</strong> Avenue Louise 240, 1050 Bruxelles, Belgique</li>
              <li><strong>Numéro d'entreprise (BCE) :</strong> 0842.109.812</li>
              <li><strong>Numéro de TVA :</strong> BE 0842.109.812</li>
              <li><strong>Email de contact :</strong> contact@fidcogest.be | Téléphone : +32 2 555 01 88</li>
            </ul>
          </section>

          <section className="space-y-2 pt-3 border-t border-slate-800">
            <h4 className="font-bold text-sm text-amber-300 uppercase tracking-wider font-mono">
              2. Secret Professionnel & Réglementation ITAA
            </h4>
            <p>
              En qualité d'experts-comptables certifiés et de conseillers fiscaux certifiés par l'ITAA, l'ensemble des associés et collaborateurs de Fidcogest sont soumis au secret professionnel le plus strict (article 458 du Code pénal belge) et au respect du code de déontologie prescrit par l'Institut.
            </p>
          </section>

          <section className="space-y-2 pt-3 border-t border-slate-800">
            <h4 className="font-bold text-sm text-amber-300 uppercase tracking-wider font-mono">
              3. Protection des Données à Caractère Personnel (RGPD)
            </h4>
            <p>
              Conformément au Règlement Général sur la Protection des Données (UE 2016/679), les données collectées via nos formulaires (prise de rendez-vous, dépôt express de pièces comptables, simulateurs) sont destinées exclusivement à l'exécution de la mission comptable et fiscale du cabinet. Elles sont conservées sur des serveurs sécurisés situés au sein de l'Union Européenne avec un chiffrement SSL/TLS de classe bancaire.
            </p>
            <p>
              Vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles en envoyant une demande écrite à notre Délégué à la Protection des Données : <code>dpo@fidcogest.be</code>.
            </p>
          </section>

          <section className="space-y-2 pt-3 border-t border-slate-800">
            <h4 className="font-bold text-sm text-amber-300 uppercase tracking-wider font-mono">
              4. Avertissement concernant les Simulateurs Fiscaux
            </h4>
            <p>
              Les résultats issus de nos simulateurs en ligne (Rémunération Dirigeant, Versements Anticipés ISOC, Droits d'auteur) sont fournis à titre indicatif et pédagogique. Ils ne remplacent pas une consultation formelle et une analyse sur-mesure menée par un expert-comptable agréé ITAA.
            </p>
          </section>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl"
          >
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
};
