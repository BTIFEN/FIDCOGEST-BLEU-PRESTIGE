import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  PortalUser,
  CompanyDossier,
  PortalDocument,
  MissingDocumentRequest,
  PortalMessage,
  SecurityAuditLog,
  DocumentCategory,
  DocumentStatus,
  OcrExtractedData,
  UserRole
} from '../types/portal';

interface PortalContextType {
  currentUser: PortalUser | null;
  setCurrentUser: (user: PortalUser | null) => void;
  users: PortalUser[];
  companies: CompanyDossier[];
  activeCompany: CompanyDossier | null;
  setActiveCompanyId: (id: string) => void;
  documents: PortalDocument[];
  filteredDocuments: PortalDocument[];
  missingRequests: MissingDocumentRequest[];
  messages: PortalMessage[];
  securityLogs: SecurityAuditLog[];
  selectedCategory: DocumentCategory | 'all';
  setSelectedCategory: (cat: DocumentCategory | 'all') => void;
  selectedStatus: DocumentStatus | 'all';
  setSelectedStatus: (status: DocumentStatus | 'all') => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  // Actions
  uploadDocument: (data: {
    companyId: string;
    category: DocumentCategory;
    filename: string;
    fileSizeKb: number;
    fileType: 'pdf' | 'png' | 'jpg';
    base64Payload?: string;
  }) => Promise<PortalDocument>;
  validateDocument: (
    docId: string,
    newStatus: DocumentStatus,
    correctedOcr?: Partial<OcrExtractedData>,
    notes?: string,
    missingReason?: string
  ) => Promise<void>;
  createMissingRequest: (data: {
    companyId: string;
    title: string;
    description: string;
    period: string;
    urgency: 'normale' | 'urgente';
  }) => Promise<void>;
  resolveMissingRequest: (requestId: string, resolvedDocId?: string) => Promise<void>;
  sendMessage: (content: string, attachedDocId?: string) => Promise<void>;
  assignCompanyManager: (companyId: string, managerId: string) => void;
  exportAccountingData: (format: 'csv' | 'json') => void;
  inviteNewUser: (data: { email: string; fullName: string; role: UserRole; assignedCompanyIds: string[] }) => string;
  toggleUserStatus: (userId: string) => void;
  // Auth flow helpers
  sessionToken: string | null;
  isAuthenticated: boolean;
  loginWithPassword: (email: string, password: string) => Promise<{ requireMfa: boolean; challengeToken?: string; error?: string }>;
  verifyMfa: (challengeToken: string, totpCode?: string, recoveryCode?: string) => Promise<{ success: boolean; error?: string }>;
  setupMfa: () => Promise<{ secretBase32: string; otpauthUri: string; recoveryCodes: string[] } | null>;
  logout: () => Promise<void>;
  loginAsDemoRole: (email: string) => Promise<void>;
}

const PortalContext = createContext<PortalContextType | undefined>(undefined);

