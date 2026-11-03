import React, { useState, useEffect } from 'react';
import { useCabinet } from '../context/CabinetContext';
import { Lock, ShieldCheck, CheckCircle2, AlertTriangle, Save, RefreshCw, Eye, Edit3, Building, Users, Briefcase, FileText, Info, Globe, Image, Zap, ExternalLink } from 'lucide-react';
import { CabinetConfig, CabinetImages } from '../types';

export const AdminPage: React.FC = () => {
  const { config, updateConfig, refreshConfig } = useCabinet();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!sessionStorage.getItem('fidcogest_admin_token');
  });

  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'audit' | 'wordpress' | 'images' | 'identity' | 'team' | 'services' | 'presentation'>('wordpress');

  // Local working copy of editable config
  const [draftConfig, setDraftConfig] = useState<CabinetConfig>(config);
  const [saveStatus, setSaveStatus] = useState<{ loading: boolean; success?: boolean; error?: string }>({
    loading: false
  });

  // Diagnostic WordPress
  const [wpStatus, setWpStatus] = useState<any>(null);
  const [wpChecking, setWpChecking] = useState<boolean>(false);
  const [flushStatus, setFlushStatus] = useState<{ loading: boolean; message?: string; error?: string }>({
    loading: false
  });

  useEffect(() => {
    setDraftConfig(config);
  }, [config]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        const data = await res.json();
        sessionStorage.setItem('fidcogest_admin_token', data.token || 'admin-session');
        setIsAuthenticated(true);
        // Test auto WP connectivity
        checkWpStatus();
      } else {
        const errData = await res.json().catch(() => ({}));
        setAuthError(errData.error || 'Mot de passe administrateur incorrect.');
      }
    } catch (err) {
      setAuthError('Erreur de connexion au serveur.');
    }
  };

  const checkWpStatus = async () => {
    setWpChecking(true);
    try {
      const token = sessionStorage.getItem('fidcogest_admin_token');
      const res = await fetch('/api/admin/wp-status', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setWpStatus(data);
      } else {
        setWpStatus({ error: `Erreur HTTP ${res.status}` });
      }
    } catch (err: any) {
      setWpStatus({ error: err.message });
    } finally {
      setWpChecking(false);
    }
  };

  const handleFlushCache = async () => {
    setFlushStatus({ loading: true });
    try {
      const token = sessionStorage.getItem('fidcogest_admin_token');
      const res = await fetch('/api/admin/flush-cache', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setFlushStatus({ loading: false, message: 'Cache mémoire Express purgé avec succès.' });
        await refreshConfig();
      } else {
        setFlushStatus({ loading: false, error: data.error || 'Échec de la purge.' });
      }
    } catch (err: any) {
      setFlushStatus({ loading: false, error: err.message });
    }

  };

  const handleSave = async () => {
    setSaveStatus({ loading: true });
    const res = await updateConfig(draftConfig, password);
    if (res.success) {
      setSaveStatus({ loading: false, success: true });
      setTimeout(() => setSaveStatus({ loading: false }), 4000);
    } else {
      setSaveStatus({ loading: false, error: res.error || 'Erreur lors de l\'enregistrement.' });
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4 font-sans">
        <div className="w-full max-w-md cabinet-card p-8 space-y-6 shadow-2xl">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#142B45] text-[#B79661] flex items-center justify-center mx-auto shadow-md">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-serif font-bold text-2xl text-[#142B45]">
              Administration Fidcogest
            </h1>
            <p className="text-xs text-[#6B7280]">
              Espace de gestion sécurisé des données légales, des visuels et de la synchronisation WordPress.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#142B45] mb-1.5">
                Clé d'Accès Sécurisée Administrateur
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Entrez le mot de passe configuré dans .env..."
                className="cabinet-input"
              />
              <span className="text-xs text-[#6B7280] block mt-1">
                Authentification cryptographique protégée contre le brute-force.
              </span>
            </div>

            <button
              type="submit"
              className="cabinet-btn-primary w-full justify-center text-xs"
            >
              <ShieldCheck className="w-4 h-4" />
              Déverrouiller l'Administration
            </button>
          </form>
        </div>
      </div>
    );
  }


  return (
    <div className="space-y-8 pb-20 font-sans max-w-7xl mx-auto px-4 sm:px-6 pt-6">
      
      {/* Top Header */}
      <div className="cabinet-card p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#B79661]/40 bg-gradient-to-r from-white via-white to-[#F7F6F2]">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-[#142B45] text-[#B79661] flex items-center justify-center font-serif font-bold text-lg shadow-xs">
            <Lock className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif font-bold text-xl text-[#142B45]">
                Console d'Administration &amp; Gouvernance
              </h1>
              <span className="cabinet-badge-itaa text-xs">Session Active</span>
            </div>
            <p className="text-xs text-[#6B7280] mt-0.5">
              Gestion persistante des données officielles de FIDCOGEST SRL (BCE 0899.441.309).
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={saveStatus.loading}
            className="cabinet-btn-primary text-xs"
          >
            {saveStatus.loading ? (
              <RefreshCw className="w-4 h-4 animate-spin text-[#B79661]" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            Enregistrer les modifications
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem('fidcogest_admin_token');
              setIsAuthenticated(false);
            }}
            className="cabinet-btn-secondary text-xs"
          >
            Déconnexion
          </button>
        </div>
      </div>

      {saveStatus.success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Toutes les modifications ont été enregistrées avec succès dans la base persistante.</span>
        </div>
      )}

      {saveStatus.error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-xs text-red-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{saveStatus.error}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#E8E6DF] pb-2 text-xs">
        {[
          { key: 'wordpress', label: '1. Connexion WordPress & Webhook', icon: Globe },
          { key: 'images', label: '2. Visuels & Médias (13)', icon: Image },
          { key: 'audit', label: '3. Audit & Divergences', icon: Info },
          { key: 'identity', label: '4. Identité & Coordonnées', icon: Building },
          { key: 'team', label: '5. Équipe & Direction', icon: Users },
          { key: 'services', label: '6. Les 7 Pôles de Services', icon: Briefcase },
          { key: 'presentation', label: '7. Textes & Accueil', icon: FileText }
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[#142B45] text-white shadow-xs'
                  : 'bg-white border border-[#E8E6DF] text-[#4B5563] hover:text-[#142B45]'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#B79661]' : 'text-[#6B7280]'}`} />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: WordPress Sync & Webhook */}
      {activeTab === 'wordpress' && (
        <div className="space-y-6">
          <div className="cabinet-card p-6 sm:p-8 space-y-6 border border-[#B79661]/30">
            <div className="border-b border-[#E8E6DF] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-[#B79661]" />
                  <h2 className="font-serif font-bold text-xl text-[#142B45]">
                    Architecture Hybride Headless WordPress
                  </h2>
                </div>
                <p className="text-xs text-[#6B7280] mt-1">
                  Site WordPress de référence : <strong className="text-[#142B45]">https://fidcogestv2.indusale.top</strong> (Thème Astra / LiteSpeed PHP 8.3)
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={checkWpStatus}
                  disabled={wpChecking}
                  className="cabinet-btn-secondary text-xs flex items-center gap-2 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${wpChecking ? 'animate-spin text-[#B79661]' : ''}`} />
                  <span>Tester la connexion WP</span>
                </button>

                <button
                  type="button"
                  onClick={handleFlushCache}
                  disabled={flushStatus.loading}
                  className="px-4 py-2 rounded-xl bg-[#142B45] hover:bg-[#1D3B5C] text-white font-semibold text-xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <Zap className="w-3.5 h-3.5 text-[#D9BD8E]" />
                  <span>Purger le cache Express</span>
                </button>
              </div>
            </div>

            {flushStatus.message && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{flushStatus.message}</span>
              </div>
            )}

            {flushStatus.error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-300 text-xs text-red-800 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{flushStatus.error}</span>
              </div>
            )}

            {/* Diagnostic Widget */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF] space-y-1.5">
                <div className="text-xs font-semibold text-[#8C6A34] uppercase tracking-wider">État de l'API REST WP</div>
                <div className="text-sm font-bold text-[#142B45] flex items-center gap-2">
                  {wpStatus?.reachable ? (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                      <span>En ligne ({wpStatus?.latencyMs || 0} ms)</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                      <span>En attente de test</span>
                    </>
                  )}
                </div>
                <p className="text-xs text-[#6B7280]">
                  Endpoint : <code>/wp-json/fidcogest/v1/content</code>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF] space-y-1.5">
                <div className="text-xs font-semibold text-[#8C6A34] uppercase tracking-wider">Plugin FIDCOGEST sur WP</div>
                <div className="text-sm font-bold text-[#142B45] flex items-center gap-2">
                  {wpStatus?.pluginActive ? (
                    <span className="text-emerald-700 font-bold">Extension Activée</span>
                  ) : (
                    <span className="text-[#8C6A34] font-medium">Extension Prête à installer</span>
                  )}
                </div>
                <p className="text-xs text-[#6B7280]">
                  Archive disponible : <code>FIDCOGEST-Content-Manager.zip</code>
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF] space-y-1.5">
                <div className="text-xs font-semibold text-[#8C6A34] uppercase tracking-wider">Cache Mémoire Express</div>
                <div className="text-sm font-bold text-[#142B45]">
                  TTL : 5 minutes (300s)
                </div>
                <p className="text-xs text-[#6B7280]">
                  Invalidation instantanée via Webhook <code>POST /api/webhook/wp-flush</code>
                </p>
              </div>
            </div>

            {/* Quick Actions & Links */}
            <div className="p-5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] space-y-3">
              <h3 className="font-serif font-bold text-sm text-[#142B45]">
                Accès direct au tableau de bord WordPress (fidcogestv2.indusale.top)
              </h3>
              <p className="text-xs text-[#4B5563] leading-relaxed">
                Connectez-vous à votre interface d'administration WordPress pour administrer les visuels dans la Médiathèque standard :
              </p>
              <div className="flex flex-wrap gap-3 pt-1">
                <a
                  href="https://fidcogestv2.indusale.top/wp-login.php"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white border border-[#B79661] hover:bg-[#FAF9F6] text-[#142B45] font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#B79661]" />
                  <span>Ouvrir l'administration WordPress</span>
                </a>
                <a
                  href="https://fidcogestv2.indusale.top/wp-json/fidcogest/v1/content"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded-xl bg-white border border-[#E8E6DF] hover:bg-[#FAF9F6] text-[#142B45] font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-[#6B7280]" />
                  <span>Voir le flux JSON brut</span>
                </a>
              </div>
            </div>

            {/* Guide rapide d'installation du plugin */}
            <div className="border-t border-[#E8E6DF] pt-5 space-y-3 text-xs text-[#4B5563]">
              <h4 className="font-bold text-[#142B45] uppercase tracking-wider text-xs">
                Procédure d'installation de l'extension FIDCOGEST sur WordPress en 3 étapes :
              </h4>
              <ol className="list-decimal pl-5 space-y-1.5 leading-relaxed">
                <li>Dans WordPress, rendez-vous dans le menu <strong>Extensions &gt; Ajouter une extension &gt; Téléverser une extension</strong>.</li>
                <li>Sélectionnez le fichier <code>FIDCOGEST-Content-Manager.zip</code> créé à la racine du projet et cliquez sur <strong>Installer maintenant</strong>.</li>
                <li>Cliquez sur <strong>Activer l'extension</strong>. Le menu <strong>FIDCOGEST</strong> apparaît immédiatement avec l'accès à la Médiathèque des 13 visuels officiels.</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Visuels & Médias */}
      {activeTab === 'images' && (
        <div className="space-y-6">
          <div className="cabinet-card p-6 sm:p-8 space-y-6">
            <div className="border-b border-[#E8E6DF] pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-[#B79661]" />
                  <h2 className="font-serif font-bold text-xl text-[#142B45]">
                    Gestionnaire des 13 Visuels Officiels du Cabinet
                  </h2>
                </div>
                <p className="text-xs text-[#6B7280] mt-1">
                  Les images sont administrables soit via la Médiathèque WordPress, soit directement ici en saisissant une URL.
                </p>
              </div>

              <a
                href="https://fidcogestv2.indusale.top/wp-admin/admin.php?page=fidcogest-images"
                target="_blank"
                rel="noopener noreferrer"
                className="cabinet-btn-primary text-xs flex items-center gap-2"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Ouvrir la Médiathèque WP</span>
              </a>
            </div>

            {/* Grille des 13 Emplacements Médias avec Identifiants WordPress Stables */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { key: 'heroCabinet', label: '1. Hero Cabinet Vitrine', desc: 'Bannière haute de la page d\'accueil', def: 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1200&q=80' },
                { key: 'service-accounting', altKey: 'serviceComptabilite', label: '2. Pôle 1 - Comptabilité', desc: 'WP ID : service-accounting', def: '/assets/images/services/service-accounting.webp' },
                { key: 'service-tax', altKey: 'serviceFiscalite', label: '3. Pôle 2 - Fiscalité', desc: 'WP ID : service-tax', def: '/assets/images/services/service-tax.webp' },
                { key: 'service-creation', altKey: 'serviceCreation', label: '4. Pôle 3 - Création & Starters', desc: 'WP ID : service-creation', def: '/assets/images/services/service-creation.webp' },
                { key: 'service-consulting', altKey: 'serviceConseil', label: '5. Pôle 4 - Conseil de Gestion', desc: 'WP ID : service-consulting', def: '/assets/images/services/service-consulting.webp' },
                { key: 'service-audit', altKey: 'serviceAudit', label: '6. Pôle 5 - Audit Contractuel', desc: 'WP ID : service-audit', def: '/assets/images/services/service-audit.webp' },
                { key: 'service-financing', altKey: 'serviceFinancement', label: '7. Pôle 6 - Financements & Subsides', desc: 'WP ID : service-financing', def: '/assets/images/services/service-financing.webp' },
                { key: 'service-digital', altKey: 'serviceEcompta', label: '8. Pôle 7 - E-Compta & Dématérialisation', desc: 'WP ID : service-digital', def: '/assets/images/services/service-digital.webp' },
                { key: 'cabinetGanshoren', label: '9. Siège Ganshoren (Bureaux)', desc: 'Place de la Reine Paola 3, Bruxelles', def: '/assets/images/cabinet_ganshoren_modeste.webp' },
                { key: 'portraitPaulHollMpeck', label: '10. Portrait de Paul Holl Mpeck', desc: 'Gérant Fondateur & Conseil Fiscal ITAA', def: '/assets/images/portrait_paul_holl_mpeck.svg' },
                { key: 'logo', label: '11. Logo Principal (Fond clair)', desc: 'Barre de navigation principale', def: '/assets/images/logo_fidcogest.svg' },
                { key: 'logoDark', label: '12. Logo Inversé (Fond sombre)', desc: 'Pied de page & bannières de prestige', def: '/assets/images/logo_fidcogest_dark.svg' },
                { key: 'favicon', label: '13. Favicon d\'onglet', desc: 'Icône carrée d\'onglet navigateur', def: '/assets/images/favicon.svg' }
              ].map((item) => {
                const currentVal = (draftConfig.images as any)?.[item.key] || (item.altKey ? (draftConfig.images as any)?.[item.altKey] : null) || item.def;
                return (
                  <div key={item.key} className="rounded-xl border border-[#E8E6DF] bg-[#FAF9F6] p-4 flex flex-col justify-between space-y-3 shadow-xs">
                    <div className="space-y-2">
                      <div className="h-28 rounded-lg overflow-hidden bg-[#142B45] border border-[#E8E6DF] flex items-center justify-center p-2">
                        <img
                          src={currentVal}
                          alt={item.label}
                          className="max-h-full max-w-full object-contain"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = item.def;
                          }}
                        />
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-xs text-[#142B45]">{item.label}</h4>
                        <p className="text-xs text-[#6B7280]">{item.desc}</p>
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-[#E8E6DF]">
                      <input
                        type="text"
                        value={currentVal}
                        onChange={(e) => {
                          const updatedImgs = { ...(draftConfig.images || {}), [item.key]: e.target.value };
                          if (item.key === 'serviceEcompta') {
                            (updatedImgs as any).serviceEcomptaBasecone = e.target.value;
                          }
                          setDraftConfig({ ...draftConfig, images: updatedImgs as any });
                        }}
                        className="cabinet-input text-xs py-1.5 px-2.5 font-mono"
                        placeholder="URL de l'image (https://... ou /assets/...)"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updatedImgs = { ...(draftConfig.images || {}), [item.key]: item.def };
                          setDraftConfig({ ...draftConfig, images: updatedImgs as any });
                        }}
                        className="text-xs text-[#8C6A34] hover:underline font-semibold"
                      >
                        Rétablir le visuel vectoriel officiel
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Audit & Divergences */}
      {activeTab === 'audit' && (

        <div className="space-y-6">
          <div className="cabinet-card p-6 space-y-4">
            <div className="border-b border-[#E8E6DF] pb-3">
              <h2 className="font-serif font-bold text-lg text-[#142B45]">
                Inventaire de Migration : Site Historique vs Prototype
              </h2>
              <p className="text-xs text-[#6B7280]">
                Rapprochement exhaustif entre les sources officielles (BCE / www.fidcogest.be) et les données du prototype.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#F8F7F4] text-[#142B45] border-b border-[#E8E6DF]">
                    <th className="p-3">Champ / Information</th>
                    <th className="p-3">Source Historique Vérifiée (BCE &amp; Site)</th>
                    <th className="p-3">Ancien Prototype (Placeholder)</th>
                    <th className="p-3">Statut de Traitement</th>
                    <th className="p-3">Observations</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E8E6DF]">
                  {draftConfig.divergenceAudit?.map((item, idx) => (
                    <tr key={idx} className="hover:bg-[#FCFBF9]">
                      <td className="p-3 font-semibold text-[#142B45]">{item.field}</td>
                      <td className="p-3 font-mono text-[#1F2937] bg-emerald-50/50">{item.sourceHistorique}</td>
                      <td className="p-3 text-[#6B7280] line-through">{item.valeurPrototype}</td>
                      <td className="p-3">
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-[#142B45] text-[#B79661]">
                          {item.statut}
                        </span>
                      </td>
                      <td className="p-3 text-[#4B5563]">{item.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Identité & Coordonnées */}
      {activeTab === 'identity' && (
        <div className="cabinet-card p-8 space-y-6">
          <div className="border-b border-[#E8E6DF] pb-3">
            <h2 className="font-serif font-bold text-lg text-[#142B45]">
              Coordonnées et Identité Légale
            </h2>
            <p className="text-xs text-[#6B7280]">
              Ces informations sont affichées dans l'en-tête, le pied de page, les mentions légales et le formulaire de contact.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-semibold text-[#142B45] mb-1">Dénomination Sociale</label>
              <input
                type="text"
                value={draftConfig.cabinet.name}
                onChange={(e) => setDraftConfig({
                  ...draftConfig,
                  cabinet: { ...draftConfig.cabinet, name: e.target.value }
                })}
                className="cabinet-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#142B45] mb-1">Numéro BCE &amp; TVA</label>
              <input
                type="text"
                value={draftConfig.cabinet.vatNumber}
                onChange={(e) => setDraftConfig({
                  ...draftConfig,
                  cabinet: { ...draftConfig.cabinet, vatNumber: e.target.value, bceNumber: e.target.value }
                })}
                className="cabinet-input font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#142B45] mb-1">Identifiant Peppol B2B</label>
              <input
                type="text"
                value={draftConfig.cabinet.peppolIdentifier}
                onChange={(e) => setDraftConfig({
                  ...draftConfig,
                  cabinet: { ...draftConfig.cabinet, peppolIdentifier: e.target.value }
                })}
                className="cabinet-input font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#142B45] mb-1">Téléphone Fixe</label>
              <input
                type="text"
                value={draftConfig.cabinet.phone}
                onChange={(e) => setDraftConfig({
                  ...draftConfig,
                  cabinet: { ...draftConfig.cabinet, phone: e.target.value }
                })}
                className="cabinet-input font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#142B45] mb-1">Téléphone Mobile (GSM)</label>
              <input
                type="text"
                value={draftConfig.cabinet.mobile}
                onChange={(e) => setDraftConfig({
                  ...draftConfig,
                  cabinet: { ...draftConfig.cabinet, mobile: e.target.value }
                })}
                className="cabinet-input font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#142B45] mb-1">Email Officiel Direction</label>
              <input
                type="email"
                value={draftConfig.cabinet.email}
                onChange={(e) => setDraftConfig({
                  ...draftConfig,
                  cabinet: { ...draftConfig.cabinet, email: e.target.value }
                })}
                className="cabinet-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#142B45] mb-1">Email Secrétariat</label>
              <input
                type="email"
                value={draftConfig.cabinet.secondaryEmail}
                onChange={(e) => setDraftConfig({
                  ...draftConfig,
                  cabinet: { ...draftConfig.cabinet, secondaryEmail: e.target.value }
                })}
                className="cabinet-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#142B45] mb-1">Adresse Siège Social</label>
              <input
                type="text"
                value={draftConfig.cabinet.headquarters.address}
                onChange={(e) => setDraftConfig({
                  ...draftConfig,
                  cabinet: {
                    ...draftConfig.cabinet,
                    headquarters: { ...draftConfig.cabinet.headquarters, address: e.target.value }
                  }
                })}
                className="cabinet-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#142B45] mb-1">Code Postal &amp; Ville</label>
              <input
                type="text"
                value={`${draftConfig.cabinet.headquarters.postalCode} ${draftConfig.cabinet.headquarters.city}`}
                onChange={(e) => {
                  const parts = e.target.value.split(' ');
                  const postalCode = parts[0] || '1083';
                  const city = parts.slice(1).join(' ') || 'Ganshoren';
                  setDraftConfig({
                    ...draftConfig,
                    cabinet: {
                      ...draftConfig.cabinet,
                      headquarters: { ...draftConfig.cabinet.headquarters, postalCode, city }
                    }
                  });
                }}
                className="cabinet-input"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Équipe & Direction */}
      {activeTab === 'team' && (
        <div className="space-y-6">
          <div className="cabinet-card p-8 space-y-6">
            <div className="border-b border-[#E8E6DF] pb-3">
              <h2 className="font-serif font-bold text-lg text-[#142B45]">
                Gérant &amp; Membres de l'Équipe
              </h2>
              <p className="text-xs text-[#6B7280]">
                Mettez à jour les profils, biographies et domaines de spécialisation des collaborateurs.
              </p>
            </div>

            <div className="space-y-6">
              {draftConfig.team.map((member, idx) => (
                <div key={member.id} className="p-5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#142B45] mb-1">Nom complet</label>
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => {
                          const updated = [...draftConfig.team];
                          updated[idx].name = e.target.value;
                          setDraftConfig({ ...draftConfig, team: updated });
                        }}
                        className="cabinet-input"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-[#142B45] mb-1">Rôle / Titre officiel</label>
                      <input
                        type="text"
                        value={member.role}
                        onChange={(e) => {
                          const updated = [...draftConfig.team];
                          updated[idx].role = e.target.value;
                          setDraftConfig({ ...draftConfig, team: updated });
                        }}
                        className="cabinet-input"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#142B45] mb-1">Biographie professionnelle</label>
                    <textarea
                      rows={3}
                      value={member.bio}
                      onChange={(e) => {
                        const updated = [...draftConfig.team];
                        updated[idx].bio = e.target.value;
                        setDraftConfig({ ...draftConfig, team: updated });
                      }}
                      className="cabinet-input"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Les 7 Pôles de Services */}
      {activeTab === 'services' && (
        <div className="cabinet-card p-8 space-y-6">
          <div className="border-b border-[#E8E6DF] pb-3">
            <h2 className="font-serif font-bold text-lg text-[#142B45]">
              Descriptions des 7 Pôles de Services Historiques
            </h2>
            <p className="text-xs text-[#6B7280]">
              Ces descriptions enrichissent la page /services et les sous-pages spécialisées.
            </p>
          </div>

          <div className="space-y-6">
            {draftConfig.services.map((service, idx) => (
              <div key={service.id} className="p-5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif font-bold text-base text-[#142B45]">{service.title}</h3>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-white border border-[#E8E6DF] text-[#B79661]">
                    {service.id}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B45] mb-1">Accroche / Sous-titre</label>
                  <input
                    type="text"
                    value={service.tagline || ''}
                    onChange={(e) => {
                      const updated = [...draftConfig.services];
                      updated[idx].tagline = e.target.value;
                      setDraftConfig({ ...draftConfig, services: updated });
                    }}
                    className="cabinet-input"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#142B45] mb-1">Description détaillée</label>
                  <textarea
                    rows={2}
                    value={service.description}
                    onChange={(e) => {
                      const updated = [...draftConfig.services];
                      updated[idx].description = e.target.value;
                      setDraftConfig({ ...draftConfig, services: updated });
                    }}
                    className="cabinet-input"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: Textes & Accueil */}
      {activeTab === 'presentation' && (
        <div className="cabinet-card p-8 space-y-6">
          <div className="border-b border-[#E8E6DF] pb-3">
            <h2 className="font-serif font-bold text-lg text-[#142B45]">
              Textes d'Accueil et Piliers Déontologiques
            </h2>
            <p className="text-xs text-[#6B7280]">
              Adaptez le titre principal, les années d'expérience et les arguments d'autorité du cabinet.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#142B45] mb-1">Titre de Présentation</label>
              <input
                type="text"
                value={draftConfig.presentationCabinet.title}
                onChange={(e) => setDraftConfig({
                  ...draftConfig,
                  presentationCabinet: { ...draftConfig.presentationCabinet, title: e.target.value }
                })}
                className="cabinet-input font-serif"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#142B45] mb-1">Sous-titre / Promesse</label>
              <input
                type="text"
                value={draftConfig.presentationCabinet.subtitle}
                onChange={(e) => setDraftConfig({
                  ...draftConfig,
                  presentationCabinet: { ...draftConfig.presentationCabinet, subtitle: e.target.value }
                })}
                className="cabinet-input"
              />
            </div>

            <div className="pt-2">
              <h4 className="text-xs font-semibold text-[#142B45] uppercase tracking-wider mb-2">
                Piliers de Confiance du Cabinet
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {draftConfig.presentationCabinet.piliers?.map((pilier, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-[#F7F6F2] border border-[#E8E6DF] space-y-2">
                    <input
                      type="text"
                      value={pilier.titre}
                      onChange={(e) => {
                        const updated = [...draftConfig.presentationCabinet.piliers];
                        updated[idx].titre = e.target.value;
                        setDraftConfig({
                          ...draftConfig,
                          presentationCabinet: { ...draftConfig.presentationCabinet, piliers: updated }
                        });
                      }}
                      className="cabinet-input text-xs font-bold"
                    />
                    <textarea
                      rows={2}
                      value={pilier.texte}
                      onChange={(e) => {
                        const updated = [...draftConfig.presentationCabinet.piliers];
                        updated[idx].texte = e.target.value;
                        setDraftConfig({
                          ...draftConfig,
                          presentationCabinet: { ...draftConfig.presentationCabinet, piliers: updated }
                        });
                      }}
                      className="cabinet-input text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
