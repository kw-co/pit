

import React, { useState, useEffect, useCallback } from 'react';
import { Animal } from '../types';
import { ANIMALS, VOICE_PROMPTS, BackIcon, ReplayIcon } from '../constants';
import { useLanguage } from '../contexts/LanguageContext';
import { useAudio, stopAllAudio } from '../hooks/useAudio';
import AssetImage from './AssetImage';
import { useAudioChain } from './../hooks/useAudioChain';

type GameState = 'intro' | 'computer_turn' | 'player_turn' | 'won';

const SoundChainGame: React.FC<{ onGoBack?: () => void }> = ({ onGoBack = () => {} }) => {
    const { language, translations: t } = useLanguage();
    
    const [gameState, setGameState] = useState<GameState>('intro');
    const [animalsOnScreen, setAnimalsOnScreen] = useState<Animal[]>([]);
    const [sequence, setSequence] = useState<Animal[]>([]);
    const [playerInputIndex, setPlayerInputIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [activeAnimalId, setActiveAnimalId] = useState<number | null>(null);
    const [mistakeInfo, setMistakeInfo] = useState<{ wrongId: number; correctId: number } | null>(null);

    const { isLocked, setIsLocked, startAudioChain } = useAudioChain();

    const playSequence = useCallback((seq: Animal[]) => {
        setIsLocked(true);
        setGameState('computer_turn');
        
        // This brief timeout provides a clear separation between player action and the computer's turn.
        setTimeout(() => {
            let i = 0;
            const playNext = () => {
                if (i >= seq.length) {
                    setActiveAnimalId(null);
                    setGameState('player_turn');
                    setPlayerInputIndex(0);
                    setIsLocked(false);
                    return;
                }
                const animal = seq[i];
                setActiveAnimalId(animal.id);
                // The onEnded callback here triggers the next sound in the sequence.
                startAudioChain([animal.animalSoundUrl], () => {
                    i++;
                    setTimeout(playNext, 200); // A short, rhythmic pause between sounds
                });
            };
            playNext();
        }, 500);
    }, [startAudioChain, setIsLocked]);


    const handleSequenceComplete = useCallback(() => {
        const newScore = sequence.length;
        setScore(newScore);

        if (newScore >= animalsOnScreen.length && animalsOnScreen.length > 0) {
            setGameState('won');
            const winSounds = [
                (VOICE_PROMPTS[language].PERFECT_SCORE_CELEBRATION as { path: string }).path,
                (VOICE_PROMPTS[language].WIN_CONGRATS as { path: string }).path,
            ];
            startAudioChain(winSounds);
            return;
        }

        const remainingAnimals = animalsOnScreen.filter(a => !sequence.find(s => s.id === a.id));
        const newAnimal = remainingAnimals[Math.floor(Math.random() * remainingAnimals.length)];
        const newSequence = [...sequence, newAnimal];
        
        const praiseSound = (VOICE_PROMPTS[language].CORRECT_PRAISE as { path: string }[])[Math.floor(Math.random() * 5)].path;
        startAudioChain([praiseSound], () => {
            setSequence(newSequence);
            playSequence(newSequence);
        });

    }, [sequence, animalsOnScreen, language, playSequence, startAudioChain]);

    const handleCardClick = (clickedAnimal: Animal) => {
        if (isLocked || gameState !== 'player_turn') return;

        const correctAnimal = sequence[playerInputIndex];

        if (clickedAnimal.id === correctAnimal.id) {
            // Correct click
            setActiveAnimalId(clickedAnimal.id);
            startAudioChain([clickedAnimal.animalSoundUrl], () => setActiveAnimalId(null));
            
            const nextIndex = playerInputIndex + 1;
            if (nextIndex >= sequence.length) {
                setIsLocked(true);
                setTimeout(handleSequenceComplete, 500); 
            } else {
                setPlayerInputIndex(nextIndex);
            }
        } else {
            // Mistake Helper logic
            setIsLocked(true);
            setMistakeInfo({ wrongId: clickedAnimal.id, correctId: correctAnimal.id });

            const wrongSound = (VOICE_PROMPTS[language].WRONG_GENERIC_ERROR as { path: string }).path;
            const tryAgainSound = (VOICE_PROMPTS[language].WRONG_SUFFIXES as { path: string }[])[1].path; // "حاول ثانية" / "Try again"
            
            startAudioChain([wrongSound, correctAnimal.animalSoundUrl, tryAgainSound], () => {
                setMistakeInfo(null);
                playSequence(sequence); // Replay the same sequence for another try
            });
        }
    };
    
    const initializeGame = useCallback(() => {
        stopAllAudio();
        setGameState('intro');
        setSequence([]);
        setScore(0);
        setPlayerInputIndex(0);
        setActiveAnimalId(null);
        setMistakeInfo(null);
        setIsLocked(true);
        const newGameAnimals = [...ANIMALS].sort(() => 0.5 - Math.random()).slice(0, 9);
        setAnimalsOnScreen(newGameAnimals);
    }, [setIsLocked]);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);
    
    const handleStart = () => {
        if (animalsOnScreen.length === 0) return;
        const introSound = (VOICE_PROMPTS[language].SOUND_CHAIN_GAME_INTRO as { path: string }).path;
        startAudioChain([introSound], () => {
             // Start with a sequence of one animal
            const firstAnimal = animalsOnScreen[0];
            const firstSequence = [firstAnimal];
            setSequence(firstSequence);
            playSequence(firstSequence);
        });
    };

    const handleReplaySequence = () => {
        if (isLocked || gameState !== 'player_turn') return;
        playSequence(sequence);
    };

    let promptText = '';
    switch(gameState) {
        case 'intro': promptText = t.soundChainGame.prompt_start; break;
        case 'computer_turn': promptText = t.soundChainGame.prompt_computer; break;
        case 'player_turn': promptText = `${t.soundChainGame.prompt_player} (${playerInputIndex + 1}/${sequence.length})`; break;
        case 'won': promptText = t.soundChainGame.youWon; break;
    }

    return (
        <div className="w-full h-full flex flex-col text-center p-2 sm:p-4">
            <div className="flex-shrink-0 flex justify-around items-center bg-white/80 text-gray-800 rounded-2xl shadow-lg p-2 md:p-3 mb-2 sm:mb-4 mx-auto w-full max-w-lg">
                <div className="text-center">
                    <div className="font-bold text-base sm:text-lg md:text-xl">{t.soundChainGame.score}</div>
                    <div className="text-2xl md:text-3xl font-bold text-green-600">{score} / 9</div>
                </div>
            </div>

            <div className="flex-grow flex items-center justify-center relative">
                <div className="grid grid-cols-3 gap-2 sm:gap-3 md:gap-4 w-full max-w-xl md:max-w-2xl lg:max-w-3xl mx-auto">
                    {animalsOnScreen.map(animal => {
                        const isWrongClick = mistakeInfo?.wrongId === animal.id;
                        const isCorrectHint = mistakeInfo?.correctId === animal.id;

                        return (
                            <div key={animal.id} className="relative">
                                <div 
                                    onClick={() => handleCardClick(animal)}
                                    className={`
                                        aspect-square bg-white rounded-2xl shadow-lg overflow-hidden p-1
                                        transform transition-all duration-200
                                        ${isLocked || gameState !== 'player_turn' ? 'cursor-wait' : 'hover:scale-105 cursor-pointer'}
                                        ${activeAnimalId === animal.id ? 'scale-110 ring-4 ring-yellow-400 z-10' : ''}
                                        ${isWrongClick ? 'ring-4 ring-red-500 animate-shake' : ''}
                                        ${isCorrectHint ? 'scale-110 ring-4 ring-green-500' : ''}
                                    `}
                                >
                                    <AssetImage path={animal.imageUrl} alt={animal.name_ar} className="w-full h-full object-contain" />
                                </div>
                            </div>
                        );
                    })}
                </div>
                {(gameState === 'intro' || gameState === 'won') && (
                    <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center rounded-2xl animate-fade-in z-20 p-2 sm:p-4">
                         <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 sm:mb-8 text-center px-4" style={{ textShadow: '3px 3px 6px rgba(0,0,0,0.5)' }}>
                            {gameState === 'intro' ? t.soundChainGame.title : t.soundChainGame.youWon}
                        </h2>
                        <button 
                            onClick={gameState === 'intro' ? handleStart : initializeGame} 
                            disabled={isLocked && gameState !== 'intro'}
                            className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-2xl sm:text-3xl py-3 px-8 sm:py-4 sm:px-10 rounded-full shadow-lg transform hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-wait"
                        >
                             {gameState === 'intro' ? t.memoryGame.start : t.soundChainGame.playAgain}
                        </button>
                    </div>
                )}
            </div>
            
            <div className="flex-shrink-0 bg-white/90 rounded-full py-2 px-3 mt-2 sm:mt-4 mx-auto w-full max-w-lg shadow-lg flex items-center justify-between gap-3">
                 <button onClick={() => { stopAllAudio(); onGoBack && onGoBack(); }} className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-transform hover:scale-110 disabled:opacity-50" disabled={isLocked}>
                    <BackIcon className="h-7 w-7 md:h-8 md:h-8 text-sky-600"/>
                </button>
                <div className="font-bold text-lg md:text-xl text-gray-800 flex-1">{promptText}</div>
                <button
                  onClick={handleReplaySequence}
                  className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-transform hover:scale-110 disabled:opacity-50"
                  disabled={isLocked || gameState !== 'player_turn'}
                  aria-label={t.soundChainGame.showAgain}
                >
                    <ReplayIcon className="h-7 w-7 md:h-8 md:h-8 text-sky-600"/>
                </button>
            </div>
        </div>
    );
};

export default SoundChainGame;