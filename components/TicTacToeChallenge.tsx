



import React, { useState, useEffect } from 'react';
import { Animal } from '../types';
import { MemoryIcon } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { stopAllAudio } from '../hooks/useAudio';
import AssetImage from './AssetImage';

type ChallengeProps = {
  gameType: 'name' | 'sound' | 'memory';
  onResult: (success: boolean, animal?: Animal) => void;
  onSetupComplete?: () => void;
  isSetupPhase?: boolean;
  challengeAnimals: Animal[];
  targetAnimal: Animal | null;
  disabled: boolean;
  foundChallengeIndices?: Set<number>;
};

const TicTacToeChallenge: React.FC<ChallengeProps> = ({
  gameType,
  onResult,
  onSetupComplete,
  isSetupPhase,
  challengeAnimals,
  targetAnimal,
  disabled,
  foundChallengeIndices = new Set(),
}) => {
  const { language, translations: t } = useLanguage();
  const [revealedIndex, setRevealedIndex] = useState<number | null>(null);

  useEffect(() => {
    if (!disabled) {
      setRevealedIndex(null);
    }
  }, [disabled]);

  const handleSelection = (selectedAnimal: Animal, index: number) => {
    if (disabled) return;
    stopAllAudio();
    
    const isCorrect = selectedAnimal.id === targetAnimal?.id;
    if (isCorrect && gameType === 'memory') {
      setRevealedIndex(index);
    }

    onResult(isCorrect, selectedAnimal);
  };
  
  const handleMemorySetupEnd = () => {
    if (disabled) return;
    stopAllAudio();
    if (onSetupComplete) {
      onSetupComplete();
    }
  };

  if (isSetupPhase) {
    return (
      <div className="w-full flex flex-col items-center">
        <div className="grid grid-cols-3 gap-3 md:gap-4 w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
          {challengeAnimals.map(animal => (
            <div key={animal.id} className="aspect-square bg-white rounded-2xl shadow-lg p-2">
              <AssetImage path={animal.imageUrl} alt={animal.name_ar} className="w-full h-full object-contain" />
            </div>
          ))}
        </div>
        <div className="bg-white/90 rounded-full py-3 px-6 mt-6 w-full max-w-lg shadow-lg flex items-center justify-center gap-6">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">{t.memoryGame.memorize}</h2>
            <button
              onClick={handleMemorySetupEnd}
              disabled={disabled}
              className="bg-green-500 hover:bg-green-600 text-white font-bold text-2xl md:text-3xl py-3 px-8 rounded-full shadow-md transition-transform hover:scale-105 disabled:opacity-50 flex-shrink-0"
            >
              {t.memoryGame.ready}
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center">
        <div className="grid grid-cols-3 gap-3 md:gap-4 w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
            {challengeAnimals.map((animal, index) => {
                const isMemoryChallenge = gameType === 'memory';
                const isFound = foundChallengeIndices.has(index);
                const isRevealed = revealedIndex === index;

                if (isMemoryChallenge) {
                  const isFlipped = isFound || isRevealed;
                  return (
                    <div
                      key={`${animal.id}-${index}`}
                      className={`card-container aspect-square w-full ${isFlipped ? 'is-flipped' : ''}`}
                      onClick={() => !disabled && !isFound && handleSelection(animal, index)}
                    >
                      <div className="card-inner">
                        <div className={`card-face card-front bg-sky-200 flex items-center justify-center p-2 rounded-2xl shadow-lg border-4 border-white ${!disabled && !isFound ? 'cursor-pointer' : ''}`}>
                          <MemoryIcon className="w-3/4 h-3/4 text-sky-400" />
                        </div>
                        <div className="card-face card-back bg-white rounded-2xl shadow-lg">
                          <AssetImage path={animal.imageUrl} alt={animal.name_ar} className="w-full h-full object-contain p-1" />
                        </div>
                      </div>
                    </div>
                  );
                }

                // Fallback for name/sound games
                return (
                    <div
                        key={animal.id}
                        className={`aspect-square bg-white rounded-2xl shadow-lg p-2 transition-transform ${!disabled ? 'cursor-pointer hover:scale-105' : 'cursor-wait'}`}
                        onClick={() => !disabled && handleSelection(animal, index)}
                    >
                        <AssetImage path={animal.imageUrl} alt={animal.name_ar} className="w-full h-full object-contain" />
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default TicTacToeChallenge;