import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { PortalDocument, DocumentStatus, DocumentCategory, CompanyDossier } from '../../types/portal';
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Search,
  Filter,
  Eye,
  Building,
  Users,
  Download,
  PlusCircle,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  Send,
  X,
  UserCheck,
  Briefcase
} from 'lucide-react';

interface ManagerCockpitViewProps {
  onPreviewDocument: (doc: PortalDocument) => void;
  onRequestMissingDocument: (doc?: PortalDocument) => void;
}

export const ManagerCockpitView: React.FC<ManagerCockpitViewProps> = ({
  onPreviewDocument,
  onRequestMissingDocument
}) => {
  const {
    currentUser,
    companies,
    activeCompany,
    setActiveCompanyId,
    documents,
    missingRequests,
    users,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    searchQuery,
    setSearchQuery,
    validateDocument,
    exportAccountingData,
    assignCompanyManager,
    resolveMissingRequest
  } = usePortal();

  // Active view tab: 'inbox' | 'portfolio' | 'duplicates' | 'missing'
  const [activeTab, setActiveTab] = useState<'inbox' | 'portfolio' | 'duplicates' | 'missing'>('inbox');

  // Multi-company filter in manager view
  const [selectedCompanyFilter, setSelectedCompanyFilter] = useState<string>('all');
  const [selectedManagerFilter, setSelectedManagerFilter] = useState<string>('all');

  // Company detail drawer
  const [viewingCompany, setViewingCompany] = useState<CompanyDossier | null>(null);

  // Guard if not logged in
  if (!currentUser) return null;

  // Filter companies accessible to manager
  const accessibleCompanies = currentUser.role === 'supervisor' || currentUser.role === 'admin'
    ? companies
    : companies.filter((c) => currentUser.assignedCompanyIds.includes(c.id));

  // Compute Cockpit KPIs
  const totalDocs = documents.length;
  const pendingReviewDocs = documents.filter((d) => d.status === 'recu' || d.status === 'en_verification').length;
  const duplicateAlerts = documents.filter((d) => d.ocrData.isDuplicateDetected).length;
  const pendingMissingRequests = missingRequests.filter((r) => r.status === 'en_attente').length;
  const validatedThisMonth = documents.filter((d) => d.status === 'accepte' || d.status === 'traite').length;

  // Filtered documents for manager
  const managerFilteredDocs = documents.filter((doc) => {
    // Company authorization check
    if (currentUser.role === 'manager' && !currentUser.assignedCompanyIds.includes(doc.companyId)) {
      return false;
    }
    if (selectedCompanyFilter !== 'all' && doc.companyId !== selectedCompanyFilter) return false;
    if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && doc.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchFile = doc.filename.toLowerCase().includes(q);
      const matchVendor = doc.ocrData.vendorName.toLowerCase().includes(q);
      const matchInv = doc.ocrData.invoiceNumber.toLowerCase().includes(q);
      if (!matchFile && !matchVendor && !matchInv) return false;
    }
    return true;
  });

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'traite':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">Traité &amp; Imputé</span>;
      case 'accepte':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">Accepté</span>;
      case 'en_verification':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">En vérification</span>;
      case 'a_completer':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-900 border border-rose-300">À compléter</span>;
      case 'recu':
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">Reçu</span>;
    }
  };

  const getCompanyName = (id: string) => {
    return companies.find((c) => c.id === id)?.legalName || id;
  };

  return (
    <div className="space-y-6">
      {/* Cockpit Header with Role & Exports */}
      <div className="bg-white rounded-2xl border border-[#E8E6DF] p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#142B45]">
              Cockpit Gestionnaire &amp; Superviseur ITAA
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#142B45] text-white">
              {currentUser.fullName} ({currentUser.role.toUpperCase()})
            </span>
          </div>
          <p className="text-xs sm:text-sm text-[#4B5563]">
            Contrôle des pièces comptables, validation OCR, détection anti-doublon et exports normalisés.
          </p>
        </div>

        {/* Accounting Export Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => exportAccountingData('csv')}
            className="cabinet-btn-secondary text-xs py-2 px-3 flex items-center gap-1.5"
            title="Export CSV compatible WinBooks / BOB50 / Exact Online"
          >
            <Download className="w-3.5 h-3.5 text-[#B79661]" />
            Export FEC/CSV
          </button>
          <button
            onClick={() => exportAccountingData('json')}
            className="cabinet-btn-primary text-xs py-2 px-3 flex items-center gap-1.5"
            title="Export JSON structuré"
          >
            <Download className="w-3.5 h-3.5 text-[#F3D085]" />
            Export Audit JSON
          </button>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-[#E8E6DF] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Pièces à vérifier</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#142B45] mt-1">
            {pendingReviewDocs}
          </div>
          <div className="text-xs text-amber-600 mt-0.5 font-medium">Validation humaine requise</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E6DF] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Alertes Doublons</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-rose-600 mt-1">
            {duplicateAlerts}
          </div>
          <div className="text-xs text-[#6B7280] mt-0.5">Factures similaires détectées</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E6DF] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Demandes Pièces</span>
            <FileText className="w-4 h-4 text-[#B79661]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#142B45] mt-1">
            {pendingMissingRequests}
          </div>
          <div className="text-xs text-[#6B7280] mt-0.5">En attente côté clients</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E6DF] shadow-xs">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Traités ce mois</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700 mt-1">
            {validatedThisMonth}
          </div>
          <div className="text-xs text-[#6B7280] mt-0.5">Imputations conformes</div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-[#E8E6DF] shadow-xs col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between text-xs text-[#6B7280]">
            <span>Portefeuille Actif</span>
            <Building className="w-4 h-4 text-[#142B45]" />
          </div>
          <div className="text-2xl font-bold font-mono text-[#142B45] mt-1">
            {accessibleCompanies.length}
          </div>
          <div className="text-xs text-[#6B7280] mt-0.5">Entreprises sous contrat</div>
        </div>
      </div>

      {/* Primary Cockpit Navigation Tabs */}
      <div className="flex border-b border-[#E8E6DF] bg-white rounded-t-xl px-4 pt-2 text-xs font-semibold gap-3">
        <button
          onClick={() => setActiveTab('inbox')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'inbox'
              ? 'border-[#142B45] text-[#142B45] font-bold'
              : 'border-transparent text-[#6B7280] hover:text-[#142B45]'
          }`}
        >
          <FileText className="w-4 h-4 text-[#B79661]" />
          Documents Entrants ({managerFilteredDocs.length})
        </button>

        <button
          onClick={() => setActiveTab('portfolio')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'portfolio'
              ? 'border-[#142B45] text-[#142B45] font-bold'
              : 'border-transparent text-[#6B7280] hover:text-[#142B45]'
          }`}
        >
          <Building className="w-4 h-4 text-[#B79661]" />
          Portefeuille &amp; Fiches Entreprises ({accessibleCompanies.length})
        </button>

        <button
          onClick={() => setActiveTab('duplicates')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'duplicates'
              ? 'border-[#142B45] text-[#142B45] font-bold'
              : 'border-transparent text-[#6B7280] hover:text-[#142B45]'
          }`}
        >
          <AlertTriangle className="w-4 h-4 text-rose-600" />
          Alertes Doublons ({duplicateAlerts})
        </button>

        <button
          onClick={() => setActiveTab('missing')}
          className={`py-3 px-4 border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'missing'
              ? 'border-[#142B45] text-[#142B45] font-bold'
              : 'border-transparent text-[#6B7280] hover:text-[#142B45]'
          }`}
        >
          <Briefcase className="w-4 h-4 text-[#B79661]" />
          Demandes en Cours ({pendingMissingRequests})
        </button>
      </div>

      {/* TAB 1: INBOX & MULTI-FILTER TABLE */}
      {activeTab === 'inbox' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-[#E8E6DF] p-5 sm:p-6 shadow-sm space-y-5">
          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
            {/* Company Filter */}
            <div>
              <label className="block text-[#6B7280] mb-1 font-semibold">Entreprise :</label>
              <select
                value={selectedCompanyFilter}
                onChange={(e) => setSelectedCompanyFilter(e.target.value)}
                className="cabinet-input w-full"
              >
                <option value="all">Toutes les entreprises</option>
                {accessibleCompanies.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.legalName}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-[#6B7280] mb-1 font-semibold">Classement :</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="cabinet-input w-full"
              >
                <option value="all">Toutes les catégories</option>
                <option value="achats">Achats</option>
                <option value="ventes">Ventes</option>
                <option value="banque">Banque</option>
                <option value="frais">Frais</option>
                <option value="divers">Divers</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-[#6B7280] mb-1 font-semibold">Statut :</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as any)}
                className="cabinet-input w-full"
              >
                <option value="all">Tous les statuts</option>
                <option value="recu">Reçu</option>
                <option value="en_verification">En vérification</option>
                <option value="accepte">Accepté</option>
                <option value="a_completer">À compléter</option>
                <option value="traite">Traité &amp; Imputé</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="block text-[#6B7280] mb-1 font-semibold">Recherche :</label>
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-[#6B7280] absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Fichier, fournisseur, #facture..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="cabinet-input w-full pl-8"
                />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto rounded-xl border border-[#E8E6DF]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F6] border-b border-[#E8E6DF] text-[#4B5563] font-semibold uppercase tracking-wider">
                <tr>
                  <th className="p-3.5">Entreprise &amp; Fichier</th>
                  <th className="p-3.5">Fournisseur &amp; N°</th>
                  <th className="p-3.5">Proposition OCR (HT / TVA / TTC)</th>
                  <th className="p-3.5 text-center">Statut</th>
                  <th className="p-3.5 text-right">Actions Métier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8E6DF] bg-white">
                {managerFilteredDocs.map((doc) => (
                  <tr key={doc.id} className="hover:bg-[#FAF9F6] transition-colors">
                    <td className="p-3.5">
                      <div className="font-semibold text-[#142B45]">
                        {getCompanyName(doc.companyId)}
                      </div>
                      <div className="text-[#6B7280] flex items-center gap-1.5 mt-0.5">
                        <FileText className="w-3.5 h-3.5 text-[#B79661]" />
                        <span className="truncate max-w-[200px]">{doc.filename}</span>
                        <span className="capitalize text-xs bg-[#FAF9F6] px-1.5 py-0.5 rounded border border-[#E8E6DF]">
                          {doc.category}
                        </span>
                      </div>
                      {doc.ocrData.isDuplicateDetected && (
                        <span className="inline-flex items-center gap-1 text-xs text-rose-700 font-bold bg-rose-50 border border-rose-200 px-2 py-0.5 rounded mt-1">
                          <AlertTriangle className="w-3 h-3 text-rose-600" /> Doublon potentiel
                        </span>
                      )}
                    </td>

                    <td className="p-3.5 font-medium text-[#142B45]">
                      <div>{doc.ocrData.vendorName}</div>
                      <div className="text-xs text-[#6B7280] font-mono">
                        #{doc.ocrData.invoiceNumber} • {doc.ocrData.date}
                      </div>
                    </td>

                    <td className="p-3.5 font-mono">
                      <div className="text-[#142B45] font-bold">
                        {doc.ocrData.totalTtcEur.toFixed(2)} € TTC
                      </div>
                      <div className="text-xs text-[#6B7280]">
                        HT: {doc.ocrData.amountHtEur.toFixed(2)} € | TVA ({doc.ocrData.vatRatePercent}%): {doc.ocrData.vatAmountEur.toFixed(2)} €
                      </div>
                      <div className="text-[10px] text-[#B79661] mt-0.5 flex items-center gap-1">
                        <Sparkles className="w-2.5 h-2.5" /> Score confiance: {doc.ocrData.confidenceScore}%
                      </div>
                    </td>

                    <td className="p-3.5 text-center">
                      {getStatusBadge(doc.status)}
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPreviewDocument(doc)}
                          className="px-2.5 py-1.5 rounded-lg border border-[#E8E6DF] hover:border-[#142B45] text-[#142B45] font-semibold text-xs flex items-center gap-1 cursor-pointer bg-white"
                          title="Prévisualiser et valider manuellement"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#B79661]" />
                          Examiner
                        </button>

                        {doc.status !== 'traite' && (
                          <button
                            onClick={() => validateDocument(doc.id, 'traite', undefined, 'Validé directement depuis le cockpit')}
                            className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs flex items-center gap-1 cursor-pointer shadow-xs"
                            title="Valider en 1 clic"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Valider
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: PORTFOLIO & COMPANY CARDS */}
      {activeTab === 'portfolio' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accessibleCompanies.map((comp) => {
            const compDocs = documents.filter((d) => d.companyId === comp.id);
            const compMissing = missingRequests.filter((r) => r.companyId === comp.id && r.status === 'en_attente');
            const managerUsers = users.filter((u) => u.role === 'manager' || u.role === 'supervisor');

            return (
              <div key={comp.id} className="bg-white rounded-xl border border-[#E8E6DF] p-5 shadow-xs space-y-4">
                <div className="flex items-start justify-between border-b border-[#E8E6DF] pb-3">
                  <div>
                    <h4 className="font-serif font-bold text-base text-[#142B45]">
                      {comp.legalName}
                    </h4>
                    <div className="text-xs text-[#6B7280] font-mono mt-0.5">
                      BCE: {comp.bceNumber} • {comp.vatNumber}
                    </div>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#FAF9F6] border border-[#E8E6DF] text-[#142B45]">
                    {comp.legalForm}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#6B7280] block">Régime fiscal :</span>
                    <strong className="text-[#142B45]">{comp.accountingRegime}</strong>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block">Clôture exercice :</span>
                    <strong className="text-[#142B45]">{comp.fiscalYearEnd}</strong>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block">Contact dirigeant :</span>
                    <strong className="text-[#142B45]">{comp.contactEmail}</strong>
                  </div>
                  <div>
                    <span className="text-[#6B7280] block">Documents déposés :</span>
                    <strong className="text-[#142B45] font-mono">{compDocs.length} pièce(s)</strong>
                  </div>
                </div>

                {/* Manager Assignment */}
                <div className="bg-[#FAF9F6] border border-[#E8E6DF] rounded-lg p-3 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-[#B79661]" />
                    <span className="text-[#4B5563]">Gestionnaire assigné :</span>
                  </div>
                  <select
                    value={comp.assignedManagerId}
                    onChange={(e) => assignCompanyManager(comp.id, e.target.value)}
                    className="bg-white border border-[#E8E6DF] rounded px-2 py-1 font-semibold text-[#142B45] text-xs outline-none"
                  >
                    {managerUsers.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.fullName} ({m.role})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action footer */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <span className="text-rose-700 font-semibold">
                    {compMissing.length > 0 ? `⚠️ ${compMissing.length} demande(s) en attente` : '✓ Dossier complet'}
                  </span>
                  <button
                    onClick={() => {
                      onRequestMissingDocument();
                    }}
                    className="text-xs text-[#142B45] font-semibold hover:text-[#B79661] flex items-center gap-1 cursor-pointer"
                  >
                    + Demander une pièce
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 3: DUPLICATES */}
      {activeTab === 'duplicates' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-[#E8E6DF] p-5 sm:p-6 shadow-sm space-y-4">
          <div className="border-b border-[#E8E6DF] pb-3">
            <h4 className="font-serif font-bold text-base text-[#142B45]">
              Moteur de Détection des Doublons Comptables
            </h4>
            <p className="text-xs text-[#4B5563] mt-0.5">
              Analyse automatisée basée sur le croisement (Fournisseur, Numéro de facture, Montant TTC et Période).
            </p>
          </div>

          <div className="space-y-3">
            {documents
              .filter((d) => d.ocrData.isDuplicateDetected)
              .map((dup) => (
                <div
                  key={dup.id}
                  className="p-4 rounded-xl border border-rose-300 bg-rose-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-rose-900">{dup.filename}</span>
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white">
                        Doublon Détecté
                      </span>
                    </div>
                    <p className="text-xs text-rose-800 font-medium">
                      {dup.ocrData.duplicateReason}
                    </p>
                    <div className="text-xs text-[#6B7280]">
                      Entreprise : <strong>{getCompanyName(dup.companyId)}</strong> • Montant :{' '}
                      <strong>{dup.ocrData.totalTtcEur.toFixed(2)} €</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => onPreviewDocument(dup)}
                      className="px-3 py-1.5 rounded-lg border border-[#E8E6DF] bg-white text-[#142B45] font-semibold text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 text-[#B79661]" />
                      Comparer
                    </button>
                    <button
                      onClick={() => validateDocument(dup.id, 'a_completer', undefined, 'Rejeté pour doublon')}
                      className="px-3 py-1.5 rounded-lg bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs cursor-pointer"
                    >
                      Rejeter le doublon
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 4: MISSING PIECES TRACKING */}
      {activeTab === 'missing' && (
        <div className="bg-white rounded-b-xl border border-t-0 border-[#E8E6DF] p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-[#E8E6DF] pb-3">
            <div>
              <h4 className="font-serif font-bold text-base text-[#142B45]">
                Suivi des Demandes de Pièces Complémentaires
              </h4>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Garantit que chaque dossier dispose de l’intégralité de ses pièces fiscales avant clôture.
              </p>
            </div>
            <button
              onClick={() => onRequestMissingDocument()}
              className="cabinet-btn-primary text-xs py-2 px-3.5 shadow-sm"
            >
              + Nouvelle Demande Client
            </button>
          </div>

          <div className="space-y-3">
            {missingRequests.map((req) => (
              <div
                key={req.id}
                className="p-4 rounded-xl border border-[#E8E6DF] bg-[#FAF9F6] flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <strong className="text-[#142B45] text-sm">{req.title}</strong>
                    <span className="font-semibold text-[#B79661]">[{getCompanyName(req.companyId)}]</span>
                    {req.status === 'en_attente' ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                        En attente client
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-green-100 text-green-800 border border-green-300">
                        Résolu
                      </span>
                    )}
                  </div>
                  <p className="text-[#4B5563]">{req.description}</p>
                  <div className="text-[#6B7280]">
                    Période fiscale : <strong>{req.period}</strong> • Émis par {req.requestedByUserName} le {req.createdAt}
                  </div>
                </div>

                {req.status === 'en_attente' && (
                  <button
                    onClick={() => resolveMissingRequest(req.id)}
                    className="cabinet-btn-secondary text-xs py-1.5 px-3 shrink-0"
                  >
                    Marquer comme reçu
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
