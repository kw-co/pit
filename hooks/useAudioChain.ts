
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useAudio, stopAllAudio } from './useAudio';

type AudioChainOptions = {
    onLock?: (locked: boolean) => void;
    onUnlock?: (locked: boolean) => void;
    onChainEnd?: () => void;
    onSoundStart?: (index: number) => void;
};

export const useAudioChain = (options?: AudioChainOptions) => {
  const [audioChain, setAudioChain] = useState<{ sounds: string[], onEnd?: () => void, onSoundStart?: (index: number) => void } | null>(null);
  const [currentSoundIndex, setCurrentSoundIndex] = useState(0);
  const [isLocked, setIsLocked] = useState(false);

  const callbacksRef = React.useRef(options);

  useEffect(() => {
    callbacksRef.current = options;
  }, [options]);

  const currentSoundPath = useMemo(() => audioChain?.sounds[currentSoundIndex] ?? '', [audioChain, currentSoundIndex]);

  const onCurrentSoundEnd = useCallback(() => {
    if (audioChain && currentSoundIndex < audioChain.sounds.length - 1) {
      setCurrentSoundIndex(prev => prev + 1);
    } else {
      audioChain?.onEnd?.();
      callbacksRef.current?.onChainEnd?.();
      setAudioChain(null);
      setIsLocked(false);
      callbacksRef.current?.onUnlock?.(false);
    }
  }, [audioChain, currentSoundIndex]);

  const playCurrentSound = useAudio(currentSoundPath, {
    onEnded: onCurrentSoundEnd,
    onPlaying: () => {
      audioChain?.onSoundStart?.(currentSoundIndex);
      callbacksRef.current?.onSoundStart?.(currentSoundIndex);
    }
  });

  useEffect(() => {
    if (currentSoundPath) {
      playCurrentSound();
    }
  }, [currentSoundPath, playCurrentSound]);

  const startAudioChain = useCallback((sounds: (string | undefined)[], onEnd?: () => void, onSoundStart?: (index: number) => void) => {
    stopAllAudio();
    const validSounds = sounds.filter((s): s is string => !!s);
    if (validSounds.length > 0) {
      setIsLocked(true);
      callbacksRef.current?.onLock?.(true);
      setCurrentSoundIndex(0);
      setAudioChain({ sounds: validSounds, onEnd, onSoundStart });
    } else {
      onEnd?.();
      callbacksRef.current?.onChainEnd?.();
    }
  }, []);

  return { isLocked, setIsLocked, startAudioChain };
};
