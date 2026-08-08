
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Animal } from '../types';
import { ANIMALS, VOICE_PROMPTS, SoundOnIcon, BackIcon, MemoryIcon, StarIcon } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { useAudio, stopAllAudio } from '../hooks/useAudio';
import AssetImage from './AssetImage';
import { useAudioChain } from './../hooks/useAudioChain';

const StarCounter: React.FC<{ count: number }> = ({ count }) => {
  const { language } = useLanguage();
  if (count === 0) return null;
  
  const positionClass = language === 'ar' ? "absolute top-2 left-2" : "absolute top-2 right-2";
  
  return (
    <div className={`${positionClass} z-20 flex items-center gap-2 rounded-full bg-black/30 px-3 py-1 font-bold text-yellow-300 text-xl`}>
      <StarIcon className="h-6 w-6" />
      <span>{count}</span>
    </div>
  );
};

const StarCelebration: React.FC = () => (
    <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
        <div className="animate-star-celebration">
            <StarIcon className="h-64 w-64 text-yellow-400" style={{ filter: 'drop-shadow(0 0 20px rgba(255, 223, 0, 0.8))' }} />
        </div>
    </div>
);


const MemoryCard: React.FC<{
  animal: Animal;
  isFlipped: boolean; 
  onClick: () => void;
  disabled: boolean;
}> = ({ animal, isFlipped, onClick, disabled }) => {
  const containerClasses = `card-container aspect-square w-full ${isFlipped ? 'is-flipped' : ''}`;
  return (
    <div className={containerClasses} onClick={!disabled ? onClick : undefined}>
      <div className="card-inner">
        <div className="card-face card-front bg-sky-200 flex items-center justify-center p-2 rounded-2xl shadow-lg border-4 border-white">
          <MemoryIcon className="w-3/4 h-3/4 text-sky-400" />
        </div>
        <div className="card-face card-back bg-white rounded-2xl shadow-lg">
          <AssetImage path={animal.imageUrl} alt={animal.name_ar} className="w-full h-full object-contain p-1" />
        </div>
      </div>
    </div>
  );
};

