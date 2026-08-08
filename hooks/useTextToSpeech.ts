import React, { useState, useEffect, useCallback } from 'react';
import { useVolume } from '../contexts/VolumeContext';

/**
 * A hook to provide text-to-speech functionality using the browser's Web Speech API.
 * It automatically selects a voice based on the desired language.
 * @param lang The desired language ('ar' or 'en').
 */
export const useTextToSpeech = (lang: 'ar' | 'en') => {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [isApiSupported, setIsApiSupported] = useState(false);
  const { volume } = useVolume();

  useEffect(() => {
    if ('speechSynthesis' in window && typeof window.speechSynthesis === 'object' && window.speechSynthesis !== null) {
      setIsApiSupported(true);
    } else {
      setIsApiSupported(false);
      return;
    }

    const handleVoicesChanged = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
    };
    
    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged);
    handleVoicesChanged();

    return () => {
      if ('speechSynthesis' in window && typeof window.speechSynthesis === 'object' && window.speechSynthesis !== null) {
        window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged);
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  useEffect(() => {
    if (voices.length > 0) {
      let bestVoice: SpeechSynthesisVoice | null = null;
      if (lang === 'ar') {
        const targetLang = 'ar-SA';
        bestVoice = voices.find(v => v.lang === targetLang && v.name.includes('Maged')) ||
                    voices.find(v => v.lang.startsWith('ar-')) ||
                    null;
      } else { // lang === 'en'
        const targetLang = 'en-US';
        bestVoice = voices.find(v => v.lang === targetLang && v.name.includes('Samantha')) || // Common high-quality voice
                    voices.find(v => v.lang === targetLang && v.default) ||
                    voices.find(v => v.lang.startsWith('en-')) ||
                    null;
      }
      setSelectedVoice(bestVoice);
    }
  }, [lang, voices]);


  const speak = useCallback((text: string, onEnd?: () => void) => {
    if (!isApiSupported || !selectedVoice || !text) {
      if (isApiSupported && !selectedVoice) {
          console.warn(`No suitable ${lang} voice found for text-to-speech.`);
      }
      onEnd?.();
      return;
    }
    
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = selectedVoice;
    utterance.lang = selectedVoice.lang;
    utterance.volume = volume; // Set volume from context
    utterance.pitch = 1.1;
    utterance.rate = 0.95;
    utterance.onend = () => {
        onEnd?.();
    };
    window.speechSynthesis.speak(utterance);
  }, [selectedVoice, isApiSupported, lang, volume]);

  const cancel = useCallback(() => {
      if (isApiSupported) {
          window.speechSynthesis.cancel();
      }
  }, [isApiSupported]);
  
  return { speak, cancel, isReady: selectedVoice !== null };
};