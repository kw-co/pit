
import React, { useState, useEffect, useCallback } from 'react';
import { Animal } from '../types';
import { ANIMALS, VOICE_PROMPTS, SoundOnIcon, BackIcon, StarIcon } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
import { useAudio, stopAllAudio } from '../hooks/useAudio';
import AnimalCard from './AnimalCard';
import { useAudioChain } from './../hooks/useAudioChain';

const StarCounter: React.FC<{ count: number }> = ({ count }) => {
  const { language } = useLanguage();
  if (count === 0) return null;
  
  const positionClass = language === 'ar' ? "absolute top-4 left-4" : "absolute top-4 right-4";
  
  return (
    <div className={`${positionClass} z-20 flex items-center gap-2 rounded-full bg-black/30 px-4 py-2 font-bold text-yellow-300 text-2xl`}>
      <StarIcon className="h-8 w-8" />
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

const GameContainer: React.FC<{ 
  prompt: string; 
  onPromptSound?: () => void; 
  children: React.ReactNode; 
  onGoBack: () => void; 
  isLocked?: boolean;
}> = ({ prompt, onPromptSound, children, onGoBack, isLocked = false }) => {
  const { language, translations: t } = useLanguage();

  const buttonStyle = "bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-sky-300 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100";
  const iconStyle = "h-7 w-7 md:h-8 md:h-8 text-sky-600";
  
  const handlePromptSound = () => {
    if (onPromptSound) {
      stopAllAudio();
      onPromptSound();
    }
  };
  
  const backButton = (
      <button onClick={() => { stopAllAudio(); onGoBack(); }} className={buttonStyle} aria-label={t.gamesMenu.backToGames} disabled={isLocked}>
          <BackIcon className={iconStyle}/>
      </button>
  );

  const soundButton = (
      <button onClick={handlePromptSound} className={buttonStyle} aria-label={t.gamesMenu.hearQuestion} disabled={isLocked}>
          <SoundOnIcon className={iconStyle}/>
      </button>
  );

  const promptText = (
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex-1 text-center mx-2 whitespace-nowrap">{prompt}</h2>
  );

  return (
    <div className="w-full h-full flex flex-col text-center relative">
        <div className="flex-grow flex items-center justify-center p-2">
            {children}
        </div>
        <div className="flex-shrink-0 bg-white/90 rounded-full py-2 px-3 mb-4 mx-auto w-full max-w-2xl lg:max-w-3xl shadow-lg flex items-center justify-between gap-3">
          {language === 'ar' ? (
             <>
                {onPromptSound ? soundButton : <div className="w-11 h-11" />}
                {promptText}
                {backButton}
             </>
          ) : (
             <>
                {backButton}
                {promptText}
                {onPromptSound ? soundButton : <div className="w-11 h-11" />}
             </>
          )}
        </div>
    </div>
  );
};

const SoundGame: React.FC<{ onGoBack?: () => void }> = ({ onGoBack = () => {} }) => {
    const { language, translations: t } = useLanguage();
    const { speak, isReady: isTtsReady } = useTextToSpeech(language);

    const [animalsOnScreen, setAnimalsOnScreen] = useState<Animal[]>([]);
    const [foundAnimalIds, setFoundAnimalIds] = useState<Set<number>>(new Set());
    const [targetAnimal, setTargetAnimal] = useState<Animal | null>(null);
    const [clickedAnimal, setClickedAnimal] = useState<Animal | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [isGameWon, setIsGameWon] = useState(false);
    const [mistakesPerTarget, setMistakesPerTarget] = useState<Record<number, number>>({});

    // Star rewards state
    const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
    const [starsEarned, setStarsEarned] = useState(0);
    const [showStarAnimation, setShowStarAnimation] = useState(false);

    const { isLocked, setIsLocked, startAudioChain } = useAudioChain();

    const initializeGame = useCallback(() => {
        setIsLocked(true);
        setIsGameWon(false);
        setFoundAnimalIds(new Set());
        setFeedback(null);
        setClickedAnimal(null);
        setMistakesPerTarget({});
        setConsecutiveCorrect(0);
        setStarsEarned(0);
        setShowStarAnimation(false);
        const newGameAnimals = [...ANIMALS].sort(() => 0.5 - Math.random()).slice(0, 9);
        setAnimalsOnScreen(newGameAnimals);
    }, [setIsLocked]);

    const playQuestion = useCallback(() => {
        if (!targetAnimal) return;
        
        const isFirst = foundAnimalIds.size === 0;
        const questionPromptSound = (VOICE_PROMPTS[language].SOUND_GAME_QUESTION as {path: string}).path;
        const introSound = isFirst ? (VOICE_PROMPTS[language].GAME_START_PROMPT as {path: string}).path : undefined;
        
        startAudioChain([introSound, questionPromptSound, targetAnimal.animalSoundUrl]);
    }, [targetAnimal, language, startAudioChain, foundAnimalIds]);
    
    // --- NEW, ROBUST GAME FLOW LOGIC ---

    // 1. Initialize game on mount
    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    // 2. Select the FIRST target when the board is ready
    useEffect(() => {
        if (animalsOnScreen.length > 0 && foundAnimalIds.size === 0) {
            const firstTarget = animalsOnScreen[Math.floor(Math.random() * animalsOnScreen.length)];
            setTargetAnimal(firstTarget);
        }
    }, [animalsOnScreen, foundAnimalIds]);

    // 3. Select SUBSEQUENT targets after a correct answer
    useEffect(() => {
        if (foundAnimalIds.size > 0 && animalsOnScreen.length > 0) {
            setFeedback(null);
            setClickedAnimal(null);

            const remainingAnimals = animalsOnScreen.filter(a => !foundAnimalIds.has(a.id));

            if (remainingAnimals.length > 0) {
                const newTarget = remainingAnimals[Math.floor(Math.random() * remainingAnimals.length)];
                setTargetAnimal(newTarget);
            } else {
                setIsGameWon(true);
            }
        }
    }, [foundAnimalIds, animalsOnScreen]);

    // 4. Play the question sound whenever the target changes
    useEffect(() => {
        if (targetAnimal && !isGameWon) {
            const timer = setTimeout(playQuestion, 800);
            return () => clearTimeout(timer);
        }
    }, [targetAnimal, isGameWon, playQuestion]);

    // 5. Play win sound when game is won
    useEffect(() => {
        if (isGameWon) {
            const sounds = [
                (VOICE_PROMPTS[language].WIN_ALL_FOUND as {path: string}).path,
                (VOICE_PROMPTS[language].WIN_CONGRATS as {path: string}).path
            ];
            const timer = setTimeout(() => startAudioChain(sounds, () => setIsLocked(false)), 500);
            return () => clearTimeout(timer);
        }
    }, [isGameWon, language, startAudioChain, setIsLocked]);


    const handleAnimalClick = (animal: Animal) => {
        if (isLocked || !targetAnimal) return;

        if (foundAnimalIds.has(animal.id)) {
            startAudioChain([(VOICE_PROMPTS[language].WRONG_ALREADY_FOUND as {path: string}).path]);
            return;
        }

        setClickedAnimal(animal);
        const isCorrect = animal.id === targetAnimal.id;
        setFeedback(isCorrect ? 'correct' : 'wrong');

        if (isCorrect) {
            const newConsecutiveCorrect = consecutiveCorrect + 1;
            const isFirstTry = (mistakesPerTarget[targetAnimal.id] || 0) === 0;
            let prefixSound;
            if (isFirstTry && Math.random() < 0.33) {
                prefixSound = (VOICE_PROMPTS[language].CORRECT_PREFIX_KNOWLEDGE as {path: string}).path;
            } else {
                prefixSound = (VOICE_PROMPTS[language].CORRECT_PREFIX_FIND as {path: string}).path;
            }

            setMistakesPerTarget(prev => ({ ...prev, [targetAnimal.id]: 0 }));
            const praiseSound = (VOICE_PROMPTS[language].CORRECT_PRAISE as {path: string}[])[Math.floor(Math.random() * 5)].path;
            const nameSounds = language === 'en' ? [targetAnimal.nameSoundUrl_en, targetAnimal.nameSoundUrl] : [targetAnimal.nameSoundUrl, targetAnimal.nameSoundUrl_en];
            
            let sounds = [prefixSound, ...nameSounds, praiseSound];
            let onEndCallback: () => void;

            if (newConsecutiveCorrect >= 3) {
                setConsecutiveCorrect(0);
                sounds.push((VOICE_PROMPTS[language].STAR_AWARDED as { path: string }).path);
                onEndCallback = () => {
                    setStarsEarned(prev => prev + 1);
                    setShowStarAnimation(true);
                    setTimeout(() => {
                        setShowStarAnimation(false);
                        setFoundAnimalIds(prev => new Set(prev).add(animal.id));
                    }, 1500);
                };
            } else {
                setConsecutiveCorrect(newConsecutiveCorrect);
                onEndCallback = () => {
                    setFoundAnimalIds(prev => new Set(prev).add(animal.id));
                };
            }

            startAudioChain(sounds, onEndCallback);

        } else {
            setConsecutiveCorrect(0);
            const newMistakeCount = (mistakesPerTarget[targetAnimal.id] || 0) + 1;
            setMistakesPerTarget(prev => ({ ...prev, [targetAnimal.id]: newMistakeCount }));
            
            if (newMistakeCount >= 2 && isTtsReady) {
                const hintFact = (language === 'en' ? targetAnimal.facts_en : targetAnimal.facts_ar)[0] || '';
                const helpSound = (VOICE_PROMPTS[language].WRONG_HELP_PROMPT as {path: string}).path;
                startAudioChain([helpSound], () => {
                    speak(hintFact, () => {
                        setFeedback(null);
                        setClickedAnimal(null);
                        playQuestion();
                    });
                });
            } else { // First mistake or TTS not ready
                const clickedNameSounds = language === 'en' ? [animal.nameSoundUrl_en, animal.nameSoundUrl] : [animal.nameSoundUrl, animal.nameSoundUrl_en];
                const sounds = [
                    (VOICE_PROMPTS[language].WRONG_PREFIX as {path: string}).path,
                    ...clickedNameSounds,
                    (VOICE_PROMPTS[language].WRONG_SOUND_PROMPT as {path: string}).path,
                    animal.animalSoundUrl,
                    (VOICE_PROMPTS[language].WRONG_SUFFIXES as {path: string}[])[0].path
                ];

                 startAudioChain(sounds, () => {
                    setFeedback(null);
                    setClickedAnimal(null);
                    playQuestion();
                });
            }
        }
    };

    const handlePlayAgain = () => {
        if (isLocked) return;
        startAudioChain(
            [(VOICE_PROMPTS[language].PLAY_AGAIN_PROMPT as {path: string}).path, (VOICE_PROMPTS[language].SHUFFLE_PROMPT as {path: string}).path],
            initializeGame
        );
    };

    if (!targetAnimal && !isGameWon) return <div className="text-white text-2xl text-center">{t.loading}</div>;

    const promptText = isGameWon ? t.soundGame.youWon : t.soundGame.prompt;
    const playTargetSoundOnly = () => { if(targetAnimal) startAudioChain([targetAnimal.animalSoundUrl]); };
    
    return (
        <GameContainer prompt={promptText} onGoBack={onGoBack} onPromptSound={playTargetSoundOnly} isLocked={isLocked}>
            <div className="relative w-full h-full flex items-center justify-center">
                {showStarAnimation && <StarCelebration />}
                <StarCounter count={starsEarned} />
                <div className="grid grid-cols-3 gap-4 w-full max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
                    {animalsOnScreen.map(animal => {
                        const isFound = foundAnimalIds.has(animal.id);
                        const isCorrectClick = feedback === 'correct' && animal.id === clickedAnimal?.id;
                        const isWrongClick = feedback === 'wrong' && animal.id === clickedAnimal?.id;

                        return (
                            <div key={animal.id} className="relative">
                                <AnimalCard animal={animal} onClick={handleAnimalClick} disabled={isLocked || isFound} />
                                {(isFound || isCorrectClick) && (
                                    <div className="absolute inset-0 bg-green-500/80 rounded-2xl flex items-center justify-center text-6xl pointer-events-none animate-fade-in">✅</div>
                                )}
                                {isWrongClick && (
                                    <div className="absolute inset-0 bg-red-500/80 rounded-2xl flex items-center justify-center text-6xl pointer-events-none animate-fade-in">❌</div>
                                )}
                            </div>
                        );
                    })}
                </div>
                {isGameWon && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-2xl animate-fade-in z-10">
                        <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-8 text-center px-4" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.5)' }}>
                            {t.soundGame.youWon}
                        </h2>
                        <button
                            onClick={handlePlayAgain}
                            disabled={isLocked}
                            className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-3xl md:text-4xl py-4 px-10 rounded-full shadow-lg transform hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-wait"
                        >
                            {t.soundGame.playAgain}
                        </button>
                    </div>
                )}
            </div>
        </GameContainer>
    );
};

export default SoundGame;
