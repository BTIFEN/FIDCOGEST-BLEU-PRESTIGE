import React, { useState } from 'react';
import { usePortal } from '../../context/PortalContext';
import { Lock, ShieldCheck, Key, ArrowRight, CheckCircle2, User, RefreshCw, X, ShieldAlert, Smartphone } from 'lucide-react';

interface AuthLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthLoginModal: React.FC<AuthLoginModalProps> = ({ isOpen, onClose }) => {
  const {
    loginWithPassword,
    verifyMfa,
    acceptInvitation,
    completeInvitationMfa,
    isAuthenticated,
    currentUser,
    logout
  } = usePortal();

  // Mode: 'login' | 'mfa' | 'recovery' | 'invite'
  const [authMode, setAuthMode] = useState<'login' | 'mfa' | 'recovery' | 'invite' | 'invite-mfa'>('login');

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [challengeToken, setChallengeToken] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState<string>('');
  const [recoveryCode, setRecoveryCode] = useState<string>('');
  const [inviteToken, setInviteToken] = useState<string>('');
  const [invitePassword, setInvitePassword] = useState<string>('');
  const [enrollmentToken, setEnrollmentToken] = useState<string | null>(null);
  const [enrollmentSecret, setEnrollmentSecret] = useState<string>('');
  const [enrollmentUri, setEnrollmentUri] = useState<string>('');
  const [invitationRecoveryCodes, setInvitationRecoveryCodes] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  React.useEffect(() => {
    if (!isOpen) {
      setEmail(''); setPassword(''); setTotpCode('');
      setRecoveryCode(''); setInviteToken(''); setChallengeToken(null); setInvitePassword('');
      setEnrollmentToken(null); setEnrollmentSecret(''); setEnrollmentUri(''); setInvitationRecoveryCodes([]);
      setErrorMsg(null); setAuthMode('login');
    }
  }, [isOpen]);

