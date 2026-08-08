



import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Animal, DietType, AnimalType } from '../types';
import { useAudio, stopAllAudio } from '../hooks/useAudio';
import { SoundOnIcon, StarIcon, getDietTranslation, getAnimalTypeTranslation } from '../constants';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useLanguage } from '../contexts/LanguageContext';
import AssetImage from './AssetImage';

const useAudioChain = () => {
  const [audioChain, setAudioChain] = useState<{ sounds: string[], onEnd?: () => void } | null>(null);
  const [currentSoundIndex, setCurrentSoundIndex] = useState(0);

  const currentSoundPath = useMemo(() => audioChain?.sounds[currentSoundIndex] ?? '', [audioChain, currentSoundIndex]);

  const onCurrentSoundEnd = useCallback(() => {
    if (audioChain && currentSoundIndex < audioChain.sounds.length - 1) {
      setCurrentSoundIndex(prev => prev + 1);
    } else {
      audioChain?.onEnd?.();
      setAudioChain(null);
    }
  }, [audioChain, currentSoundIndex]);

  const playCurrentSound = useAudio(currentSoundPath, { onEnded: onCurrentSoundEnd });

  useEffect(() => {
    if (currentSoundPath) {
      playCurrentSound();
    }
  }, [currentSoundPath, playCurrentSound]);

  const startAudioChain = useCallback((sounds: string[], onEnd?: () => void) => {
    stopAllAudio();
    const validSounds = sounds.filter(s => !!s);
    if (validSounds.length > 0) {
      setCurrentSoundIndex(0);
      setAudioChain({ sounds: validSounds, onEnd });
    } else {
      onEnd?.();
    }
  }, []);

  return { startAudioChain };
};


interface AnimalFactModalProps {
  animal: Animal;
  onClose: () => void;
}

