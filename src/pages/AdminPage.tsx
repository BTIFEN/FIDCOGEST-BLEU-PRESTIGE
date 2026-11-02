import React, { useState } from 'react';
import { useCabinet } from '../context/CabinetContext';
import { Lock, ShieldCheck, CheckCircle2, AlertTriangle, Save, RefreshCw, Eye, Edit3, Building, Users, Briefcase, FileText, Info } from 'lucide-react';
import { CabinetConfig } from '../types';

export const AdminPage: React.FC = () => {
  const { config, updateConfig, refreshConfig } = useCabinet();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!sessionStorage.getItem('fidcogest_admin_token');
  });

  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'audit' | 'identity' | 'team' | 'services' | 'presentation'>('audit');

  // Local working copy of editable config
  const [draftConfig, setDraftConfig] = useState<CabinetConfig>(config);
  const [saveStatus, setSaveStatus] = useState<{ loading: boolean; success?: boolean; error?: string }>({
    loading: false
  });

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
      } else {
        setAuthError('Mot de passe administrateur incorrect.');
      }
    } catch (err) {
      setAuthError('Erreur de connexion au serveur.');
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
              Espace de gestion des données légales, des contenus et de l'audit de migration.
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
                placeholder="Entrez le mot de passe d'administration..."
                className="cabinet-input"
              />
              <span className="text-[11px] text-[#6B7280] block mt-1">
                Mot de passe par défaut : <code>fidcogest2026</code>
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
              <span className="cabinet-badge-itaa text-[10px]">Session Active</span>
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
          { key: 'audit', label: '1. Audit & Divergences', icon: Info },
          { key: 'identity', label: '2. Identité & Coordonnées', icon: Building },
          { key: 'team', label: '3. Équipe & Direction', icon: Users },
          { key: 'services', label: '4. Les 7 Pôles de Services', icon: Briefcase },
          { key: 'presentation', label: '5. Textes & Accueil', icon: FileText }
        ].map((t) => {
          const Icon = t.icon;
          const isActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key as any)}
              className={`px-4 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all ${
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

      {/* TAB 1: Audit & Divergences */}
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
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-[#142B45] text-[#B79661]">
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
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white border border-[#E8E6DF] text-[#B79661]">
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