  React.useEffect(() => {
    if (isOpen) {
      const token = new URLSearchParams(window.location.search).get('invite');
      if (token) { setInviteToken(token); setAuthMode('invite'); }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInitialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const result = await loginWithPassword(email.trim(), password);
      if (result.error) {
        setErrorMsg(result.error);
        setIsLoading(false);
        return;
      }

      if (result.requireMfa && result.challengeToken) {
        setChallengeToken(result.challengeToken);
        setAuthMode('mfa');
      } else {
        onClose();
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la tentative de connexion.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAcceptInvitation = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const result = await acceptInvitation(inviteToken.trim(), invitePassword);
      if (result.error) { setErrorMsg(result.error); return; }
      setEnrollmentToken(result.enrollmentToken || null);
      setEnrollmentSecret(result.secretBase32 || '');
      setEnrollmentUri(result.otpauthUri || '');
      setInvitationRecoveryCodes(result.recoveryCodes || []);
      setTotpCode('');
      setAuthMode('invite-mfa');
    } catch (err: any) {
      setErrorMsg(err.message || 'Activation impossible.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCompleteInvitationMfa = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enrollmentToken) return;
    setErrorMsg(null);
    setIsLoading(true);
    try {
      const result = await completeInvitationMfa(enrollmentToken, totpCode.trim());
      if (result.success) onClose();
      else setErrorMsg(result.error || 'Code MFA invalide.');
    } catch (err: any) {
      setErrorMsg(err.message || 'Activation MFA impossible.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyTotp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeToken) return;
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const result = await verifyMfa(challengeToken, totpCode.trim(), undefined);
      if (result.success) {
        onClose();
      } else {
        setErrorMsg(result.error || 'Code TOTP invalide ou expiré.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Échec de vérification.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyRecoveryCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!challengeToken) return;
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const result = await verifyMfa(challengeToken, undefined, recoveryCode.trim());
      if (result.success) {
        onClose();
      } else {
        setErrorMsg(result.error || 'Code de secours invalide ou déjà consommé.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Échec de vérification.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-md rounded-2xl bg-white border border-[#E8E6DF] shadow-2xl p-6 sm:p-8 modal-white-card space-y-5 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#E8E6DF] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#142B45] text-[#F3D085] flex items-center justify-center font-bold shadow-xs">
              <Lock className="w-5 h-5 text-[#F3D085]" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-lg text-[#142B45]">
                {authMode === 'mfa'
                  ? 'Double Authentification (TOTP RFC 6238)'
                  : authMode === 'recovery'
                  ? 'Code de Secours d’Urgence'
                  : authMode === 'invite' || authMode === 'invite-mfa'
                  ? authMode === 'invite' ? 'Activation de Compte' : 'Configuration MFA'
                  : 'Connexion Espace Sécurisé'}
              </h4>
              <p className="text-xs text-[#4B5563]">
                Cabinet Fidcogest • Chiffrement AES-256-GCM &amp; Sessions Protégées
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

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        {/* MODE 1: LOGIN FORM */}
        {authMode === 'login' && (
          <form onSubmit={handleInitialLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-[#142B45] mb-1">
                Adresse e-mail professionnelle :
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="cabinet-input w-full"
                placeholder="nom@entreprise.be"
              />
            </div>

            <div>
              <label className="block font-semibold text-[#142B45] mb-1">
                Mot de passe :
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="cabinet-input w-full"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="cabinet-btn-primary w-full text-xs justify-center py-2.5 shadow-sm font-bold flex items-center gap-2"
            >
              {isLoading ? 'Vérification en cours...' : 'Suivant : Défi MFA Conforme RFC 6238 →'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => setAuthMode('invite')}
                className="text-xs text-[#B79661] hover:underline font-semibold"
              >
                Activer mon compte avec un jeton d'invitation cabinet
              </button>
            </div>
          </form>
        )}

        {/* MODE 2: MFA CHALLENGE (TOTP RFC 6238) */}
        {authMode === 'mfa' && (
          <form onSubmit={handleVerifyTotp} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-[#FAF9F6] border border-[#E8E6DF] space-y-2 text-center">
              <Smartphone className="w-6 h-6 text-[#B79661] mx-auto" />
              <div className="font-bold text-[#142B45] text-sm">
                Code TOTP de votre application d’authentification
              </div>
              <p className="text-xs text-[#4B5563]">
                Consultez Google Authenticator, Microsoft Authenticator ou 1Password. Le code change toutes les 30 secondes.
              </p>
              

            </div>

            <div>
              <label className="block font-semibold text-[#142B45] mb-1 text-center">
                Saisissez le code à 6 chiffres :
              </label>
              <input
                type="text"
                maxLength={6}
                required
                autoFocus
                placeholder="000000"
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
                className="cabinet-input w-full text-center font-mono text-xl tracking-widest font-bold"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="cabinet-btn-secondary text-xs py-2 px-3 flex-1"
              >
                Retour
              </button>
              <button
                type="submit"
                disabled={isLoading || totpCode.length !== 6}
                className="cabinet-btn-primary text-xs py-2 px-4 flex-2 font-bold shadow-sm"
              >
                {isLoading ? 'Validation...' : 'Valider & Ouvrir ma Session →'}
              </button>
            </div>

            <div className="text-center pt-1 border-t border-[#E8E6DF]">
              <button
                type="button"
                onClick={() => setAuthMode('recovery')}
                className="text-xs text-[#B79661] hover:underline font-semibold"
              >
                Téléphone indisponible ? Utiliser un code de secours d'urgence
              </button>
            </div>
          </form>
        )}

        {/* MODE 3: EMERGENCY RECOVERY CODE */}
        {authMode === 'recovery' && (
          <form onSubmit={handleVerifyRecoveryCode} className="space-y-4 text-xs">
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 space-y-1.5 text-center text-amber-900">
              <ShieldAlert className="w-6 h-6 text-amber-700 mx-auto" />
              <div className="font-bold text-sm">
                Code de Secours à Usage Unique
              </div>
              <p className="text-xs text-amber-800">
                Saisissez l’un de vos codes de secours à 8 caractères générés lors de la configuration de votre compte.
              </p>
            </div>

            <div>
              <label className="block font-semibold text-[#142B45] mb-1 text-center">
                Code de récupération (8 caractères hexadécimaux) :
              </label>
              <input
                type="text"
                maxLength={8}
                required
                autoFocus
                placeholder="A1B2C3D4"
                value={recoveryCode}
                onChange={(e) => setRecoveryCode(e.target.value.toUpperCase())}
                className="cabinet-input w-full text-center font-mono text-lg tracking-widest font-bold uppercase"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAuthMode('mfa')}
                className="cabinet-btn-secondary text-xs py-2 px-3 flex-1"
              >
                Retour au TOTP
              </button>
              <button
                type="submit"
                disabled={isLoading || recoveryCode.length < 6}
                className="cabinet-btn-primary text-xs py-2 px-4 flex-2 font-bold shadow-sm"
              >
                {isLoading ? 'Vérification...' : 'Valider Code de Secours →'}
              </button>
            </div>
          </form>
        )}

        {/* MODE 4: INVITE ACTIVATION */}
        {authMode === 'invite' && (
          <form onSubmit={handleAcceptInvitation} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="block font-semibold text-[#142B45]">Jeton d’invitation :</label>
              <input
                type="text"
                required
                value={inviteToken}
                onChange={(e) => setInviteToken(e.target.value)}
                className="cabinet-input w-full font-mono text-center text-xs"
              />
            </div>
            <div className="space-y-1">
              <label className="block font-semibold text-[#142B45]">Créer un mot de passe (12 caractères minimum) :</label>
              <input
                type="password"
                required
                minLength={12}
                maxLength={200}
                autoComplete="new-password"
                value={invitePassword}
                onChange={(e) => setInvitePassword(e.target.value)}
                className="cabinet-input w-full"
              />
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => setAuthMode('login')} className="cabinet-btn-secondary text-xs py-2 px-3 flex-1">Retour</button>
              <button type="submit" disabled={isLoading} className="cabinet-btn-primary text-xs py-2 px-4 flex-2 font-bold shadow-sm">
                {isLoading ? 'Vérification...' : 'Configurer le MFA →'}
              </button>
            </div>
          </form>
        )}

        {authMode === 'invite-mfa' && (
          <form onSubmit={handleCompleteInvitationMfa} className="space-y-4 text-xs">
            <p className="text-[#4B5563]">Ajoutez cette clé à votre application d’authentification. Les codes de secours ne seront affichés qu’ici.</p>
            <div className="rounded-lg bg-[#FAF9F6] border border-[#E8E6DF] p-3 space-y-2">
              <div><strong>Clé TOTP :</strong> <code className="break-all">{enrollmentSecret}</code></div>
              <div><strong>URI d’enrôlement :</strong> <code className="break-all">{enrollmentUri}</code></div>
              <div><strong>Codes de secours :</strong> <code className="break-all">{invitationRecoveryCodes.join(' · ')}</code></div>
            </div>
            <label className="block font-semibold text-[#142B45]">Saisissez le code à 6 chiffres pour confirmer :</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              required
              value={totpCode}
              onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ''))}
              className="cabinet-input w-full text-center font-mono text-xl tracking-widest font-bold"
            />
            <button type="submit" disabled={isLoading || totpCode.length !== 6} className="cabinet-btn-primary w-full justify-center">
              {isLoading ? 'Validation...' : 'Confirmer et activer le compte'}
            </button>
          </form>
        )}


      </div>
    </div>
  );
};
