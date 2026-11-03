import React, { useState } from 'react';
import { PortalDocument, DocumentStatus, OcrExtractedData } from '../../types/portal';
import { usePortal } from '../../context/PortalContext';
import {
  X,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Download,
  ShieldCheck,
  History,
  Edit3,
  Save,
  Clock,
  Sparkles,
  Building,
  Calendar,
  DollarSign
} from 'lucide-react';

interface DocumentPreviewModalProps {
  document: PortalDocument | null;
  onClose: () => void;
  onRequestMissing?: (doc: PortalDocument) => void;
}

export const DocumentPreviewModal: React.FC<DocumentPreviewModalProps> = ({
  document,
  onClose,
  onRequestMissing
}) => {
  const { currentUser, validateDocument } = usePortal();
  const [zoom, setZoom] = useState<number>(100);
  const [rotation, setRotation] = useState<number>(0);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'preview' | 'ocr' | 'history'>('preview');

  // Editable OCR form fields
  const [editableOcr, setEditableOcr] = useState<OcrExtractedData | null>(null);
  const [notes, setNotes] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);

  React.useEffect(() => {
    if (document) {
      setEditableOcr({ ...document.ocrData });
      setNotes(document.notes || '');
      setIsEditing(false);
      setZoom(100);
      setRotation(0);
    }
  }, [document]);

  if (!document || !editableOcr) return null;

  const isManager = currentUser?.role === 'manager' || currentUser?.role === 'supervisor' || currentUser?.role === 'admin';

  const handleSaveValidation = async (status: DocumentStatus) => {
    setIsSaving(true);
    await validateDocument(document.id, status, editableOcr, notes);
    setIsSaving(false);
    setIsEditing(false);
    onClose();
  };

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'traite':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">Traité &amp; Imputé</span>;
      case 'accepte':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">Accepté</span>;
      case 'en_verification':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">En vérification</span>;
      case 'a_completer':
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-900 border border-rose-300">À compléter</span>;
      case 'recu':
      default:
        return <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">Reçu</span>;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl rounded-2xl bg-white border border-[#E8E6DF] shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200 modal-white-card flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-[#1D3B5C] bg-[#142B45] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-white/10 text-[#F3D085] border border-white/20 flex items-center justify-center font-bold shrink-0">
              <FileText className="w-5 h-5 text-[#F3D085]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base sm:text-lg text-white truncate">
                  {document.filename}
                </h3>
                {getStatusBadge(document.status)}
              </div>
              <p className="text-xs text-[#E2E8F0] flex items-center gap-1.5 font-sans mt-0.5 font-medium truncate">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F3D085]" />
                Document privé • Déposé le {document.createdAt} par {document.uploadedByUserName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-white/80 hover:text-white hover:bg-white/15 transition-colors cursor-pointer shrink-0 ml-3"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action & Tab Toolbar */}
        <div className="border-b border-[#E8E6DF] bg-[#FAF9F6] px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                activeTab === 'preview'
                  ? 'bg-[#142B45] text-white shadow-xs'
                  : 'bg-white border border-[#E8E6DF] text-[#4B5563] hover:text-[#142B45]'
              }`}
            >
              Aperçu du document
            </button>
            <button
              onClick={() => setActiveTab('ocr')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'ocr'
                  ? 'bg-[#142B45] text-white shadow-xs'
                  : 'bg-white border border-[#E8E6DF] text-[#4B5563] hover:text-[#142B45]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B79661]" />
              Extraction OCR &amp; Champs
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === 'history'
                  ? 'bg-[#142B45] text-white shadow-xs'
                  : 'bg-white border border-[#E8E6DF] text-[#4B5563] hover:text-[#142B45]'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Journal d’Audit ({document.history.length})
            </button>
          </div>

          {/* Zoom controls for preview */}
          {activeTab === 'preview' && (
            <div className="flex items-center gap-1 bg-white border border-[#E8E6DF] rounded-lg p-1">
              <button
                onClick={() => setZoom((z) => Math.max(50, z - 15))}
                className="p-1 hover:bg-[#F7F6F2] rounded text-[#4B5563]"
                title="Zoom arrière"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <span className="text-xs font-mono px-1.5 text-[#142B45] font-semibold">{zoom}%</span>
              <button
                onClick={() => setZoom((z) => Math.min(180, z + 15))}
                className="p-1 hover:bg-[#F7F6F2] rounded text-[#4B5563]"
                title="Zoom avant"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setRotation((r) => (r + 90) % 360)}
                className="p-1 hover:bg-[#F7F6F2] rounded text-[#4B5563] ml-1"
                title="Pivoter de 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Modal Main Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-[#F7F6F2]">
          {/* TAB 1: PREVIEW */}
          {activeTab === 'preview' && (
            <div className="space-y-4">
              {document.ocrData.isDuplicateDetected && (
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5 shadow-xs">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="font-bold">Alerte Détection Anti-Doublon :</strong>
                    <p className="mt-0.5 text-amber-800">{document.ocrData.duplicateReason}</p>
                  </div>
                </div>
              )}

              {/* Simulated Private High-Fidelity Document Viewer */}
              <div className="flex justify-center overflow-auto p-4 bg-[#EAE8E2] rounded-xl border border-[#D5D2C9] min-h-[380px]">
                <div
                  style={{
                    transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.2s ease-out'
                  }}
                  className="w-full max-w-xl bg-white shadow-xl rounded-lg p-6 sm:p-8 text-[#142B45] font-sans border border-[#E8E6DF] select-none"
                >
                  {/* Top document banner */}
                  <div className="border-b border-[#E8E6DF] pb-4 mb-4 flex justify-between items-start">
                    <div>
                      <div className="text-xl font-serif font-bold text-[#142B45]">
                        {editableOcr.vendorName}
                      </div>
                      <div className="text-xs text-[#6B7280] mt-0.5">
                        TVA BE 0412.879.620 • Facture Professionnelle
                      </div>
                      <div className="text-xs text-[#6B7280]">
                        Bruxelles / Ganshoren • Belgique
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs uppercase tracking-wider font-semibold text-[#B79661]">
                        Facture Originale
                      </div>
                      <div className="text-sm font-mono font-bold text-[#142B45] mt-1">
                        #{editableOcr.invoiceNumber}
                      </div>
                      <div className="text-xs text-[#6B7280]">
                        Date : {editableOcr.date}
                      </div>
                    </div>
                  </div>

                  {/* Client Info Box */}
                  <div className="bg-[#FAF9F6] border border-[#E8E6DF] rounded-lg p-3 text-xs mb-5">
                    <span className="text-[#6B7280] uppercase tracking-wider font-semibold">Destinataire :</span>
                    <div className="font-bold text-[#142B45] mt-0.5">Dossier Fidcogest SRL Client</div>
                    <div className="text-[#4B5563]">Régime TVA Belge • Conformité comptable ITAA</div>
                  </div>

                  {/* Line item breakdown */}
                  <div className="border border-[#E8E6DF] rounded-lg overflow-hidden text-xs mb-5">
                    <table className="w-full text-left">
                      <thead className="bg-[#FAF9F6] border-b border-[#E8E6DF] text-[#4B5563]">
                        <tr>
                          <th className="p-2.5">Description</th>
                          <th className="p-2.5 text-center">TVA</th>
                          <th className="p-2.5 text-right">Montant HT</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8E6DF]">
                        <tr>
                          <td className="p-2.5 font-medium text-[#142B45]">
                            {document.category === 'achats'
                              ? 'Prestation de services / Fourniture certifiée'
                              : document.category === 'frais'
                              ? 'Frais généraux & débours professionnels'
                              : 'Opération comptable enregistrée'}
                          </td>
                          <td className="p-2.5 text-center font-mono text-[#4B5563]">
                            {editableOcr.vatRatePercent}%
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold text-[#142B45]">
                            {editableOcr.amountHtEur.toFixed(2)} €
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Financial Totals */}
                  <div className="ml-auto w-64 space-y-2 text-xs border-t border-[#E8E6DF] pt-3">
                    <div className="flex justify-between text-[#4B5563]">
                      <span>Total Hors Taxe (HT) :</span>
                      <span className="font-mono font-semibold text-[#142B45]">
                        {editableOcr.amountHtEur.toFixed(2)} €
                      </span>
                    </div>
                    <div className="flex justify-between text-[#4B5563]">
                      <span>TVA ({editableOcr.vatRatePercent}%) :</span>
                      <span className="font-mono font-semibold text-[#142B45]">
                        {editableOcr.vatAmountEur.toFixed(2)} €
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-[#142B45] pt-2 text-sm font-bold text-[#142B45]">
                      <span>Total TTC à Payer :</span>
                      <span className="font-mono text-base text-[#142B45]">
                        {editableOcr.totalTtcEur.toFixed(2)} €
                      </span>
                    </div>
                  </div>

                  {/* Document Footer stamp */}
                  <div className="mt-8 pt-4 border-t border-dashed border-[#D5D2C9] text-center text-xs text-[#6B7280] space-y-0.5">
                    <div className="font-mono text-xs">
                      🔒 SHA-256 Checksum : a89c4e2...bf91 | Chiffrement TLS 256-bit
                    </div>
                    <div>Coffre-fort fiduciaire confidentiel FIDCOGEST SRL</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: OCR PROPOSITIONS & REVISION */}
          {activeTab === 'ocr' && (
            <div className="space-y-4 max-w-3xl mx-auto">
              {/* Mandatory Human Validation Disclaimer */}
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-[#B79661] shrink-0 mt-0.5" />
                <div>
                  <strong className="font-bold">Extraction OCR Intelligente :</strong>
                  <p className="mt-0.5 text-blue-800">
                    Les valeurs ci-dessous sont des <strong>propositions automatisées</strong>. Conformément aux règles déontologiques de l’ITAA, une validation humaine par un collaborateur ou expert-comptable est indispensable avant imputation fiscale définitive.
                  </p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="bg-white border border-[#E8E6DF] rounded-xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E8E6DF] pb-3">
                  <h4 className="font-serif font-bold text-sm text-[#142B45] flex items-center gap-2">
                    <Building className="w-4 h-4 text-[#B79661]" />
                    Champs Métiers Extraits
                  </h4>
                  {isManager && (
                    <button
                      onClick={() => setIsEditing(!isEditing)}
                      className="px-3 py-1 rounded-lg border border-[#E8E6DF] text-xs font-semibold text-[#142B45] hover:bg-[#FAF9F6] flex items-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#B79661]" />
                      {isEditing ? 'Verrouiller la saisie' : 'Corriger manuellement'}
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#142B45] mb-1">Fournisseur :</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={editableOcr.vendorName}
                      onChange={(e) => setEditableOcr({ ...editableOcr, vendorName: e.target.value })}
                      className="cabinet-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#142B45] mb-1">Numéro de facture :</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={editableOcr.invoiceNumber}
                      onChange={(e) => setEditableOcr({ ...editableOcr, invoiceNumber: e.target.value })}
                      className="cabinet-input w-full font-mono"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#142B45] mb-1">Date d’émission :</label>
                    <input
                      type="date"
                      disabled={!isEditing}
                      value={editableOcr.date}
                      onChange={(e) => setEditableOcr({ ...editableOcr, date: e.target.value })}
                      className="cabinet-input w-full"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-[#142B45] mb-1">Taux de TVA (%) :</label>
                    <select
                      disabled={!isEditing}
                      value={editableOcr.vatRatePercent}
                      onChange={(e) => {
                        const rate = Number(e.target.value);
                        const vat = Number(((editableOcr.amountHtEur * rate) / 100).toFixed(2));
                        const ttc = Number((editableOcr.amountHtEur + vat).toFixed(2));
                        setEditableOcr({ ...editableOcr, vatRatePercent: rate, vatAmountEur: vat, totalTtcEur: ttc });
                      }}
                      className="cabinet-input w-full"
                    >
                      <option value={21}>21% (Taux normal)</option>
                      <option value={12}>12% (Restauration / Énergie)</option>
                      <option value={6}>6% (Biens de première nécessité / Travaux)</option>
                      <option value={0}>0% (Franchise / Intracommunautaire)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#142B45] mb-1">Montant Hors Taxe (HT) :</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        disabled={!isEditing}
                        value={editableOcr.amountHtEur}
                        onChange={(e) => {
                          const ht = Number(e.target.value);
                          const vat = Number(((ht * editableOcr.vatRatePercent) / 100).toFixed(2));
                          const ttc = Number((ht + vat).toFixed(2));
                          setEditableOcr({ ...editableOcr, amountHtEur: ht, vatAmountEur: vat, totalTtcEur: ttc });
                        }}
                        className="cabinet-input w-full font-mono pr-8"
                      />
                      <span className="absolute right-3 top-2.5 text-[#6B7280]">€</span>
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-[#142B45] mb-1">Total TTC (€) :</label>
                    <div className="relative">
                      <input
                        type="number"
                        step="0.01"
                        disabled={!isEditing}
                        value={editableOcr.totalTtcEur}
                        onChange={(e) => {
                          const ttc = Number(e.target.value);
                          const ht = Number((ttc / (1 + editableOcr.vatRatePercent / 100)).toFixed(2));
                          const vat = Number((ttc - ht).toFixed(2));
                          setEditableOcr({ ...editableOcr, totalTtcEur: ttc, amountHtEur: ht, vatAmountEur: vat });
                        }}
                        className="cabinet-input w-full font-mono font-bold pr-8 text-[#142B45]"
                      />
                      <span className="absolute right-3 top-2.5 text-[#142B45] font-bold">€</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-[#142B45] mb-1 text-xs">
                    Notes et observations du gestionnaire :
                  </label>
                  <textarea
                    rows={2}
                    disabled={!isManager}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="ex. Imputation au compte 610000. Pièce justificative conforme."
                    className="cabinet-input w-full text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-3 max-w-3xl mx-auto">
              <div className="bg-white border border-[#E8E6DF] rounded-xl p-5">
                <h4 className="font-serif font-bold text-sm text-[#142B45] mb-4 flex items-center gap-2">
                  <History className="w-4 h-4 text-[#B79661]" />
                  Piste d’Audit Fiable &amp; Horodatage Cryptographique
                </h4>

                <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-[#E8E6DF]">
                  {document.history.map((h, idx) => (
                    <div key={h.id || idx} className="relative flex items-start gap-3 text-xs pl-8">
                      <div className="absolute left-2 top-1 w-3 h-3 rounded-full bg-[#142B45] border-2 border-white shadow-xs" />
                      <div className="flex-1 bg-[#FAF9F6] border border-[#E8E6DF] rounded-lg p-3">
                        <div className="flex items-center justify-between font-semibold text-[#142B45]">
                          <span>{h.action}</span>
                          <span className="text-[#6B7280] font-mono text-xs">{h.timestamp}</span>
                        </div>
                        <div className="text-xs text-[#4B5563] mt-1">
                          Auteur : <strong className="text-[#142B45]">{h.authorName}</strong> ({h.authorRole})
                        </div>
                        {h.details && (
                          <div className="text-xs text-[#374151] mt-1 italic bg-white p-2 rounded border border-[#E8E6DF]">
                            {h.details}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 sm:p-5 border-t border-[#E8E6DF] bg-white flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-[#6B7280]">
            Fichier stocké dans l’espace privé du cabinet • ID: <span className="font-mono text-[#142B45]">{document.id}</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* If Manager, show validation buttons */}
            {isManager && (
              <>
                <button
                  onClick={() => onRequestMissing && onRequestMissing(document)}
                  className="px-3.5 py-2 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                  Demander complément
                </button>

                <button
                  onClick={() => handleSaveValidation('accepte')}
                  disabled={isSaving}
                  className="px-3.5 py-2 rounded-xl border border-green-300 bg-green-50 hover:bg-green-100 text-green-800 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                  Accepter
                </button>

                <button
                  onClick={() => handleSaveValidation('traite')}
                  disabled={isSaving}
                  className="cabinet-btn-primary text-xs py-2 px-4 shadow-sm"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#F3D085]" />
                  Valider &amp; Imputer
                </button>
              </>
            )}

            <button
              onClick={onClose}
              className="cabinet-btn-secondary text-xs py-2 px-4"
            >
              Fermer
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
