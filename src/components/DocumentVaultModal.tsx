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
  const [fileText, setFileText] = useState('');
  const [filename, setFilename] = useState('');
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

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (clientKey.trim()) {
      setIsLoggedIn(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl rounded-2xl bg-slate-900 border border-slate-700/80 shadow-2xl overflow-hidden text-slate-100 my-8">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 bg-slate-950/90 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-display font-bold text-base text-white">
                Portail Client Sécurisé & Dépôt Express SSL
              </h3>
              <p className="text-xs text-slate-400 flex items-center gap-1 font-mono">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                Chiffrement TLS 256-bit • Secret Professionnel Comptable
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-4 pt-2 text-xs font-medium">
          <button
            onClick={() => setActiveTab('upload')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'upload'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <UploadCloud className="w-4 h-4" />
            Dépôt Express SSL & OCR
          </button>

          <button
            onClick={() => setActiveTab('gateway')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'gateway'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ExternalLink className="w-4 h-4" />
            Passerelle Logiciels Métiers
          </button>

          <button
            onClick={() => setActiveTab('portal')}
            className={`py-3 px-4 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'portal'
                ? 'border-emerald-400 text-emerald-400 font-bold'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="w-4 h-4" />
            Espace Client Log-In
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6">
          {/* TAB 1: Dépôt Express */}
          {activeTab === 'upload' && (
            <div className="space-y-6">
              {/* Drop Area */}
              <div className="border-2 border-dashed border-slate-700/80 hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-950/50 hover:bg-slate-950 transition-all group relative cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg,.zip"
                  onChange={handleSimulatedFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h4 className="font-bold text-sm text-slate-200">
                  Déposez vos pièces comptables (Factures, Relevés, Cartes d'identité)
                </h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  Glissez-déposez vos fichiers PDF ou images. Analyse automatique OCR et transmission chiffrée vers votre gestionnaire de dossier.
                </p>
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/80 border border-emerald-800/80 text-emerald-300 text-xs font-mono">
                  <Sparkles className="w-3.5 h-3.5" />
                  Lecture automatique OCR IA instantanée
                </div>
              </div>

              {isUploading && (
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center gap-3 text-xs text-emerald-300">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400 shrink-0" />
                  <span>Analyse intelligente du document <strong>{filename}</strong> par le moteur OCR de Fidcogest...</span>
                </div>
              )}

              {/* Analyzed Docs List */}
              <div>
                <h5 className="text-xs font-mono uppercase text-slate-400 mb-2 flex items-center justify-between">
                  <span>Détail des pièces comptables numérisées :</span>
                  <span>{analyzedDocs.length} document(s)</span>
                </h5>
                <div className="space-y-2 max-h-[220px] overflow-y-auto">
                  {analyzedDocs.map((doc) => (
                    <div
                      key={doc.id}
                      className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3 text-xs"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-amber-400 shrink-0">
                          <FileText className="w-4 h-4" />
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-slate-200 truncate">{doc.filename}</div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2 font-mono">
                            <span>{doc.vendorName}</span>
                            <span>•</span>
                            <span>Catégorie: {doc.recommendedCategory}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-mono font-bold text-emerald-400">
                          {doc.totalAmountEur.toFixed(2)} € TTC
                        </div>
                        <div className="text-[10px] text-slate-400 font-mono">
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
              <p className="text-xs text-slate-300">
                Accédez directement aux logiciels comptables et fiscaux de l'écosystème numérique du cabinet Fidcogest :
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SOFTWARE_GATEWAYS.map((sw) => (
                  <div
                    key={sw.id}
                    className="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <h5 className="font-bold text-sm text-white">{sw.name}</h5>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {sw.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">{sw.description}</p>
                    </div>

                    <button
                      onClick={() => alert(`Lien de connexion SSO vers ${sw.name} initié en toute sécurité.`)}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700/80 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
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
                <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/40 space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></div>
                      <span className="text-xs font-bold text-white">Espace Client Connecté • SRL Demo Company</span>
                    </div>
                    <button
                      onClick={() => setIsLoggedIn(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Déconnexion
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs font-mono">
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-slate-400">Statut TVA Q1 2026 :</div>
                      <div className="text-emerald-400 font-bold mt-1">Déclaration Envoyée</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-slate-400">Prochain VA ISOC :</div>
                      <div className="text-amber-400 font-bold mt-1">10 Avril 2026 (VA1)</div>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-900 border border-slate-800">
                      <div className="text-slate-400">Pièces à valider :</div>
                      <div className="text-slate-200 font-bold mt-1">0 document en attente</div>
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLogin} className="max-w-md mx-auto space-y-4 py-4">
                  <div className="text-center space-y-1">
                    <h4 className="font-bold text-sm text-white">Identifiant ou Clé d'Accès Client</h4>
                    <p className="text-xs text-slate-400">Entrez votre code client délivré par le cabinet Fidcogest</p>
                  </div>

                  <div>
                    <input
                      type="text"
                      required
                      value={clientKey}
                      onChange={(e) => setClientKey(e.target.value)}
                      placeholder="Saisissez votre code (ex. CLIENT-8429)"
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white text-center font-mono focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-colors shadow-lg shadow-emerald-950/40"
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
