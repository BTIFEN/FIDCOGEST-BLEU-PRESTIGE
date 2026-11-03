import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { DocumentCategory, PortalDocument } from '../../types/portal';
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertCircle,
  Clock,
  Search,
  MessageSquare,
  Building,
  Send,
  Eye,
  Filter,
  ShieldCheck,
  Check,
  Paperclip,
  Smartphone,
  Info
} from 'lucide-react';

interface ClientPortalViewProps {
  onPreviewDocument: (doc: PortalDocument) => void;
}

export const ClientPortalView: React.FC<ClientPortalViewProps> = ({ onPreviewDocument }) => {
  const {
    currentUser,
    companies,
    activeCompany,
    setActiveCompanyId,
    filteredDocuments,
    missingRequests,
    messages,
    sendMessage,
    uploadDocument,
    resolveMissingRequest,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery
  } = usePortal();

  // Active section inside client portal: 'documents' | 'missing' | 'messages'
  const [activeSection, setActiveSection] = useState<'documents' | 'missing' | 'messages'>('documents');

  // Multi-upload modal / state
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [selectedUploadCategory, setSelectedUploadCategory] = useState<DocumentCategory>('achats');
  const [uploadedFilesList, setUploadedFilesList] = useState<Array<{ name: string; sizeKb: number; type: 'pdf' | 'png' | 'jpg' }>>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadSuccessMessage, setUploadSuccessMessage] = useState<string | null>(null);

  // Missing request quick upload target
  const [resolvingRequestId, setResolvingRequestId] = useState<string | null>(null);

  // New message text
  const [newMessageText, setNewMessageText] = useState<string>('');
  const [sendingMsg, setSendingMsg] = useState<boolean>(false);

  // Guard if not logged in
  if (!currentUser) return null;

  // Client's authorized companies
  const authorizedCompanies = companies.filter((c) =>
    currentUser.assignedCompanyIds.includes(c.id)
  );

  const pendingMissingCount = missingRequests.filter(
    (r) => r.companyId === activeCompany?.id && r.status === 'en_attente'
  ).length;

  const handleSimulateFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newItems = files.map((f) => {
      const ext = f.name.split('.').pop()?.toLowerCase();
      const type: 'pdf' | 'png' | 'jpg' = ext === 'png' ? 'png' : ext === 'jpg' || ext === 'jpeg' ? 'jpg' : 'pdf';
      return {
        name: f.name,
        sizeKb: Math.round(f.size / 1024) || 250,
        type
      };
    });
    setUploadedFilesList((prev) => [...prev, ...newItems]);
  };

  const handleConfirmUpload = async () => {
    if (!activeCompany || uploadedFilesList.length === 0) return;
    setIsUploading(true);

    for (const f of uploadedFilesList) {
      const doc = await uploadDocument({
        companyId: activeCompany.id,
        category: selectedUploadCategory,
        filename: f.name,
        fileSizeKb: f.sizeKb,
        fileType: f.type
      });

      // If resolving a specific missing request
      if (resolvingRequestId) {
        await resolveMissingRequest(resolvingRequestId, doc.id);
      }
    }

    setIsUploading(false);
    setUploadedFilesList([]);
    setShowUploadModal(false);
    setResolvingRequestId(null);
    setUploadSuccessMessage(
      `${uploadedFilesList.length} pièce(s) transmise(s) avec succès au cabinet Fidcogest.`
    );
    setTimeout(() => setUploadSuccessMessage(null), 5000);
  };

  const handleSendClientMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || sendingMsg) return;
    setSendingMsg(true);
    await sendMessage(newMessageText.trim());
    setNewMessageText('');
    setSendingMsg(false);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'traite':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <Check className="w-3 h-3 text-emerald-700" /> Traité
          </span>
        );
      case 'accepte':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">
            <CheckCircle2 className="w-3 h-3 text-green-700" /> Accepté
          </span>
        );
      case 'en_verification':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
            <Clock className="w-3 h-3 text-amber-700" /> En vérification
          </span>
        );
      case 'a_completer':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-900 border border-rose-300">
            <AlertCircle className="w-3 h-3 text-rose-700" /> À compléter
          </span>
        );
      case 'recu':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
            Reçu
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Client Header Welcome & Company Switcher */}
      <div className="bg-white rounded-2xl border border-[#E8E6DF] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#142B45]">
              Bonjour, {currentUser.fullName}
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#FAF9F6] border border-[#E8E6DF] text-[#142B45]">
              Client Certifié Fidcogest
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#4B5563]">
            Transmettez vos factures en un clic et suivez l'état d'avancement de votre dossier comptable.
          </p>
        </div>

        {/* Company Selector (Multi-dossiers client) */}
        {authorizedCompanies.length > 1 && (
          <div className="flex items-center gap-3 bg-[#FAF9F6] border border-[#E8E6DF] rounded-xl p-2.5">
            <Building className="w-4 h-4 text-[#B79661] shrink-0" />
            <div className="text-xs">
              <span className="text-[#6B7280] block font-medium">Dossier sélectionné :</span>
              <select
                value={activeCompany?.id}
                onChange={(e) => setActiveCompanyId(e.target.value)}
                className="bg-transparent font-bold text-[#142B45] text-xs sm:text-sm cursor-pointer outline-none"
              >
                {authorizedCompanies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.legalName} ({c.vatNumber})
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Prominent Action Banner (GRAND BOUTON OBLIGATOIRE DU BRIEF) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#142B45] via-[#163354] to-[#10243C] p-7 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#F3D085] text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5 text-[#F3D085]" />
            Dépôt Sécurisé TLS 256-bit • Secret Professionnel ITAA
          </div>
          <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
            Transmettez vos pièces comptables
          </h3>
          <p className="text-xs sm:text-sm text-[#E2E8F0] leading-relaxed">
            Factures d’achats, ventes, notes de frais ou relevés bancaires. Glissez vos fichiers ou prenez une photo depuis votre smartphone.
          </p>
        </div>

        {/* GRAND BOUTON DÉPOSER MES DOCUMENTS */}
        <div className="z-10 shrink-0">
          <button
            onClick={() => {
              setResolvingRequestId(null);
              setShowUploadModal(true);
            }}
            className="cabinet-btn-gold text-sm sm:text-base px-6 py-4 rounded-xl shadow-lg hover:shadow-xl font-bold flex items-center gap-3 w-full sm:w-auto justify-center cursor-pointer transition-all transform hover:-translate-y-0.5"
          >
            <UploadCloud className="w-5 h-5 text-[#142B45]" />
            <span className="text-[#142B45]">Déposer mes documents</span>
          </button>
        </div>
      </div>

      {/* Upload Success Alert */}
      {uploadSuccessMessage && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-300 text-green-900 text-xs sm:text-sm flex items-center gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
          <span>{uploadSuccessMessage}</span>
        </div>
      )}

      {/* Pending Missing Pieces Notification Banner */}
      {pendingMissingCount > 0 && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-900 flex items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-rose-100 flex items-center justify-center text-rose-700 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-xs sm:text-sm">
                {pendingMissingCount} demande(s) de pièces complémentaires en attente
              </div>
              <p className="text-xs text-rose-700 mt-0.5">
                Votre gestionnaire a besoin de justificatifs pour finaliser votre déclaration fiscale ou TVA.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveSection('missing')}
            className="px-4 py-2 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs shrink-0 cursor-pointer transition-colors shadow-xs"
          >
            Voir les demandes →
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-[#E8E6DF] bg-white rounded-t-xl px-4 pt-2 text-xs font-semibold gap-3">
        <button
          onClick={() => setActiveSection('documents')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeSection === 'documents'
              ? 'border-[#142B45] text-[#142B45] font-bold'
              : 'border-transparent text-[#6B7280] hover:text-[#142B45]'
          }`}
        >
          <FileText className="w-4 h-4 text-[#B79661]" />
          Documents Déposés ({filteredDocuments.length})
        </button>

        <button
          onClick={() => setActiveSection('missing')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer relative ${
            activeSection === 'missing'
              ? 'border-[#142B45] text-[#142B45] font-bold'
              : 'border-transparent text-[#6B7280] hover:text-[#142B45]'
          }`}
        >
          <AlertCircle className="w-4 h-4 text-rose-600" />
          Pièces Manquantes
          {pendingMissingCount > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-xs bg-rose-600 text-white font-bold">
              {pendingMissingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSection('messages')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeSection === 'messages'
              ? 'border-[#142B45] text-[#142B45] font-bold'
              : 'border-transparent text-[#6B7280] hover:text-[#142B45]'
          }`}
        >
          <MessageSquare className="w-4 h-4 text-[#B79661]" />
          Échanges avec le gestionnaire ({messages.length})
        </button>
      </div>

      {/* SECTION 1: DOCUMENTS TABLE & FILTERS */}
      {activeSection === 'documents' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-[#E8E6DF] p-5 sm:p-6 shadow-sm space-y-5">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 text-xs">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[#6B7280] font-medium mr-1 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Classement :
              </span>
              {[
                { id: 'all', label: 'Tous' },
                { id: 'achats', label: 'Achats' },
                { id: 'ventes', label: 'Ventes' },
                { id: 'banque', label: 'Banque' },
                { id: 'frais', label: 'Frais' },
                { id: 'divers', label: 'Divers' }
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedCategory(c.id as any)}
                  className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                    selectedCategory === c.id
                      ? 'bg-[#142B45] text-white shadow-xs'
                      : 'bg-[#FAF9F6] border border-[#E8E6DF] text-[#4B5563] hover:text-[#142B45]'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Status & Search */}
            <div className="flex items-center gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="bg-[#FAF9F6] border border-[#E8E6DF] rounded-lg px-2.5 py-1.5 text-xs text-[#142B45] font-medium outline-none"
              >
                <option value="all">Tous les statuts</option>
                <option value="recu">Reçu</option>
                <option value="en_verification">En vérification</option>
                <option value="accepte">Accepté</option>
                <option value="a_completer">À compléter</option>
                <option value="traite">Traité</option>
              </select>

              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#FAF9F6] border border-[#E8E6DF] rounded-lg pl-8 pr-3 py-1.5 text-xs text-[#142B45] outline-none w-36 sm:w-48"
                />
              </div>
            </div>
          </div>

          {/* Documents Table */}
          {filteredDocuments.length === 0 ? (
            <div className="text-center py-12 bg-[#FAF9F6] rounded-xl border border-dashed border-[#E8E6DF] space-y-3">
              <FileText className="w-10 h-10 text-[#B79661] mx-auto opacity-70" />
              <div className="font-serif font-bold text-base text-[#142B45]">
                Aucun document pour les critères sélectionnés
              </div>
              <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
                Déposez vos premières factures en cliquant sur le bouton « Déposer mes documents ».
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-[#E8E6DF]">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F6] border-b border-[#E8E6DF] text-[#4B5563] font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="p-3.5">Fichier &amp; Catégorie</th>
                    <th className="p-3.5">Fournisseur / Tiers</th>
                    <th className="p-3.5">Date</th>
                    <th className="p-3.5 text-right">Total TTC</th>
                    <th className="p-3.5 text-center">Statut</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E6DF] bg-white">
                  {filteredDocuments.map((doc) => (
                    <tr key={doc.id} className="hover:bg-[#FAF9F6] transition-colors">
                      <td className="p-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#FAF9F6] border border-[#E8E6DF] flex items-center justify-center text-[#B79661] shrink-0 font-bold">
                            {doc.fileType.toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-[#142B45] hover:text-[#B79661] cursor-pointer" onClick={() => onPreviewDocument(doc)}>
                              {doc.filename}
                            </div>
                            <div className="text-xs text-[#6B7280] capitalize">
                              Classement : {doc.category} • {doc.fileSizeKb} Ko
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 font-medium text-[#142B45]">
                        <div>{doc.ocrData.vendorName}</div>
                        <div className="text-xs text-[#6B7280] font-mono">#{doc.ocrData.invoiceNumber}</div>
                      </td>

                      <td className="p-3.5 text-[#4B5563] font-mono">
                        {doc.ocrData.date}
                      </td>

                      <td className="p-3.5 text-right font-mono font-bold text-[#142B45]">
                        {doc.ocrData.totalTtcEur.toFixed(2)} €
                      </td>

                      <td className="p-3.5 text-center">
                        {getStatusBadge(doc.status)}
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => onPreviewDocument(doc)}
                          className="px-3 py-1.5 rounded-lg border border-[#E8E6DF] hover:border-[#142B45] text-[#142B45] font-semibold text-xs flex items-center gap-1.5 ml-auto cursor-pointer transition-all hover:bg-white"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#B79661]" />
                          Consulter
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* SECTION 2: MISSING PIECES REQUESTS */}
      {activeSection === 'missing' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-[#E8E6DF] p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E6DF] pb-3">
            <div>
              <h4 className="font-serif font-bold text-base text-[#142B45]">
                Demandes de Pièces Émises par votre Gestionnaire
              </h4>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Veuillez fournir les justificatifs réclamés pour garantir la conformité de votre dossier comptable.
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-[#142B45]">
              {missingRequests.filter((r) => r.companyId === activeCompany?.id).length} demande(s)
            </span>
          </div>

          <div className="space-y-3">
            {missingRequests
              .filter((r) => r.companyId === activeCompany?.id)
              .map((req) => (
                <div
                  key={req.id}
                  className={`p-4 rounded-xl border transition-all ${
                    req.status === 'en_attente'
                      ? 'bg-rose-50/50 border-rose-300'
                      : 'bg-[#FAF9F6] border-[#E8E6DF] opacity-75'
                  } flex flex-col sm:flex-row sm:items-center justify-between gap-4`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-[#142B45]">{req.title}</span>
                      {req.urgency === 'urgente' && (
                        <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white">
                          Urgent
                        </span>
                      )}
                      <span className="text-xs text-[#6B7280]">Période : {req.period}</span>
                    </div>
                    <p className="text-xs text-[#4B5563]">{req.description}</p>
                    <div className="text-xs text-[#6B7280]">
                      Demandé par <strong className="text-[#142B45]">{req.requestedByUserName}</strong> le {req.createdAt}
                    </div>
                  </div>

                  <div className="shrink-0">
                    {req.status === 'en_attente' ? (
                      <button
                        onClick={() => {
                          setResolvingRequestId(req.id);
                          setShowUploadModal(true);
                        }}
                        className="cabinet-btn-primary text-xs py-2 px-4 shadow-sm"
                      >
                        <UploadCloud className="w-4 h-4 text-[#F3D085]" />
                        Déposer cette pièce →
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-100 text-green-800 text-xs font-semibold">
                        <Check className="w-4 h-4 text-green-700" /> Transmis &amp; Résolu
                      </span>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* SECTION 3: CONFIDENTIAL MESSAGING */}
      {activeSection === 'messages' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-[#E8E6DF] p-5 sm:p-6 shadow-sm space-y-5">
          <div className="border-b border-[#E8E6DF] pb-3 flex items-center justify-between">
            <div>
              <h4 className="font-serif font-bold text-base text-[#142B45]">
                Échanges Confidentiels avec votre Gestionnaire
              </h4>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Fil sécurisé lié à l’entreprise <strong className="text-[#142B45]">{activeCompany?.legalName}</strong>.
              </p>
            </div>
            <div className="text-xs font-semibold text-[#B79661] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> Secret Professionnel ITAA
            </div>
          </div>

          {/* Messages Stream */}
          <div className="space-y-3 max-h-[360px] overflow-y-auto p-4 bg-[#FAF9F6] rounded-xl border border-[#E8E6DF]">
            {messages.filter((m) => m.companyId === activeCompany?.id).length === 0 ? (
              <div className="text-center py-8 text-xs text-[#6B7280]">
                Aucun message dans ce fil. Posez une question à votre gestionnaire ci-dessous.
              </div>
            ) : (
              messages
                .filter((m) => m.companyId === activeCompany?.id)
                .map((msg) => {
                  const isMe = msg.authorId === currentUser.id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="text-xs text-[#6B7280] mb-1 font-medium">
                        {msg.authorName} • {msg.timestamp}
                      </div>
                      <div
                        className={`max-w-lg p-3.5 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-[#142B45] text-white rounded-tr-none shadow-xs'
                            : 'bg-white text-[#142B45] border border-[#E8E6DF] rounded-tl-none shadow-xs'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })
            )}
          </div>

          {/* Message Input Box */}
          <form onSubmit={handleSendClientMessage} className="flex gap-2">
            <input
              type="text"
              value={newMessageText}
              onChange={(e) => setNewMessageText(e.target.value)}
              placeholder="Écrivez un message sécurisé à votre gestionnaire..."
              className="cabinet-input flex-1 text-xs"
            />
            <button
              type="submit"
              disabled={sendingMsg || !newMessageText.trim()}
              className="cabinet-btn-primary text-xs py-2.5 px-4 shadow-sm"
            >
              <Send className="w-4 h-4 text-[#F3D085]" />
              Envoyer
            </button>
          </form>
        </div>
      )}

      {/* MULTI-UPLOAD MODAL */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white border border-[#E8E6DF] shadow-2xl p-6 sm:p-8 modal-white-card space-y-6">
            <div className="flex items-center justify-between border-b border-[#E8E6DF] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF] text-[#B79661] flex items-center justify-center font-bold">
                  <UploadCloud className="w-5 h-5 text-[#B79661]" />
                </div>
                <div>
                  <h4 className="font-serif font-bold text-lg text-[#142B45]">
                    Déposer des Factures &amp; Justificatifs
                  </h4>
                  <p className="text-xs text-[#4B5563]">
                    Dossier : <strong className="text-[#142B45]">{activeCompany?.legalName}</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowUploadModal(false);
                  setResolvingRequestId(null);
                }}
                className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#142B45] hover:bg-[#FAF9F6]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Classification Selector */}
            <div>
              <label className="block text-xs font-semibold text-[#142B45] uppercase tracking-wider mb-2">
                1. Classement Comptable Recommandé :
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                {(['achats', 'ventes', 'banque', 'frais', 'divers'] as DocumentCategory[]).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedUploadCategory(cat)}
                    className={`py-2 px-3 rounded-lg border font-semibold capitalize transition-all cursor-pointer text-center ${
                      selectedUploadCategory === cat
                        ? 'bg-[#142B45] text-white border-[#142B45] shadow-xs'
                        : 'bg-white border-[#E8E6DF] text-[#4B5563] hover:border-[#B79661]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Drag & Drop Zone */}
            <div>
              <label className="block text-xs font-semibold text-[#142B45] uppercase tracking-wider mb-2">
                2. Sélection des Fichiers (PDF, JPG, PNG) :
              </label>
              <div className="border-2 border-dashed border-[#B79661]/50 hover:border-[#142B45] bg-[#FAF9F6] hover:bg-white rounded-2xl p-7 text-center transition-all relative cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept=".pdf,.png,.jpg,.jpeg"
                  onChange={handleSimulateFilesSelected}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="w-12 h-12 rounded-full bg-white border border-[#E8E6DF] text-[#B79661] flex items-center justify-center mx-auto mb-3 shadow-xs">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <div className="font-serif font-bold text-sm text-[#142B45]">
                  Glissez vos fichiers ici ou cliquez pour parcourir
                </div>
                <p className="text-xs text-[#6B7280] mt-1">
                  Compatible ordinateurs &amp; smartphones (appareil photo pris en charge)
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white border border-[#E8E6DF] text-xs text-[#142B45] font-medium shadow-xs">
                  <Smartphone className="w-3.5 h-3.5 text-[#B79661]" /> Dépôt multiple illimité
                </div>
              </div>
            </div>

            {/* Selected files preview */}
            {uploadedFilesList.length > 0 && (
              <div className="space-y-2">
                <div className="text-xs font-semibold text-[#142B45] flex justify-between">
                  <span>Fichiers prêts au dépôt ({uploadedFilesList.length}) :</span>
                  <button
                    onClick={() => setUploadedFilesList([])}
                    className="text-xs text-rose-600 hover:underline"
                  >
                    Tout retirer
                  </button>
                </div>
                <div className="max-h-40 overflow-y-auto space-y-1.5">
                  {uploadedFilesList.map((file, i) => (
                    <div
                      key={i}
                      className="p-2.5 rounded-lg bg-[#FAF9F6] border border-[#E8E6DF] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-2 font-medium text-[#142B45] truncate">
                        <FileText className="w-4 h-4 text-[#B79661] shrink-0" />
                        <span className="truncate">{file.name}</span>
                      </div>
                      <span className="text-[#6B7280] font-mono shrink-0">{file.sizeKb} Ko</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3 border-t border-[#E8E6DF]">
              <button
                type="button"
                onClick={() => {
                  setShowUploadModal(false);
                  setResolvingRequestId(null);
                }}
                className="cabinet-btn-secondary text-xs py-2 px-4"
              >
                Annuler
              </button>
              <button
                type="button"
                disabled={uploadedFilesList.length === 0 || isUploading}
                onClick={handleConfirmUpload}
                className="cabinet-btn-primary text-xs py-2.5 px-6 font-bold shadow-sm"
              >
                {isUploading ? (
                  <span>Transmission sécurisée...</span>
                ) : (
                  <span>Confirmer le dépôt ({uploadedFilesList.length}) →</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper for X icon
function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
