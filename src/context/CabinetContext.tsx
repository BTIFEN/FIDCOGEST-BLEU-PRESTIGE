import React, { createContext, useContext, useState, useEffect } from 'react';
import { CabinetConfig } from '../types';
import defaultContent from '../../data/cabinet-content.json';

interface CabinetContextType {
  config: CabinetConfig;
  isLoading: boolean;
  refreshConfig: () => Promise<void>;
  updateConfig: (newConfig: CabinetConfig, password?: string) => Promise<{ success: boolean; error?: string }>;
}

const CabinetContext = createContext<CabinetContextType>({
  config: defaultContent as CabinetConfig,
  isLoading: false,
  refreshConfig: async () => {},
  updateConfig: async () => ({ success: false })
});

export const CabinetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [config, setConfig] = useState<CabinetConfig>(defaultContent as CabinetConfig);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchConfig = async () => {
    try {
      const res = await fetch('/api/cabinet-config');
      if (res.ok) {
        const data = await res.json();
        if (data && data.cabinet) {
          setConfig(data);
        }
      }
    } catch (err) {
      console.warn('[Fidcogest] Utilisation de la configuration locale vérifiée:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const updateConfig = async (newConfig: CabinetConfig, password?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const token = sessionStorage.getItem('fidcogest_admin_token');
      const headers: Record<string, string> = {
        'Content-Type': 'application/json'
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      if (password) {
        headers['x-admin-password'] = password;
      }

      const res = await fetch('/api/cabinet-config', {
        method: 'POST',
        headers,
        body: JSON.stringify(newConfig)
      });

      if (res.ok) {
        setConfig(newConfig);
        return { success: true };
      } else {
        const errData = await res.json().catch(() => ({}));
        return { success: false, error: errData.error || 'Erreur lors de la sauvegarde.' };
      }
    } catch (err: any) {
      return { success: false, error: err.message || 'Erreur réseau.' };
    }
  };

  return (
    <CabinetContext.Provider
      value={{
        config,
        isLoading,
        refreshConfig: fetchConfig,
        updateConfig
      }}
    >
      {children}
    </CabinetContext.Provider>
  );
};

export const useCabinet = () => useContext(CabinetContext);
