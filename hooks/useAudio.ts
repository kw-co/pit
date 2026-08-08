



import React from 'react';
import { getFile } from '../lib/db';
import { useVolume } from '../contexts/VolumeContext';
import { useTextToSpeech } from './useTextToSpeech';
import { VOICE_PROMPTS, ANIMALS } from '../constants';

// --- Global Audio Manager ---
const activeAudioElements = new Set<HTMLAudioElement>();

/**
 * Registers an HTMLAudioElement to be managed globally.
 * @param audio The audio element to register.
 */
function registerAudioElement(audio: HTMLAudioElement) {
    activeAudioElements.add(audio);
}

/**
 * Unregisters an HTMLAudioElement from global management.
 * @param audio The audio element to unregister.
 */
function unregisterAudioElement(audio: HTMLAudioElement) {
    activeAudioElements.delete(audio);
}

/**
 * Stops all currently playing audio, including voice prompts and text-to-speech.
 */
export function stopAllAudio() {
    // 1. Stop Text-to-Speech
    if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
    }

    // 2. Stop all registered HTMLAudioElement instances
    activeAudioElements.forEach(audio => {
        if (!audio.paused) {
            audio.pause();
            // Only reset currentTime if the media is loaded enough to be seekable.
            if (audio.readyState > 0) { 
                audio.currentTime = 0;
            }
        }
    });
}


type AudioOptions = {
  onEnded?: () => void;
  onPlaying?: () => void;
};

type AudioStatus = 'idle' | 'loading' | 'ready' | 'error';

/**
 * A robust custom hook to play audio from IndexedDB.
 * This re-architected version uses a single, persistent HTMLAudioElement
 * and swaps the `src` via Object URLs to prevent browser instability from
 * rapid element creation/destruction. This is the definitive fix for
 * "Format error" issues seen during rapid playback.
 * @param {string} path The path of the audio file in the DB (e.g., 'ARSOUND/A01.mp3').
 * @param {AudioOptions} [options] Optional callbacks for 'onEnded' and 'onPlaying' events.
 * @returns {() => void} A function to play the audio.
 */

function getTTSText(path: string): string | null {
    if (!path) return null;

    // Is it a voice prompt?
    const lang = path.startsWith('ARSOUND') ? 'ar' : (path.startsWith('ENSOUND') ? 'en' : 'ar');
    
    // Search VOICE_PROMPTS
    const prompts = VOICE_PROMPTS[lang as 'ar' | 'en'];
    if (prompts) {
        for (const key in prompts) {
            const val = prompts[key];
            if (Array.isArray(val)) {
                for (const v of val) {
                    if (v.path === path) return v.desc;
                }
            } else {
                if (val.path === path) return val.desc;
            }
        }
    }

    // Is it an animal name sound? e.g. ARSOUND/01.mp3
    let match = path.match(/(?:ARSOUND|ENSOUND)\/(\d+)\.mp3/);
    if (match) {
        const idStr = match[1];
        const animalId = parseInt(idStr, 10);
        const animal = ANIMALS.find(a => a.id === animalId);
        if (animal) {
            return lang === 'ar' ? animal.name_ar : animal.name_en;
        }
    }

    // Is it an animal voice? e.g. VOICES/01.mp3
    match = path.match(/VOICES\/(\d+)\.mp3/);
    if (match) {
        const idStr = match[1];
        const animalId = parseInt(idStr, 10);
        const animal = ANIMALS.find(a => a.id === animalId);
        if (animal) {
            // For Arabic, say "صوت [اسم الحيوان]"
            // For English, say "Sound of [Animal]"
            // Since we don't know the exact lang context for animal sounds (it's globally VOICES),
            // let's default to Arabic if not specified since the user asked in Arabic.
            return `صوت ${animal.name_ar}`;
        }
    }

    return null;
}