const AnimalFactModal: React.FC<AnimalFactModalProps> = ({ animal, onClose }) => {
  const { language, translations: t } = useLanguage();
  
  const animalName = language === 'en' ? animal.name_en : animal.name_ar;
  const animalFacts = language === 'en' ? animal.facts_en : animal.facts_ar;

  // Hooks for manual button clicks
  const playArabicNameSound = useAudio(animal.nameSoundUrl);
  const playEnglishNameSound = useAudio(animal.nameSoundUrl_en);
  const playAnimalSound = useAudio(animal.animalSoundUrl);

  // Autoplay sequence logic
  const { startAudioChain } = useAudioChain();
  const { speak, cancel, isReady } = useTextToSpeech(language);
  
  React.useEffect(() => {
    const soundsToPlay = language === 'en'
      ? [animal.animalSoundUrl, animal.nameSoundUrl_en, animal.nameSoundUrl]
      : [animal.animalSoundUrl, animal.nameSoundUrl, animal.nameSoundUrl_en];
    
    const timer = setTimeout(() => startAudioChain(soundsToPlay), 500);
    
    return () => {
      clearTimeout(timer);
      cancel();
    };
  }, [animal.animalSoundUrl, animal.nameSoundUrl, animal.nameSoundUrl_en, startAudioChain, cancel, language]);

  const getDietInfo = () => {
    switch (animal.diet) {
      case DietType.HERBIVORE:
        return { emoji: '🌿', text: getDietTranslation(animal.diet, language) };
      case DietType.CARNIVORE:
        return { emoji: '🍖', text: getDietTranslation(animal.diet, language) };
      default:
        return { emoji: '🌿🍖', text: getDietTranslation(animal.diet, language) };
    }
  };

  const getTypeInfo = () => {
    let emoji: string;
    switch (animal.type) {
      case AnimalType.MAMMAL:
        emoji = '🐄';
        break;
      case AnimalType.BIRD:
        emoji = '🐦';
        break;
      case AnimalType.REPTILE:
        emoji = '🦎';
        break;
      case AnimalType.AQUATIC:
        emoji = '🐳';
        break;
      case AnimalType.AMPHIBIAN:
        emoji = '🐸';
        break;
      case AnimalType.INSECT:
        emoji = '🐞';
        break;
      default:
        emoji = '❓';
    }
    return { 
      emoji,
      text: getAnimalTypeTranslation(animal.type, language) 
    };
  };
  
  const playAndStop = (playFn: () => void) => {
    stopAllAudio();
    playFn();
  };

  const speakAndStop = (text: string) => {
    stopAllAudio();
    speak(text);
  };

  const typeInfo = getTypeInfo();
  const dietInfo = getDietInfo();
  const closeButtonClass = language === 'ar' ? "absolute top-4 left-4" : "absolute top-4 right-4";
  const buttonBaseStyle = "flex items-center justify-center gap-2 text-white px-3 py-2 rounded-full shadow-md transition w-full text-center";

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 transition-opacity duration-300 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gradient-to-br from-yellow-50 to-orange-100 rounded-3xl shadow-2xl p-4 md:p-6 w-full max-w-lg md:max-w-xl lg:max-w-2xl relative text-center transform transition-all duration-300 scale-95 animate-modal-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className={`${closeButtonClass} text-gray-500 hover:text-gray-800 text-3xl md:text-4xl z-10`}>&times;</button>
        
        <div className="w-48 h-48 md:w-56 md:h-56 mx-auto rounded-full overflow-hidden shadow-lg border-4 border-white mb-4 bg-white">
          <AssetImage path={animal.imageUrl} alt={animalName} className="w-full h-full object-contain"/>
        </div>

        <h2 className="text-5xl md:text-6xl font-bold text-orange-600 mb-3">{animalName}</h2>
        
        <div className="flex justify-center items-center flex-wrap gap-3 my-4">
          <div className="bg-white/70 text-gray-800 rounded-full px-4 py-2 md:px-5 md:py-3 flex items-center gap-2 text-lg md:text-xl shadow-sm font-semibold">
            <span className="text-2xl">{typeInfo.emoji}</span>
            <span>{typeInfo.text}</span>
          </div>
          <div className="bg-white/70 text-gray-800 rounded-full px-4 py-2 md:px-5 md:py-3 flex items-center gap-2 text-lg md:text-xl shadow-sm font-semibold">
            <span className="text-2xl">{dietInfo.emoji}</span>
            <span>{dietInfo.text}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3 my-5">
          <button onClick={() => playAndStop(playArabicNameSound)} className={`${buttonBaseStyle} bg-green-500 hover:bg-green-600`}>
              <span className="text-xl" role="img" aria-label="Saudi Arabia Flag">🇸🇦</span>
              <span className="font-semibold text-sm md:text-base">{t.factModal.hearArabicName}</span>
          </button>
          <button onClick={() => playAndStop(playEnglishNameSound)} className={`${buttonBaseStyle} bg-blue-500 hover:bg-blue-600`}>
              <span className="text-xl" role="img" aria-label="USA Flag">🇺🇸</span>
              <span className="font-semibold text-sm md:text-base">{t.factModal.hearEnglishName}</span>
          </button>
          <button 
            onClick={() => playAndStop(playAnimalSound)} 
            className={`${buttonBaseStyle} bg-orange-500 hover:bg-orange-600`}
          >
            <SoundOnIcon className="w-5 h-5 md:w-6 md:h-6" />
            <span className="font-semibold text-sm md:text-base">{t.factModal.hearAnimalSound}</span>
          </button>
        </div>
        
        <div className={`${language === 'ar' ? 'text-right' : 'text-left'} space-y-2 mt-6`}>
            <h3 className="text-xl md:text-2xl font-bold text-orange-500">{t.factModal.funFactsTitle}</h3>
            <ul className="space-y-2">
                {animalFacts.map((fact, index) => (
                    <li key={index} className="flex items-start gap-2">
                        <StarIcon className="w-5 h-5 md:w-6 md:h-6 text-yellow-500 flex-shrink-0 mt-1" />
                        <span className="text-lg md:text-xl text-gray-800 flex-grow">{fact}</span>
                        {isReady && (
                          <button 
                            onClick={() => speakAndStop(fact)} 
                            className="flex-shrink-0 text-sky-500 hover:text-sky-700 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-sky-400 transition-colors"
                            aria-label={`${t.factModal.listenToFact} ${fact}`}
                          >
                              <SoundOnIcon className="w-6 h-6 md:w-7 md:h-7" />
                          </button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
      </div>
    </div>
  );
};

export default AnimalFactModal;