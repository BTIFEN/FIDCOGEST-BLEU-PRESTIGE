import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { PortalDocument } from '../../types/portal';
import { AlertCircle, X, Send, ShieldAlert } from 'lucide-react';

interface MissingRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetDocument?: PortalDocument | null;
}

export const MissingRequestModal: React.FC<MissingRequestModalProps> = ({
  isOpen,
  onClose,
  targetDocument
}) => {
  const { companies, createMissingRequest, activeCompany } = usePortal();

  const [companyId, setCompanyId] = useState<string>(
    targetDocument?.companyId || activeCompany?.id || companies[0]?.id || 'cie-1'
  );
  const [title, setTitle] = useState<string>(
    targetDocument
      ? `Pièce justificative manquante pour ${targetDocument.filename}`
      : ''
  );
  const [description, setDescription] = useState<string>(
    targetDocument?.missingInfoReason ||
      'Merci de nous transmettre le justificatif original complet avec ventilation TVA conforme.'
  );
  const [period, setPeriod] = useState<string>('Exercice 2026');
  const [urgency, setUrgency] = useState<'normale' | 'urgente'>('normale');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  React.useEffect(() => {
    if (targetDocument) {
      setCompanyId(targetDocument.companyId);
      setTitle(`Complément requis : ${targetDocument.ocrData.vendorName} (${targetDocument.ocrData.invoiceNumber})`);
      setDescription(targetDocument.missingInfoReason || 'Il manque le ticket de caisse détaillé avec la ventilation TVA.');
      setUrgency('urgente');
    }
  }, [targetDocument]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    setIsSubmitting(true);
    await createMissingRequest({
      companyId,
      title: title.trim(),
      description: description.trim(),
      period: period.trim(),
      urgency
    });
    setIsSubmitting(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#E8E6DF] shadow-2xl p-6 sm:p-7 modal-white-card space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8E6DF] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold">
              <AlertCircle className="w-5 h-5 text-rose-700" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg text-[#142B45]">
                Demande de Pièce Complémentaire
              </h4>
              <p className="text-xs text-[#4B5563]">
                Cette demande s'affichera immédiatement dans l'Espace Client.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#142B45] hover:bg-[#FAF9F6]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-[#142B45] mb-1">
              Entreprise concernée :
            </label>
            <select
              value={companyId}
              onChange={(e) => setCompanyId(e.target.value)}
              className="cabinet-input w-full"
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.legalName} ({c.vatNumber})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold text-[#142B45] mb-1">
              Intitulé de la demande :
            </label>
            <input
              type="text"
              required
              placeholder="ex. Note de restaurant détaillée avec TVA 12%/21%"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="cabinet-input w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-[#142B45] mb-1">
                Période fiscale :
              </label>
              <input
                type="text"
                placeholder="ex. Février 2026"
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="cabinet-input w-full"
              />
            </div>
            <div>
              <label className="block font-semibold text-[#142B45] mb-1">
                Degré d'urgence :
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as any)}
                className="cabinet-input w-full"
              >
                <option value="normale">Normale (Clôture trimestrielle)</option>
                <option value="urgente">Urgente (Échéance TVA proche)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-[#142B45] mb-1">
              Instructions détaillées pour le dirigeant :
            </label>
            <textarea
              rows={3}
              required
              placeholder="Précisez les mentions requises (nom des invités, ventilation TVA, quittance signée...)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="cabinet-input w-full text-xs"
            />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E8E6DF]">
            <button
              type="button"
              onClick={onClose}
              className="cabinet-btn-secondary text-xs py-2 px-4"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="cabinet-btn-primary text-xs py-2 px-5 font-bold shadow-sm"
            >
              {isSubmitting ? 'Transmission...' : 'Émettre la demande au client →'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
