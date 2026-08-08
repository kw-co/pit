import React, { createContext, useState, useContext, useMemo } from 'react';

export type VolumeLevel = 'full' | 'high' | 'medium' | 'low' | 'mute';

export const volumeValues: Record<VolumeLevel, number> = {
  full: 1.0,
  high: 0.75,
  medium: 0.5,
  low: 0.25,
  mute: 0,
};

interface VolumeContextType {
  level: VolumeLevel;
  setLevel: (level: VolumeLevel) => void;
  volume: number; // The numeric value (0 to 1)
}

const VolumeContext = createContext<VolumeContextType | undefined>(undefined);

export const VolumeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [level, setLevel] = useState<VolumeLevel>('high'); // Default to high volume

  const value = useMemo(() => ({
    level,
    setLevel,
    volume: volumeValues[level],
  }), [level]);

  return (
    <VolumeContext.Provider value={value}>
      {children}
    </VolumeContext.Provider>
  );
};

export const useVolume = (): VolumeContextType => {
  const context = useContext(VolumeContext);
  if (context === undefined) {
    throw new Error('useVolume must be used within a VolumeProvider');
  }
  return context;
};