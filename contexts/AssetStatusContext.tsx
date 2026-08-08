
import React, { createContext, useState, useContext, useCallback } from 'react';
import { getMetadata } from '../lib/db';

export type PackageName = 'critical' | 'essentials' | 'secondary';
export type ProgressKey = PackageName | 'installation';
export type AssetStatus = 'pending' | 'loading' | 'loaded' | 'error';

interface ProgressState {
  critical: number;
  essentials: number;
  secondary: number;
  installation: number;
}

interface AssetStatusContextType {
  statuses: Record<PackageName, AssetStatus>;
  progress: ProgressState;
  installationComplete: boolean;
  setPackageStatus: (name: PackageName, status: AssetStatus) => void;
  setPackageProgress: (name: ProgressKey, value: number) => void;
  setInstallationComplete: (complete: boolean) => void;
  errorMessage: string;
  setErrorMessage: (message: string) => void;
  checkAllPackagesLoaded: () => Promise<boolean>;
}

const AssetStatusContext = createContext<AssetStatusContextType | undefined>(undefined);

export const AssetStatusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [statuses, setStatuses] = useState<Record<PackageName, AssetStatus>>({
    critical: 'pending',
    essentials: 'pending',
    secondary: 'pending',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [progress, setProgress] = useState<ProgressState>({
    critical: 0,
    essentials: 0,
    secondary: 0,
    installation: 0,
  });
  const [installationComplete, setInstallationComplete] = useState(false);

  const setPackageStatus = useCallback((name: PackageName, status: AssetStatus) => {
    setStatuses(prev => ({ ...prev, [name]: status }));
  }, []);
  
  const setPackageProgress = useCallback((name: ProgressKey, value: number) => {
    setProgress(prev => ({ ...prev, [name]: Math.round(value) }));
  }, []);

  const checkAllPackagesLoaded = useCallback(async (): Promise<boolean> => {
      try {
          const criticalLoaded = await getMetadata<boolean>('pkg_loaded_critical');
          const essentialsLoaded = await getMetadata<boolean>('pkg_loaded_essentials');
          const secondaryLoaded = await getMetadata<boolean>('pkg_loaded_secondary');
          if (criticalLoaded && essentialsLoaded && secondaryLoaded) {
            setInstallationComplete(true);
            return true;
          }
          return false;
      } catch (e) {
          // console.error("Error verifying package status in DB", e);
          return false;
      }
  }, []);

  const value = {
    statuses,
    progress,
    installationComplete,
    setPackageStatus,
    setPackageProgress,
    setInstallationComplete,
    errorMessage,
    setErrorMessage,
    checkAllPackagesLoaded
  };

  return (
    <AssetStatusContext.Provider value={value}>
      {children}
    </AssetStatusContext.Provider>
  );
};

export const useAssetStatus = () => {
  const context = useContext(AssetStatusContext);
  if (!context) {
    throw new Error('useAssetStatus must be used within an AssetStatusProvider');
  }
  return context;
};