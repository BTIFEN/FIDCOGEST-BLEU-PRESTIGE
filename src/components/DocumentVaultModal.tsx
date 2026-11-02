import React, { useState } from 'react';
import { UploadedDocResult } from '../types';
import { SOFTWARE_GATEWAYS } from '../data/mockData';
import { X, Lock, UploadCloud, FileText, CheckCircle2, ExternalLink, ShieldCheck, Sparkles, AlertCircle, RefreshCw } from 'lucide-react';

interface DocumentVaultModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentVaultModal: React.FC<DocumentVaultModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'gateway' | 'portal'>('upload');

  const [isUploading, setIsUploading] = useState(false);
  const [filename, setFilename] = useState('');
  const [gatewayMessage, setGatewayMessage] = useState<string | null>(null);

  const [analyzedDocs, setAnalyzedDocs] = useState<UploadedDocResult[]>([
    {
      id: 'doc-1',
      filename: 'Facture_Proximus_Mars2026.pdf',
      docType: 'Facture Télécom / Internet',
      vendorName: 'Proximus SA',
      totalAmountEur: 145.20,
      vatAmountEur: 25.20,
      vatRatePercent: 21,
      invoiceDate: '2026-03-15',
      recommendedCategory: 'Frais de télécommunication',
      deductibilityRate: '100%',
      status: 'Comptabilisé'
    }
  ]);

  // Client Portal login state
  const [clientKey, setClientKey] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isOpen) return null;

  const handleSimulatedFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setFilename(file.name);
    setIsUploading(true);

    try {
      const res = await fetch('/api/analyze-document', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          filename: file.name,
          textSnippet: `Facture d'achat déposée par le client. Fichier: ${file.name}. Fournisseur: ${file.name.includes('Engie') ? 'Engie Electrabel' : 'Orange Belgium SA'}. Montant Total HTVA: 240,00 EUR. TVA 21%: 50,40 EUR. Total TTC: 290,40 EUR.`
        })
      });

      const data = await res.json();

      const newDoc: UploadedDocResult = {
        id: `doc-${Date.now()}`,
        filename: file.name,
        docType: data.docType || 'Facture / Justificatif',
        vendorName: data.vendorName || 'Fournisseur',
        totalAmountEur: data.totalAmountEur || 290.40,
        vatAmountEur: data.vatAmountEur || 50.40,
        vatRatePercent: data.vatRatePercent || 21,
        invoiceDate: data.invoiceDate || '2026-04-01',
        recommendedCategory: data.recommendedCategory || 'Frais généraux',
        deductibilityRate: data.deductibilityRate || '100%',
        status: 'Analysé'
      };

      setAnalyzedDocs([newDoc, ...analyzedDocs]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  const handleGatewayConnect = (name: string) => {
    setGatewayMessage(`Session sécurisée SSO vers ${name} initialisée avec succès.`);
    setTimeout(() => setGatewayMessage(null), 4000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientKey.trim()) {
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#142B45]/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-white border border-[#E8E6DF] shadow-2xl overflow-hidden text-[#1F2937] my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-6 border-b border-[#E8E6DF] bg-[#F7F6F2] flex items-center justify-between">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#142B45] text-[#B79661] flex items-center justify-center font-serif text-lg font-bold shadow-xs">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-lg text-[#142B45]">
                Portail Client Sécurisé &amp; Dépôt Express
              </h3>
              <p className="text-xs text-[#6B7280] flex items-center gap-1.5 font-sans mt-0.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B79661]" />
                Chiffrement TLS 256-bit • Secret Professionnel Comptable (ITAA)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6B7280] hover:text-[#142B45] hover:bg-white transition-colors"
            aria-label="Fermer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#E8E6DF] bg-white px-6 pt-3 text-xs font-sans">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 font-semibold transition-all ${
              activeTab === 'upload'
                ? 'border-[#142B45] text-[#142B45]'
                : 'border-transparent text-[#6B7280] hover:text-[#142B45]'
            }`}
          >
            <UploadCloud className="w-4 h-4 text-[#B79661]" />
            Dépôt Express &amp; OCR IA
          </button>

          <button
            onClick={() => setActiveTab('gateway')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 font-semibold transition-all ${
              activeTab === 'gateway'
                ? 'border-[#142B45] text-[#142B45]'
                : 'border-transparent text-[#6B7280] hover:text-[#142B45]'
            }`}
          >
            <ExternalLink className="w-4 h-4 text-[#B79661]" />
            Passerelle Logiciels Métiers
          </button>

          <button
            onClick={() => setActiveTab('portal')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 font-semibold transition-all ${
              activeTab === 'portal'
                ? 'border-[#142B45] text-[#142B45]'
                : 'border-transparent text-[#6B7280] hover:text-[#142B45]'
            }`}
          >
            <Lock className="w-4 h-4 text-[#B79661]" />
            Espace Client Log-In
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 sm:p-8">
          {/* TAB 1: Dépôt Express */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              {/* Drop Area */}
              <div className="border-2 border-dashed border-[#B79661]/40 hover:border-[#142B45] rounded-2xl p-7 text-center bg-[#F7F6F2] hover:bg-white transition-all group relative cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.zip"
                  onChange={handleSimulatedFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="w-12 h-12 rounded-full bg-white border border-[#E8E6DF] text-[#B79661] flex items-center justify-center mx-auto mb-3 shadow-xs group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h4 className="font-serif font-bold text-base text-[#142B45]">
                  Déposez vos pièces comptables (Factures, Justificatifs, Relevés)
                </h4>
                <p className="text-xs text-[#4B5563] mt-1 max-w-md mx-auto leading-relaxed">
                  Glissez-déposez vos fichiers PDF ou images scannées. Le moteur de reconnaissance OCR extrait instantanément montants, taux de TVA et dates.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-[#B79661]/40 text-[#142B45] text-xs font-serif shadow-xs">
                  <Sparkles className="w-3.5 h-3.5 text-[#B79661]" />
                  <span>Démonstration Reconnaissance OCR Fidcogest</span>
                </div>
                <div className="mt-2 text-[10px] text-[#6B7280]">
                  ℹ️ Démonstration technologique. Pour les clients sous contrat, la synchronisation sécurisée s'effectue via l'application certifiée <strong>Basecone</strong>.
                </div>
              </div>

              {isUploading && (
                <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#B79661]/40 flex items-center gap-3 text-xs text-[#142B45]">
                  <RefreshCw className="w-4 h-4 animate-spin text-[#B79661] shrink-0" />
                  <span>Analyse intelligente du document <strong>{filename}</strong> par le moteur OCR de Fidcogest...</span>
                </div>
              )}

              {/* Analyzed Docs List */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-[#142B45] uppercase tracking-wider mb-3">
                  <span>Pièces comptables enregistrées :</span>
                  <span className="text-[#6B7280] font-mono">{analyzedDocs.length} document(s)</span>
                </div>

                <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                  {analyzedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3.5 rounded-xl bg-white border border-[#E8E6DF] flex items-center justify-between gap-3 text-xs shadow-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-[#F7F6F2] border border-[#E8E6DF] flex items-center justify-center text-[#B79661] shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-semibold text-[#142B45] truncate">{doc.filename}</div>
                          <div className="text-[11px] text-[#6B7280] flex items-center gap-2">
                            <span>{doc.vendorName}</span>
                            <span>•</span>
                            <span>{doc.recommendedCategory}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-[#142B45]">
                          {doc.totalAmountEur.toFixed(2)} € TTC
                        </div>
                        <div className="text-[11px] text-[#6B7280] font-mono">
                          TVA ({doc.vatRatePercent}%): {doc.vatAmountEur.toFixed(2)} €
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Software Gateways */}
          {activeTab === 'gateway' && (
            <div className="space-y-4">
              <p className="text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                Connectez-vous directement à votre environnement comptable synchronisé avec le cabinet Fidcogest :
              </p>

              {gatewayMessage && (
                <div className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#B79661] text-xs text-[#142B45] flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#B79661]" />
                  <span>{gatewayMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {SOFTWARE_GATEWAYS.map((sw) => (
                  <div
                    key={sw.id}
                    className="cabinet-card p-5 flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <h5 className="font-serif font-bold text-base text-[#142B45]">{sw.name}</h5>
                        <span className="cabinet-badge-itaa">
                          {sw.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#4B5563] leading-relaxed">{sw.description}</p>
                    </div>

                    <button
                      onClick={() => handleGatewayConnect(sw.name)}
                      className="cabinet-btn-secondary w-full text-xs justify-center"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#B79661]" />
                      Se connecter à {sw.name}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Client Portal Login */}
          {activeTab === 'portal' && (
            <div className="space-y-4">
              {isLoggedIn ? (
                <div className="cabinet-card p-6 space-y-5">
                  <div className="flex items-center justify-between border-b border-[#E8E6DF] pb-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                      <span className="font-serif font-bold text-sm text-[#142B45]">Espace Client Actif • SRL Demo Company</span>
                    </div>
                    <button
                      onClick={() => setIsLoggedIn(false)}
                      className="text-xs font-semibold text-[#6B7280] hover:text-[#142B45] underline"
                    >
                      Déconnexion
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF]">
                      <div className="text-[#6B7280]">Déclaration TVA Q1 2026</div>
                      <div className="font-bold text-[#142B45] text-sm mt-1">Transmise &amp; Validée</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF]">
                      <div className="text-[#6B7280]">Prochain VA ISOC</div>
                      <div className="font-bold text-[#B79661] text-sm mt-1">10 Avril 2026 (VA1)</div>
                    </div>
                    <div className="p-4 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF]">
                      <div className="text-[#6B7280]">Pièces à traiter</div>
                      <div className="font-bold text-[#142B45] text-sm mt-1">0 justificatif en attente</div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-4 py-4">
                  <div className="text-center space-y-1.5">
                    <h4 className="font-serif font-bold text-lg text-[#142B45]">
                      Identifiant ou Clé d'Accès Client
                    </h4>
                    <p className="text-xs text-[#4B5563]">
                      Saisissez le code d'accès délivré lors de l'ouverture de votre dossier au cabinet
                    </p>
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      value={clientKey}
                      onChange={(e) => setClientKey(e.target.value)}
                      placeholder="ex. FID-8429-SRL"
                      className="cabinet-input text-center font-mono text-sm"
                    />
                  </div>

                  <button
                    type="submit"
                    className="cabinet-btn-primary w-full text-xs justify-center"
                  >
                    Accéder à mon Espace Sécurisé →
                  </button>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