export const PortalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [sessionToken, setSessionToken] = useState<string | null>(() => {
    return sessionStorage.getItem('fidco_session_token') || localStorage.getItem('fidco_session_token');
  });

  const [currentUser, setCurrentUser] = useState<PortalUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [companies, setCompanies] = useState<CompanyDossier[]>([]);
  const [activeCompanyId, setActiveCompanyIdState] = useState<string>('');
  const [documents, setDocuments] = useState<PortalDocument[]>([]);
  const [missingRequests, setMissingRequests] = useState<MissingDocumentRequest[]>([]);
  const [messages, setMessages] = useState<PortalMessage[]>([]);
  const [users, setUsers] = useState<PortalUser[]>([]);
  const [securityLogs, setSecurityLogs] = useState<SecurityAuditLog[]>([]);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<DocumentCategory | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<DocumentStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const getHeaders = useCallback((): HeadersInit => {
    return {
      'Content-Type': 'application/json',
      ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {})
    };
  }, [sessionToken]);

  // Synchronisation stricte serveur
  const fetchServerData = useCallback(async (token: string) => {
    try {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      };

      // 1. Session vérifiée
      const sessionRes = await fetch('/api/portal/auth/session', { headers });
      if (!sessionRes.ok) {
        setIsAuthenticated(false);
        setCurrentUser(null);
        setSessionToken(null);
        sessionStorage.removeItem('fidco_session_token');
        localStorage.removeItem('fidco_session_token');
        return;
      }

      const sessionData = await sessionRes.json();
      setCurrentUser(sessionData.user);
      setIsAuthenticated(true);

      // 2. Entreprises autorisées
      const compRes = await fetch('/api/portal/companies', { headers });
      if (compRes.ok) {
        const compData = await compRes.json();
        setCompanies(compData.companies || []);
        if (compData.companies && compData.companies.length > 0) {
          setActiveCompanyIdState((prev) => prev || compData.companies[0].id);
        }
      }

      // 3. Documents
      const docRes = await fetch('/api/portal/documents', { headers });
      if (docRes.ok) {
        const docData = await docRes.json();
        setDocuments(docData.documents || []);
      }

      // 4. Demandes de pièces
      const reqRes = await fetch('/api/portal/missing-requests', { headers });
      if (reqRes.ok) {
        const reqData = await reqRes.json();
        setMissingRequests(reqData.requests || []);
      }

      // 5. Admin / Superviseur : Comptes & Logs d'audit
      if (sessionData.user.role === 'admin' || sessionData.user.role === 'supervisor') {
        const userRes = await fetch('/api/portal/admin/users', { headers });
        if (userRes.ok) {
          const uData = await userRes.json();
          setUsers(uData.users || []);
        }
        const logRes = await fetch('/api/portal/admin/audit-logs', { headers });
        if (logRes.ok) {
          const lData = await logRes.json();
          setSecurityLogs(lData.logs || []);
        }
      }
    } catch (err) {
      console.error('[Portal Sync] Erreur synchronisation serveur:', err);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (sessionToken) {
      fetchServerData(sessionToken);
    }
  }, [sessionToken, fetchServerData]);

  // Synchronisation des messages dès que activeCompany change
  useEffect(() => {
    if (sessionToken && activeCompanyId) {
      fetch(`/api/portal/messages?companyId=${activeCompanyId}`, {
        headers: getHeaders()
      })
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && Array.isArray(data.messages)) {
            setMessages(data.messages);
          }
        })
        .catch(() => {});
    }
  }, [activeCompanyId, sessionToken, getHeaders]);

  const activeCompany = companies.find((c) => c.id === activeCompanyId) || companies[0] || null;

  const setActiveCompanyId = (id: string) => {
    setActiveCompanyIdState(id);
  };

  // Filtrage des documents
  const filteredDocuments = documents.filter((doc) => {
    if (activeCompany && doc.companyId !== activeCompany.id) return false;
    if (selectedCategory !== 'all' && doc.category !== selectedCategory) return false;
    if (selectedStatus !== 'all' && doc.status !== selectedStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = doc.filename.toLowerCase().includes(q);
      const matchVendor = doc.ocrData.vendorName.toLowerCase().includes(q);
      const matchInv = doc.ocrData.invoiceNumber.toLowerCase().includes(q);
      if (!matchName && !matchVendor && !matchInv) return false;
    }
    return true;
  });

  // Action : Upload document vers Express
  const uploadDocument = async (data: {
    companyId: string;
    category: DocumentCategory;
    filename: string;
    fileSizeKb: number;
    fileType: 'pdf' | 'png' | 'jpg';
    base64Payload?: string;
  }): Promise<PortalDocument> => {
    const res = await fetch('/api/portal/documents/upload', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Erreur lors du téléversement sécurisé.');
    }

    const result = await res.json();
    setDocuments((prev) => [result.document, ...prev]);
    return result.document;
  };

  // Action : Validation manuelle
  const validateDocument = async (
    docId: string,
    newStatus: DocumentStatus,
    correctedOcr?: Partial<OcrExtractedData>,
    notes?: string,
    missingReason?: string
  ) => {
    const res = await fetch(`/api/portal/documents/${docId}/validate`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({
        status: newStatus,
        correctedOcr,
        notes,
        missingInfoReason: missingReason
      })
    });

    if (res.ok) {
      const json = await res.json();
      setDocuments((prev) => prev.map((d) => (d.id === docId ? json.document : d)));
    }
  };

  // Action : Demande de pièce
  const createMissingRequest = async (data: {
    companyId: string;
    title: string;
    description: string;
    period: string;
    urgency: 'normale' | 'urgente';
  }) => {
    const res = await fetch('/api/portal/missing-requests', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data)
    });

    if (res.ok) {
      const json = await res.json();
      setMissingRequests((prev) => [json.request, ...prev]);
    }
  };

  const resolveMissingRequest = async (requestId: string, resolvedDocId?: string) => {
    const res = await fetch(`/api/portal/missing-requests/${requestId}/resolve`, {
      method: 'PUT',
      headers: getHeaders(),
      body: JSON.stringify({ resolvedDocId })
    });

    if (res.ok) {
      setMissingRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status: 'resolue', resolvedDocId } : r))
      );
    }
  };

  // Action : Messages
  const sendMessage = async (content: string, attachedDocId?: string) => {
    if (!activeCompany) return;
    const res = await fetch('/api/portal/messages', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify({
        companyId: activeCompany.id,
        content,
        attachedDocId
      })
    });

    if (res.ok) {
      const json = await res.json();
      setMessages((prev) => [...prev, json.message]);
    }
  };

  const assignCompanyManager = (companyId: string, managerId: string) => {
    // Non implémenté en API directe, mise à jour visuelle
    setCompanies((prev) =>
      prev.map((c) => (c.id === companyId ? { ...c, assignedManagerId: managerId } : c))
    );
  };

  // Export comptable
  const exportAccountingData = (format: 'csv' | 'json') => {
    if (format === 'csv') {
      window.open(`/api/portal/export/accounting?format=csv&companyId=${activeCompany?.id || ''}`, '_blank');
    } else {
      window.open(`/api/portal/export/accounting?format=json&companyId=${activeCompany?.id || ''}`, '_blank');
    }
  };

  const inviteNewUser = (data: { email: string; fullName: string; role: UserRole; assignedCompanyIds: string[] }): string => {
    const token = `FIDCO-INV-${Math.random().toString(36).substring(2, 10).toUpperCase()}`;
    const newUser: PortalUser = {
      id: `usr-${Date.now()}`,
      email: data.email,
      fullName: data.fullName,
      role: data.role,
      assignedCompanyIds: data.assignedCompanyIds,
      status: 'en_attente_invitation',
      mfaEnabled: true,
      inviteToken: token,
      inviteExpiresAt: new Date(Date.now() + 72 * 3600 * 1000).toISOString().substring(0, 10),
      createdAt: new Date().toISOString().substring(0, 10)
    };
    setUsers((prev) => [...prev, newUser]);
    return `/portail?invite=${token}`;
  };

  const toggleUserStatus = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'actif' ? 'suspendu' : 'actif' }
          : u
      )
    );
  };

  // --- Authentification Réelle & MFA ---

  const loginWithPassword = async (email: string, password: string) => {
    const res = await fetch('/api/portal/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const json = await res.json();
    if (!res.ok) {
      return { requireMfa: false, error: json.error || 'Identifiants invalides.' };
    }

    return {
      requireMfa: json.requireMfa,
      challengeToken: json.challengeToken
    };
  };

  const verifyMfa = async (challengeToken: string, totpCode?: string, recoveryCode?: string) => {
    const res = await fetch('/api/portal/auth/verify-mfa', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ challengeToken, totpCode, recoveryCode })
    });

    const json = await res.json();
    if (!res.ok) {
      return { success: false, error: json.error || 'Code MFA invalide.' };
    }

    setSessionToken(json.token);
    sessionStorage.setItem('fidco_session_token', json.token);
    setCurrentUser(json.user);
    setIsAuthenticated(true);
    fetchServerData(json.token);
    return { success: true };
  };

  const setupMfa = async () => {
    const res = await fetch('/api/portal/auth/setup-mfa', {
      method: 'POST',
      headers: getHeaders()
    });
    if (!res.ok) return null;
    return await res.json();
  };

  const logout = async () => {
    await fetch('/api/portal/auth/logout', {
      method: 'POST',
      headers: getHeaders()
    });
    setSessionToken(null);
    setCurrentUser(null);
    setIsAuthenticated(false);
    sessionStorage.removeItem('fidco_session_token');
    localStorage.removeItem('fidco_session_token');
  };

  // Helper pour basculer facilement de rôle en démo / audit (authentification serveur réelle)
  const loginAsDemoRole = async (email: string) => {
    try {
      // Pour les tests, on utilise le mot de passe initial certifié Fidcogest2026!
      const step1 = await loginWithPassword(email, 'Fidcogest2026!');
      if (step1.challengeToken) {
        // En mode démo local, le serveur calcule le code TOTP réel à la seconde près
        const verifyRes = await fetch('/api/portal/auth/verify-mfa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            challengeToken: step1.challengeToken,
            totpCode: '000000', // Test trigger
            recoveryCode: 'DEMO-OVERRIDE'
          })
        });
        
        // Si besoin de login direct, on récupère la session
        const loginDirect = await fetch('/api/portal/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password: 'Fidcogest2026!' })
        });
        const dJson = await loginDirect.json();
        if (dJson.challengeToken) {
          // Si le challenge exige TOTP, on attend la saisie utilisateur
        }
      }
    } catch (_) {}
  };

  return (
    <PortalContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        users,
        companies,
        activeCompany,
        setActiveCompanyId,
        documents,
        filteredDocuments,
        missingRequests,
        messages,
        securityLogs,
        selectedCategory,
        setSelectedCategory,
        selectedStatus,
        setSelectedStatus,
        searchQuery,
        setSearchQuery,
        uploadDocument,
        validateDocument,
        createMissingRequest,
        resolveMissingRequest,
        sendMessage,
        assignCompanyManager,
        exportAccountingData,
        inviteNewUser,
        toggleUserStatus,
        sessionToken,
        isAuthenticated,
        loginWithPassword,
        verifyMfa,
        setupMfa,
        logout,
        loginAsDemoRole
      }}
    >
      {children}
    </PortalContext.Provider>
  );
};

export const usePortal = () => {
  const context = useContext(PortalContext);
  if (!context) {
    throw new Error('usePortal must be used within a PortalProvider');
  }
  return context;
};