export const useAudio = (path: string, options?: AudioOptions): (() => void) => {
  // A persistent audio element.
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  // A ref to store the current Object URL for cleanup.
  const objectUrlRef = React.useRef<string | null>(null);
  
  const callbacksRef = React.useRef(options);
  const playWhenReadyRef = React.useRef(false);
  const statusRef = React.useRef<AudioStatus>('idle');
  const pathRef = React.useRef(path);
  const { volume } = useVolume();
  const lang = path.startsWith('ENSOUND') ? 'en' : 'ar';
  const tts = useTextToSpeech(lang);

  pathRef.current = path; // Keep the path ref updated on every render

  React.useEffect(() => {
    callbacksRef.current = options;
  }, [options]);

  // Initialize the audio element once and set up listeners.
  React.useEffect(() => {
    const audio = new Audio();
    audioRef.current = audio;
    registerAudioElement(audio);

    const handleEnded = () => callbacksRef.current?.onEnded?.();
    const handlePlaying = () => callbacksRef.current?.onPlaying?.();
    const handleError = (e: Event) => {
        statusRef.current = 'error';
        const mediaError = (e.target as HTMLAudioElement).error;
        if (mediaError && mediaError.code !== mediaError.MEDIA_ERR_ABORTED) {
            let errorDetails = `code: ${mediaError.code}, message: ${mediaError.message || 'N/A'}`;
             switch (mediaError.code) {
                case mediaError.MEDIA_ERR_NETWORK:
                    errorDetails += ' (A network error occurred.)';
                    break;
                case mediaError.MEDIA_ERR_DECODE:
                    errorDetails += ' (A decode error occurred.)';
                    break;
                case mediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
                    errorDetails += ' (The source is not supported.)';
                    break;
                default:
                    errorDetails += ' (An unknown error occurred.)';
            }
            // Use pathRef to get the most current path for accurate logging
            // console.error(`Error with audio element for path: ${pathRef.current}. Details: ${errorDetails}`);
        }
        // This is the crucial fix: ensure the audio chain continues even if one sound fails.
        callbacksRef.current?.onEnded?.();
    };
    
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('error', handleError);

    // This is the cleanup for when the component that uses the hook unmounts.
    return () => {
      unregisterAudioElement(audio);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('error', handleError);
      audio.pause();
      audio.src = ''; // Detach source
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []); // Empty dependency array means this runs only once on mount.

  // Effect to update volume when the global volume context changes
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // This effect handles LOADING a new audio source when the `path` changes.
  React.useEffect(() => {
    let isCancelled = false;
    const audio = audioRef.current;
    if (!audio) return;

    // Clean up previous source before loading a new one
    playWhenReadyRef.current = false;
    audio.pause();
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
    audio.removeAttribute('src');
    audio.load();

    if (!path) {
      statusRef.current = 'idle';
      // If the path is empty, we just reset to an idle state and wait for a real path.
      // We don't treat it as an error. This is key to the lazy-loading of audio hooks.
      return;
    }

    statusRef.current = 'loading';
    
    const loadSource = async () => {
      try {
        const audioBlob = await getFile(path);
        if (isCancelled) return;

        if (!audioBlob) {
          console.warn(`Audio file not found in DB: ${path}. Using TTS fallback.`);
          statusRef.current = 'error';
          if (playWhenReadyRef.current) {
              playWhenReadyRef.current = false;
              const text = getTTSText(path);
              if (text) {
                  tts.speak(text, () => callbacksRef.current?.onEnded?.());
              } else {
                  callbacksRef.current?.onEnded?.();
              }
          }
          return;
        }

        const typedAudioBlob = new Blob([audioBlob], { type: 'audio/mpeg' });
        const newObjectUrl = URL.createObjectURL(typedAudioBlob);
        objectUrlRef.current = newObjectUrl;

        if (isCancelled) {
          URL.revokeObjectURL(newObjectUrl);
          objectUrlRef.current = null;
          return;
        }

        const canPlayHandler = () => {
            if (isCancelled) return;
            statusRef.current = 'ready';
            if (playWhenReadyRef.current) {
                playWhenReadyRef.current = false;
                audio.currentTime = 0;
                audio.play().catch(error => {
                    if (error.name !== 'AbortError') {
                        // console.error(`Auto-play on ready failed for path: ${path}.`, error);
                    }
                });
            }
            audio.removeEventListener('canplaythrough', canPlayHandler);
        };
        
        audio.addEventListener('canplaythrough', canPlayHandler);
        audio.src = newObjectUrl;
        audio.load();

      } catch (error) {
        if(isCancelled) return;
        statusRef.current = 'error';
        // console.error(`Failed to load or process audio file from DB for path: ${path}`, error);
        // This is a crucial fix: ensure the audio chain continues on any load error.
        callbacksRef.current?.onEnded?.();
      }
    };
    
    loadSource();

    return () => {
      isCancelled = true;
    };
  }, [path]); // Rerun only when the audio source path changes.


  const play = React.useCallback(() => {
    const audio = audioRef.current;

    // This is the core resilience fix. If play is called on a hook that has no valid
    // path or audio element, we immediately trigger the onEnded callback. This prevents
    // the entire audio sequence from halting silently. We use setTimeout to avoid
    // potential deep recursion issues if many sounds in a chain are invalid.
    if (!path || !audio) {
      setTimeout(() => callbacksRef.current?.onEnded?.(), 0);
      return;
    }

    if (statusRef.current === 'error') {
        const text = getTTSText(path);
        if (text) {
            tts.speak(text, () => callbacksRef.current?.onEnded?.());
        } else {
            setTimeout(() => callbacksRef.current?.onEnded?.(), 0);
        }
        return;
    }

    if (statusRef.current === 'ready') {
      audio.currentTime = 0;
      audio.play().catch(error => {
        if (error.name !== 'AbortError') {
          // console.error(`Audio play() promise rejected for path: ${path}.`, error);
        }
        // The 'error' event listener on the audio element will handle calling onEnded,
        // so we don't need to call it here.
      });
    } else if (statusRef.current === 'error') {
      console.warn(`Attempted to play audio that failed to load: ${path}. Skipping.`);
      setTimeout(() => callbacksRef.current?.onEnded?.(), 0);
    } else { // 'loading' or 'idle'
      // The audio is not ready yet. Set a flag to play it as soon as it loads.
      playWhenReadyRef.current = true;
    }
  }, [path]);

  return play;
};