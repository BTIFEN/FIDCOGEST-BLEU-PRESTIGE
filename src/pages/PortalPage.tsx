import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePortal } from '../context/PortalContext';
import { PortalDocument, UserRole } from '../types/portal';
import { ClientPortalView } from '../components/portal/ClientPortalView';
import { ManagerCockpitView } from '../components/portal/ManagerCockpitView';
import { AdminSecurityView } from '../components/portal/AdminSecurityView';
import { DocumentPreviewModal } from '../components/portal/DocumentPreviewModal';
import { MissingRequestModal } from '../components/portal/MissingRequestModal';
import { AuthLoginModal } from '../components/portal/AuthLoginModal';
import { ValidationSuiteModal } from '../components/portal/ValidationSuiteModal';
import {
  ShieldCheck,
  Building,
  User,
  LogOut,
  Lock,
  Play,
  ArrowLeft,
  ChevronRight,
  Briefcase,
  Users,
  Settings,
  HelpCircle,
  FileText
} from 'lucide-react';

export const PortalPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentUser,
    setCurrentUser,
    users,
    companies,
    activeCompany,
    setActiveCompanyId,
    logout
  } = usePortal();

  // Modals state
  const [previewingDoc, setPreviewingDoc] = useState<PortalDocument | null>(null);
  const [missingModalOpen, setMissingModalOpen] = useState<boolean>(false);
  const [targetDocForMissing, setTargetDocForMissing] = useState<PortalDocument | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [validationSuiteOpen, setValidationSuiteOpen] = useState<boolean>(false);

  // For Admin or Supervisor: switch between views (Client perspective, Manager Cockpit, or Admin)
  const [viewPerspective, setViewPerspective] = useState<'default' | 'client_preview' | 'manager_preview'>('default');

  const handleRoleChange = (roleOrUserId: string) => {
    const found = users.find((u) => u.id === roleOrUserId);
    if (found) {
      setCurrentUser(found);
      setViewPerspective('default');
    }
  };

  const handleOpenMissingModal = (doc?: PortalDocument) => {
    setTargetDocForMissing(doc || null);
    setMissingModalOpen(true);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#F7F6F2] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl border border-[#E8E6DF] shadow-xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-xl bg-[#142B45] text-[#F3D085] flex items-center justify-center mx-auto">
            <Lock className="w-6 h-6 text-[#F3D085]" />
          </div>
          <h3 className="font-serif font-bold text-xl text-[#142B45]">Espace Sécurisé Fidcogest</h3>
          <p className="text-xs text-[#4B5563]">Veuillez vous authentifier avec double facteur (MFA) pour accéder à vos dossiers comptables.</p>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="cabinet-btn-primary w-full text-xs justify-center py-2.5 font-bold cursor-pointer shadow-sm"
          >
            Se connecter / Double Authentification →
          </button>
          <div className="pt-2 border-t border-[#E8E6DF]">
            <Link
              to="/"
              className="text-xs text-[#142B45] hover:text-[#B79661] font-semibold underline flex items-center justify-center gap-1.5"
            >
              ← Retourner au site vitrine FIDCOGEST
            </Link>
          </div>
          <AuthLoginModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#1F2937] flex flex-col font-sans">
      
      {/* Top Professional Header Bar */}
      <header className="bg-[#142B45] text-white border-b border-[#1D3B5C] sticky top-0 z-40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-4">
          
          {/* Logo & Platform Name */}
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="flex items-center gap-2 group text-xs text-[#E2E8F0] hover:text-[#F3D085] transition-colors pr-3 border-r border-white/20"
              title="Retourner au site vitrine FIDCOGEST"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="hidden sm:inline">Site Vitrine</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="font-serif font-black text-lg sm:text-xl text-[#F3D085] tracking-wider">
                FIDCOGEST
              </span>
              <span className="text-white/40">|</span>
              <span className="text-xs sm:text-sm font-semibold tracking-wide text-white">
                Plateforme Documentaire V1
              </span>
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/10 text-[#F3D085] border border-white/20 ml-1">
                <ShieldCheck className="w-3 h-3 text-[#F3D085]" /> Secret ITAA
              </span>
            </div>
          </div>

          {/* Quick Role Switcher Toolbar (DEMO & TEST ENGINE) */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            {/* Validation Suite Button - STRICTEMENT ISOLÉ AU RÔLE ADMIN CABINET */}
            {currentUser.role === 'admin' && (
              <button
                onClick={() => setValidationSuiteOpen(true)}
                className="px-2.5 py-1.5 rounded-lg bg-[#B79661] hover:bg-[#C5A059] text-[#142B45] text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                title="Banc d'Essai & Recette Technique Interne (Réservé Administration)"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span className="hidden lg:inline">Banc d'Essai (Admin)</span>
                <span className="lg:hidden">Tests</span>
              </button>
            )}

            {/* Role Switcher Dropdown */}
            <div className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-lg px-2.5 py-1 text-xs">
              <User className="w-3.5 h-3.5 text-[#F3D085]" />
              <span className="text-[#E2E8F0] hidden sm:inline">Rôle actif :</span>
              <select
                value={currentUser.id}
                onChange={(e) => handleRoleChange(e.target.value)}
                className="bg-transparent text-white font-bold text-xs cursor-pointer outline-none border-none pr-1"
              >
                <option value="usr-client-1" className="text-[#142B45]">
                  👤 Client : Marie Vandamme (SRL Louise &amp; Ganshoren)
                </option>
                <option value="usr-client-2" className="text-[#142B45]">
                  👤 Client : Philippe De Smet (BVBA TechConsult)
                </option>
                <option value="usr-manager-1" className="text-[#142B45]">
                  👔 Gestionnaire : Sarah Benali
                </option>
                <option value="usr-supervisor-1" className="text-[#142B45]">
                  ⚖️ Superviseur : Paul Holl Mpeck (ITAA)
                </option>
                <option value="usr-admin-1" className="text-[#142B45]">
                  🛡️ Admin Cabinet : Fidcogest Direction
                </option>
              </select>
            </div>

            {/* Login / Switch Account Button */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
              title="Connexion par identifiants & MFA"
            >
              <Lock className="w-4 h-4 text-[#F3D085]" />
            </button>
          </div>
        </div>
      </header>

      {/* Perspective sub-bar for Admin or Supervisors */}
      {(currentUser.role === 'admin' || currentUser.role === 'supervisor') && (
        <div className="bg-[#FAF9F6] border-b border-[#E8E6DF] px-4 sm:px-6 py-2 text-xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-2">
            <span className="text-[#4B5563] flex items-center gap-1.5">
              <Settings className="w-3.5 h-3.5 text-[#B79661]" />
              Mode Superviseur actif — Basculer de vue :
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewPerspective('default')}
                className={`px-3 py-1 rounded-lg font-semibold cursor-pointer transition-all ${
                  viewPerspective === 'default'
                    ? 'bg-[#142B45] text-white shadow-xs'
                    : 'bg-white border border-[#E8E6DF] text-[#4B5563] hover:text-[#142B45]'
                }`}
              >
                {currentUser.role === 'admin' ? 'Administration & RGPD' : 'Cockpit Gestionnaire'}
              </button>
              <button
                onClick={() => setViewPerspective('manager_preview')}
                className={`px-3 py-1 rounded-lg font-semibold cursor-pointer transition-all ${
                  viewPerspective === 'manager_preview'
                    ? 'bg-[#142B45] text-white shadow-xs'
                    : 'bg-white border border-[#E8E6DF] text-[#4B5563] hover:text-[#142B45]'
                }`}
              >
                Cockpit Gestionnaire Complet
              </button>
              <button
                onClick={() => setViewPerspective('client_preview')}
                className={`px-3 py-1 rounded-lg font-semibold cursor-pointer transition-all ${
                  viewPerspective === 'client_preview'
                    ? 'bg-[#142B45] text-white shadow-xs'
                    : 'bg-white border border-[#E8E6DF] text-[#4B5563] hover:text-[#142B45]'
                }`}
              >
                Vue Espace Client (Dépôt épuré)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main View Area */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8 flex-1">
        {/* Render View based on active role and perspective */}
        {viewPerspective === 'client_preview' || currentUser.role === 'client' ? (
          <ClientPortalView
            onPreviewDocument={(doc) => setPreviewingDoc(doc)}
          />
        ) : viewPerspective === 'manager_preview' || currentUser.role === 'manager' || currentUser.role === 'supervisor' ? (
          <ManagerCockpitView
            onPreviewDocument={(doc) => setPreviewingDoc(doc)}
            onRequestMissingDocument={handleOpenMissingModal}
          />
        ) : (
          <AdminSecurityView />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E8E6DF] bg-white py-4 px-6 text-xs text-[#6B7280]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            © 2026 FIDCOGEST SRL • Expert-comptable &amp; Conseil fiscal certifié ITAA n° 50.812.390
          </div>
          <div className="flex items-center gap-4 text-[#4B5563]">
            <span>Chiffrement TLS 256-bit</span>
            <span>•</span>
            <span>Stockage Privé Hostinger &amp; WordPress Bridge</span>
            <span>•</span>
            <span>Bruxelles (Ganshoren)</span>
          </div>
        </div>
      </footer>

      {/* MODALS */}
      <DocumentPreviewModal
        document={previewingDoc}
        onClose={() => setPreviewingDoc(null)}
        onRequestMissing={(doc) => {
          setPreviewingDoc(null);
          handleOpenMissingModal(doc);
        }}
      />

      <MissingRequestModal
        isOpen={missingModalOpen}
        onClose={() => {
          setMissingModalOpen(false);
          setTargetDocForMissing(null);
        }}
        targetDocument={targetDocForMissing}
      />

      <AuthLoginModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />

      <ValidationSuiteModal
        isOpen={validationSuiteOpen}
        onClose={() => setValidationSuiteOpen(false)}
      />

    </div>
  );
};