const MemoryGame: React.FC<{ onGoBack?: () => void }> = ({ onGoBack = () => {} }) => {
    const { language, translations: t } = useLanguage();
    type GameState = 'memorizing' | 'playing' | 'won';

    const [gameState, setGameState] = useState<GameState>('memorizing');
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [questions, setQuestions] = useState<Animal[]>([]);
    
    const [foundIndices, setFoundIndices] = useState<Set<number>>(new Set());
    const [currentTarget, setCurrentTarget] = useState<Animal | null>(null);

    // Star rewards state
    const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
    const [starsEarned, setStarsEarned] = useState(0);
    const [showStarAnimation, setShowStarAnimation] = useState(false);

    const { isLocked, setIsLocked, startAudioChain } = useAudioChain();

    const initializeGame = useCallback((playIntro: boolean) => {
        setIsLocked(true);
        setGameState('memorizing');
        setFoundIndices(new Set());
        setCurrentTarget(null);
        setConsecutiveCorrect(0);
        setStarsEarned(0);
        setShowStarAnimation(false);

        const newAnimals = [...ANIMALS].sort(() => 0.5 - Math.random()).slice(0, 9);
        setAnimals(newAnimals);
        setQuestions([...newAnimals].sort(() => 0.5 - Math.random()));

        if (playIntro) {
            setTimeout(() => startAudioChain([(VOICE_PROMPTS[language].MEMORY_GAME_START as {path: string}).path]), 500);
        } else {
             setTimeout(() => setIsLocked(false), 500);
        }
    }, [language, startAudioChain, setIsLocked]);
    
    const playQuestion = useCallback(() => {
        if (!currentTarget) return;
        const questionPrompt = (VOICE_PROMPTS[language].NAME_GAME_QUESTION as {path: string}[])[0].path;
        startAudioChain([questionPrompt, currentTarget.nameSoundUrl, currentTarget.nameSoundUrl_en]);
    }, [currentTarget, language, startAudioChain]);
    
    useEffect(() => {
        initializeGame(true);
    }, [initializeGame]);
    
    useEffect(() => {
        if (gameState === 'playing' && currentTarget) {
            setTimeout(playQuestion, 800);
        }
    }, [gameState, currentTarget, playQuestion]);
    
    useEffect(() => {
        if (gameState === 'won') {
            const sounds = [
                (VOICE_PROMPTS[language].WIN_ALL_FOUND as {path: string}).path,
                (VOICE_PROMPTS[language].WIN_CONGRATS as {path: string}).path
            ];
            setTimeout(() => startAudioChain(sounds), 500);
        }
    }, [gameState, language, startAudioChain]);
    
    const handleStartGame = () => {
        if(isLocked) return;
        stopAllAudio();
        setIsLocked(true);
        setGameState('playing');
        setCurrentTarget(questions[0]);
    };

    const handleCardClick = (index: number) => {
        if (isLocked || gameState !== 'playing') return;
        
        if (foundIndices.has(index)) {
            startAudioChain([(VOICE_PROMPTS[language].WRONG_ALREADY_FOUND as {path: string}).path]);
            return;
        }

        const clickedAnimal = animals[index];
        
        if (clickedAnimal.id === currentTarget?.id) {
            const newFoundIndices = new Set(foundIndices).add(index);
            
            const praiseSound = (VOICE_PROMPTS[language].CORRECT_PRAISE as {path: string}[])[Math.floor(Math.random() * 5)].path;
            const prefixSound = (VOICE_PROMPTS[language].CORRECT_PREFIX_MEMORY as {path: string}).path;
            const sounds = [prefixSound, clickedAnimal.nameSoundUrl, clickedAnimal.nameSoundUrl_en, praiseSound];

            const newConsecutiveCorrect = consecutiveCorrect + 1;
            let onEndCallback: () => void;

            const nextAction = () => {
                setFoundIndices(newFoundIndices);
                const nextTarget = questions.find(q => !Array.from(newFoundIndices).some(idx => animals[idx].id === q.id));
                if (nextTarget) {
                    setCurrentTarget(nextTarget);
                } else if (newFoundIndices.size === animals.length) {
                    setGameState('won');
                    setCurrentTarget(null);
                }
            };

            if (newConsecutiveCorrect >= 3) {
                setConsecutiveCorrect(0);
                sounds.push((VOICE_PROMPTS[language].STAR_AWARDED as { path: string }).path);
                onEndCallback = () => {
                    setStarsEarned(prev => prev + 1);
                    setShowStarAnimation(true);
                    setTimeout(() => {
                        setShowStarAnimation(false);
                        nextAction();
                    }, 1500);
                };
            } else {
                setConsecutiveCorrect(newConsecutiveCorrect);
                onEndCallback = nextAction;
            }

            startAudioChain(sounds, onEndCallback);

        } else {
            setConsecutiveCorrect(0);
            const suffixSound = (VOICE_PROMPTS[language].WRONG_SUFFIXES as {path: string}[])[Math.floor(Math.random() * 3)].path;
            const sounds = [
                (VOICE_PROMPTS[language].WRONG_GENERIC_ERROR as {path: string}).path,
                (VOICE_PROMPTS[language].WRONG_SOUND_PROMPT as {path: string}).path,
                clickedAnimal.animalSoundUrl,
                suffixSound
            ];
            startAudioChain(sounds, playQuestion);
        }
    };

    const handlePlayAgain = () => {
        if (isLocked) return;
        startAudioChain(
            [(VOICE_PROMPTS[language].PLAY_AGAIN_PROMPT as {path: string}).path, (VOICE_PROMPTS[language].SHUFFLE_PROMPT as {path: string}).path],
            () => initializeGame(false)
        );
    };

    let promptText: React.ReactNode = '';
    if (gameState === 'memorizing') {
        promptText = t.memoryGame.memorize;
    } else if (gameState === 'playing' && currentTarget) {
        promptText = t.memoryGame.prompt.replace('{animal}', language === 'en' ? currentTarget.name_en : currentTarget.name_ar);
    } else if (gameState === 'won') {
        promptText = t.memoryGame.youWon;
    }
    
    const buttonStyle = "bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-sky-300 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100";
    const iconStyle = "h-7 w-7 md:h-8 md:h-8 text-sky-600";
    
    const backButton = (
        <button onClick={() => { stopAllAudio(); onGoBack && onGoBack(); }} className={buttonStyle} aria-label={t.gamesMenu.backToGames} disabled={isLocked}>
            <BackIcon className={iconStyle}/>
        </button>
    );

    let actionControl;
    if (gameState === 'memorizing') {
        actionControl = (
            <button
                onClick={handleStartGame}
                disabled={isLocked}
                className="bg-green-500 hover:bg-green-600 text-white font-bold text-xl md:text-2xl py-2 px-6 rounded-full shadow-md transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-wait"
            >
                {t.memoryGame.start}
            </button>
        );
    } else if (gameState === 'playing') {
        actionControl = (
            <button onClick={playQuestion} className={buttonStyle} aria-label={t.gamesMenu.hearQuestion} disabled={isLocked}>
                <SoundOnIcon className={iconStyle}/>
            </button>
        );
    } else { 
        actionControl = <div style={{ width: '52px', height: '52px'}} className="md:w-[56px] md:h-[56px]" />;
    }

    return (
      <div className="w-full h-full flex flex-col">
        <div className="flex-grow flex items-center justify-center p-2">
            <div className="relative w-full max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
                <StarCounter count={starsEarned} />
                {showStarAnimation && <StarCelebration />}
                <div className="grid grid-cols-3 gap-3 md:gap-4">
                    {animals.map((animal, index) => {
                        const isFound = foundIndices.has(index);
                        const isFaceUp = gameState === 'memorizing' || isFound;
                        
                        return (
                           <MemoryCard
                                key={`${animal.id}-${index}`}
                                animal={animal}
                                isFlipped={isFaceUp}
                                onClick={() => handleCardClick(index)}
                                disabled={isLocked || gameState !== 'playing'}
                            />
                        );
                    })}
                </div>
                {gameState === 'won' && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-2xl animate-fade-in z-10">
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 text-center px-4" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.5)' }}>
                            {t.memoryGame.youWon}
                        </h2>
                        <button
                            onClick={handlePlayAgain}
                            disabled={isLocked}
                            className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-3xl md:text-4xl py-4 px-10 rounded-full shadow-lg transform hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-wait"
                        >
                            {t.memoryGame.playAgain}
                        </button>
                    </div>
                )}
            </div>
        </div>

        <div className="flex-shrink-0 flex items-center justify-center mb-2 px-4">
             <div className="bg-white/90 rounded-full py-2 px-3 w-full max-w-2xl lg:max-w-3xl shadow-lg flex items-center justify-between gap-3">
                 {language === 'ar' ? (
                     <>
                        {actionControl}
                        <div className="text-xl md:text-2xl font-bold text-gray-800 flex-1 text-center mx-2">{promptText}</div>
                        {backButton}
                     </>
                 ) : (
                     <>
                        {backButton}
                        <div className="text-xl md:text-2xl font-bold text-gray-800 flex-1 text-center mx-2">{promptText}</div>
                        {actionControl}
                     </>
                 )}
            </div>
        </div>
      </div>
    );
};

export default MemoryGame;
