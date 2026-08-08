
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Animal, DietType } from '../types';
import { ANIMALS, VOICE_PROMPTS, BackIcon, SoundOnIcon, TrophyIcon, StarIcon } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { useAudio, stopAllAudio } from '../hooks/useAudio';
import AssetImage from './AssetImage';
import { useTextToSpeech } from '../hooks/useTextToSpeech';
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

const DietGame: React.FC<{ onGoBack?: () => void }> = ({ onGoBack = () => {} }) => {
    const { language, translations: t } = useLanguage();
    const { speak } = useTextToSpeech(language);

    const [gameAnimals, setGameAnimals] = useState<Animal[]>([]);
    const [currentAnimalIndex, setCurrentAnimalIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [clickedDiet, setClickedDiet] = useState<DietType | null>(null);
    const [isGameWon, setIsGameWon] = useState(false);

    // Star rewards state
    const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
    const [starsEarned, setStarsEarned] = useState(0);
    const [showStarAnimation, setShowStarAnimation] = useState(false);

    const { isLocked, setIsLocked, startAudioChain } = useAudioChain();

    const currentAnimal = useMemo(() => gameAnimals[currentAnimalIndex], [gameAnimals, currentAnimalIndex]);

    const initializeGame = useCallback(() => {
        setIsLocked(true);
        setIsGameWon(false);
        setScore(0);
        setCurrentAnimalIndex(0);
        setFeedback(null);
        setClickedDiet(null);
        setConsecutiveCorrect(0);
        setStarsEarned(0);
        setShowStarAnimation(false);
        const newGameAnimals = [...ANIMALS].sort(() => 0.5 - Math.random()).slice(0, 10); // 10 rounds
        setGameAnimals(newGameAnimals);
    }, [setIsLocked]);

    const playQuestion = useCallback(() => {
        if (!currentAnimal) return;

        const isFirst = currentAnimalIndex === 0;
        const introSound = isFirst ? (VOICE_PROMPTS[language].GAME_START_PROMPT as { path: string }).path : undefined;
        const nameSounds = language === 'en' ? [currentAnimal.nameSoundUrl_en, currentAnimal.nameSoundUrl] : [currentAnimal.nameSoundUrl, currentAnimal.nameSoundUrl_en];

        startAudioChain([introSound, ...nameSounds]);
    }, [currentAnimal, language, startAudioChain, currentAnimalIndex]);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    useEffect(() => {
        if (currentAnimal && !isGameWon) {
            const timer = setTimeout(playQuestion, 500);
            return () => clearTimeout(timer);
        }
    }, [currentAnimal, isGameWon, playQuestion]);
    
    useEffect(() => {
        if (isGameWon) {
            let sounds;
            // Perfect score check
            if (score === gameAnimals.length && gameAnimals.length > 0) {
                sounds = [
                    (VOICE_PROMPTS[language].PERFECT_SCORE_CELEBRATION as { path: string }).path,
                    (VOICE_PROMPTS[language].WIN_CONGRATS as { path: string }).path,
                ];
            } else {
                sounds = [(VOICE_PROMPTS[language].WIN_CONGRATS as { path: string }).path];
            }
            setTimeout(() => startAudioChain(sounds, () => setIsLocked(false)), 500);
        }
    }, [isGameWon, score, gameAnimals.length, language, startAudioChain, setIsLocked]);


    const handleDietClick = (diet: DietType) => {
        if (isLocked || !currentAnimal) return;
        setClickedDiet(diet);

        const isCorrect = diet === currentAnimal.diet;
        setFeedback(isCorrect ? 'correct' : 'wrong');

        if (isCorrect) {
            setScore(s => s + 1);
            const newConsecutiveCorrect = consecutiveCorrect + 1;
            const praiseSound = (VOICE_PROMPTS[language].CORRECT_PRAISE as {path: string}[])[Math.floor(Math.random() * 5)].path;
            
            let sounds = [praiseSound];
            let onEndCallback: () => void;

            const nextAction = () => {
                setFeedback(null);
                setClickedDiet(null);
                if (currentAnimalIndex < gameAnimals.length - 1) {
                    setCurrentAnimalIndex(prev => prev + 1);
                } else {
                    setIsGameWon(true);
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
            const animalName = language === 'en' ? currentAnimal.name_en : currentAnimal.name_ar;
            const dietName = language === 'en' ? currentAnimal.diet.replace('آكل ', '').replace('قارت', 'Omnivore') : currentAnimal.diet;
            
            const hintText = language === 'en' ? `${animalName} is an ${dietName}` : `${currentAnimal.name_ar} هو ${currentAnimal.diet}`;
            
            startAudioChain([suffixSound], () => {
                speak(hintText, () => {
                    setFeedback(null);
                    setClickedDiet(null);
                    setIsLocked(false);
                });
            });
        }
    };
    
    const handlePlayAgain = () => {
        if (isLocked) return;
        startAudioChain(
            [(VOICE_PROMPTS[language].PLAY_AGAIN_PROMPT as {path: string}).path, (VOICE_PROMPTS[language].SHUFFLE_PROMPT as {path: string}).path],
            initializeGame
        );
    };

    if (!currentAnimal) return <div className="text-white text-2xl text-center">{t.loading}</div>;

    const dietOptions = [
        { diet: DietType.HERBIVORE, emoji: "🥕", label: t.factModal.dietHerbivore },
        { diet: DietType.CARNIVORE, emoji: "🍖", label: t.factModal.dietCarnivore },
        { diet: DietType.OMNIVORE, emoji: "🥕🍖", label: t.factModal.dietOmnivore },
    ];
        
    return (
        <div className="w-full h-full flex flex-col text-center relative p-4 animate-fade-in">
             <div className="relative flex-grow flex flex-col items-center justify-center">
                {showStarAnimation && <StarCelebration />}
                <StarCounter count={starsEarned} />
                
                <div className="w-48 h-48 md:w-64 md:h-64 bg-white/50 rounded-full shadow-lg border-4 border-white mb-6 p-2">
                    <AssetImage path={currentAnimal.imageUrl} alt={currentAnimal.name_ar} className="w-full h-full object-contain"/>
                </div>

                <h2 className="text-2xl md:text-4xl font-bold text-shadow-md text-white mb-8">{isGameWon ? t.dietGame.youWon : (language === 'en' ? currentAnimal.name_en : currentAnimal.name_ar)}</h2>
                
                <div className="grid grid-cols-3 gap-4 md:gap-8 w-full max-w-2xl">
                    {dietOptions.map(({ diet, emoji, label }) => {
                        const isCorrectSelection = feedback === 'correct' && clickedDiet === diet;
                        const isWrongSelection = feedback === 'wrong' && clickedDiet === diet;
                        return (
                            <button
                                key={diet}
                                disabled={isLocked}
                                onClick={() => handleDietClick(diet)}
                                className={`
                                    flex flex-col items-center justify-center gap-2 p-4 rounded-3xl shadow-lg border-4 border-white
                                    transition-all duration-300 transform
                                    ${isLocked ? 'opacity-60 cursor-wait' : 'hover:scale-105'}
                                    ${isCorrectSelection ? 'bg-green-400 animate-gentle-wiggle' : isWrongSelection ? 'bg-red-400 animate-shake' : 'bg-white/80'}
                                `}
                            >
                                <span className="text-5xl md:text-6xl" role="img" aria-label={diet}>{emoji}</span>
                                <span className="text-xl md:text-2xl font-bold text-gray-800">{label}</span>
                            </button>
                        );
                    })}
                </div>
            </div>
             {isGameWon && (
                <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-2xl animate-fade-in z-10 p-4">
                    {score === gameAnimals.length && gameAnimals.length > 0 ? (
                        <div className="bg-gradient-to-br from-yellow-200 via-yellow-300 to-amber-200 text-amber-900 rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md border-4 border-amber-400 text-center">
                            <TrophyIcon className="w-16 h-16 md:w-20 md:h-20 mx-auto text-amber-600 mb-4" />
                            <h2 className="text-2xl md:text-3xl font-bold mb-2">{t.dietGame.perfectScore.title}</h2>
                            <p className="text-xl md:text-2xl font-semibold text-amber-800 mb-4">{t.dietGame.perfectScore.congrats}</p>
                            <p className="text-base md:text-lg">{t.dietGame.perfectScore.text}</p>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-center">{t.dietGame.youWon}</h2>
                            <p className="text-2xl text-yellow-300 mb-8">{`${t.dietGame.score}: ${score} / ${gameAnimals.length}`}</p>
                        </>
                    )}
                    <button 
                        onClick={handlePlayAgain} 
                        disabled={isLocked}
                        className="mt-8 bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-2xl md:text-3xl py-3 px-8 rounded-full shadow-lg transform hover:scale-105 transition-transform disabled:opacity-50"
                    >
                        {t.dietGame.playAgain}
                    </button>
                </div>
            )}
            <div className="flex-shrink-0 bg-white/90 rounded-full py-2 px-3 mt-4 mx-auto w-full max-w-lg shadow-lg flex items-center justify-between gap-3">
                 <button onClick={() => { stopAllAudio(); onGoBack && onGoBack(); }} className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-transform hover:scale-110 disabled:opacity-50" disabled={isLocked}>
                    <BackIcon className="h-7 w-7 md:h-8 md:h-8 text-sky-600"/>
                </button>
                <div className="font-bold text-xl text-gray-800">{t.dietGame.score}: {score}</div>
                <button onClick={playQuestion} className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-transform hover:scale-110 disabled:opacity-50" disabled={isLocked}>
                    <SoundOnIcon className="h-7 w-7 md:h-8 md:h-8 text-sky-600"/>
                </button>
            </div>
        </div>
    );
};

export default DietGame;
