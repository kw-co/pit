

import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { Animal, Page, AnimalType } from './types';
import { 
    ANIMALS, SoundOnIcon, VOICE_PROMPTS, HomeIcon, BackIcon,
    BookIcon, GameIcon, SoundWaveIcon, MemoryIcon, GridIcon, AppleIcon,
    PawIcon, BirdIcon, ReptileIcon, AquaticIcon, AmphibianIcon, InsectIcon,
    getAnimalTypeTranslation, HelpIcon, WELCOME_MASCOTS, TicTacToeIcon, ExitIcon,
    ShieldIcon, CopyrightIcon, SoundChainIcon
} from './constants';
import AnimalCard from './components/AnimalCard';
import AnimalFactModal from './components/AnimalFactModal';
import AssetLoader from './components/AssetLoader';
import { useAudio, stopAllAudio } from './hooks/useAudio';
import { LanguageProvider, useLanguage, Language } from './contexts/LanguageContext';
import { useTextToSpeech } from './hooks/useTextToSpeech';
import { VolumeProvider } from './contexts/VolumeContext';
import MemoryGame from './components/MemoryGame';
import DietGame from './components/DietGame';
import SoundChainGame from './components/SoundChainGame';
import { AssetStatusProvider, useAssetStatus } from './contexts/AssetStatusContext';
import AssetImage from './components/AssetImage';
import TicTacToeNameGame from './components/TicTacToeNameGame';
import TicTacToeSoundGame from './components/TicTacToeSoundGame';
import TicTacToeMemoryGame from './components/TicTacToeMemoryGame';
import VolumeControl from './components/VolumeControl';
import DebugAudioPage from './components/DebugAudioPage';


const ErrorIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
  </svg>
);

const MainMenu: React.FC<{
  onNavigate: (page: Page) => void;
  onGoodbye: () => void;
  highlightedButtonOverride?: string | null;
}> = ({ onNavigate, onGoodbye, highlightedButtonOverride }) => {
    const { language, translations: t } = useLanguage();
    
    const menuOptions = [
        { page: 'facts', label: t.mainMenu.facts, Icon: BookIcon, color: 'text-teal-500' },
        { page: 'games_menu', label: t.mainMenu.games, Icon: GameIcon, color: 'text-orange-500' },
    ];
    
    return (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4">
            
            <div className="grid grid-cols-2 gap-6 md:gap-8 lg:gap-12 w-full max-w-2xl md:max-w-4xl lg:max-w-5xl mx-auto mb-8 mt-10">
                {menuOptions.map(opt => (
                  <button
                      key={opt.page}
                      onClick={() => { stopAllAudio(); onNavigate(opt.page as Page); }}
                      className={`cloud-button ${opt.color} ${highlightedButtonOverride === opt.page ? 'animate-gentle-wiggle' : ''}`}
                      aria-label={opt.label}
                  >
                      <opt.Icon className="w-12 h-12 md:w-16 md:h-16 lg:w-20 lg:h-20"/>
                      <span className="text-2xl md:text-3xl lg:text-4xl">{opt.label}</span>
                  </button>
                ))}
            </div>

            <div className="mt-8 flex items-center justify-center gap-6">
                <button
                    onClick={() => { stopAllAudio(); onNavigate('help'); }}
                    className="bg-sky-500/80 hover:bg-sky-500 text-white rounded-full py-3 px-4 md:py-4 md:px-5 shadow-lg transform transition-all hover:scale-110 flex items-center gap-3"
                    aria-label={t.mainMenu.help}
                >
                    <HelpIcon className="w-8 h-8 md:w-10 md:h-10" />
                    <span className="text-xl md:text-2xl font-bold">{t.mainMenu.help}</span>
                </button>
                 <button
                    onClick={onGoodbye}
                    className="bg-red-500/80 hover:bg-red-500 text-white rounded-full p-3 shadow-lg transform transition-all hover:scale-110"
                    aria-label={t.mainMenu.goodbye}
                >
                    <ExitIcon className="w-8 h-8 md:w-10 md:h-10" />
                </button>
            </div>
        </div>
    );
};


const AppHeader: React.FC<{ title: string; onGoBackToMenu?: () => void; }> = ({ title, onGoBackToMenu }) => {
  const { language, translations: t } = useLanguage();
  const homeButtonPosition = language === 'ar' ? "absolute left-4 top-1/2 -translate-y-1/2" : "absolute right-4 top-1/2 -translate-y-1/2";
  
  return (
    <header className="relative text-center p-4 flex-shrink-0">
      {onGoBackToMenu && (
        <button 
          onClick={() => { stopAllAudio(); onGoBackToMenu(); }} 
          className={`${homeButtonPosition} bg-white/80 rounded-full p-2 shadow-md hover:bg-white transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white`}
          aria-label={t.mainMenu.backToMenu}
          >
            <HomeIcon className="h-8 w-8 text-sky-600" />
        </button>
      )}
      <h1 className="text-4xl md:text-5xl font-bold text-white text-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.4)'}}>{title}</h1>
    </header>
  );
};

const FactsView: React.FC<{ onSelectAnimal: (animal: Animal) => void }> = ({ onSelectAnimal }) => {
    const { language, translations: t } = useLanguage();
    const playFactsPrompt = useAudio((VOICE_PROMPTS[language].FACTS_PROMPT as {path: string}).path);

    useEffect(() => {
        const timer = setTimeout(playFactsPrompt, 500);
        return () => clearTimeout(timer);
    }, [playFactsPrompt]);

    const animalsByType = useMemo(() => {
        const animalTypesInOrder: AnimalType[] = [
            AnimalType.MAMMAL, AnimalType.BIRD, AnimalType.REPTILE,
            AnimalType.AQUATIC, AnimalType.AMPHIBIAN, AnimalType.INSECT,
        ];
        
        const grouped = ANIMALS.reduce((acc, animal) => {
            if (!acc[animal.type]) acc[animal.type] = [];
            acc[animal.type].push(animal);
            return acc;
        }, {} as Record<AnimalType, Animal[]>);

        return animalTypesInOrder.map(type => ({
            type,
            animals: grouped[type] || []
        })).filter(group => group.animals.length > 0);

    }, []);

    const animalTypeIcons: Record<AnimalType, React.FC<{className?: string}>> = {
        [AnimalType.MAMMAL]: PawIcon, [AnimalType.BIRD]: BirdIcon,
        [AnimalType.REPTILE]: ReptileIcon, [AnimalType.AQUATIC]: AquaticIcon,
        [AnimalType.AMPHIBIAN]: AmphibianIcon, [AnimalType.INSECT]: InsectIcon,
    };

    return (
        <div className="flex-grow w-full max-w-7xl mx-auto overflow-y-auto px-2">
            <div className="space-y-8 py-4">
                {animalsByType.map(({ type, animals }) => {
                    const Icon = animalTypeIcons[type];
                    return (
                        <div key={type}>
                            <div className="flex items-center gap-4 mb-4 pb-2 border-b-4 border-white/50">
                                {Icon && <Icon className="w-10 h-10 md:w-12 md:h-12 text-white" />}
                                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white text-shadow-md">
                                    {getAnimalTypeTranslation(type, language)}
                                </h2>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 md:gap-4">
                                {animals.map(animal => (
                                    <AnimalCard key={animal.id} animal={animal} onClick={onSelectAnimal} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const GamesMenu: React.FC<{ onNavigate: (page: Page) => void }> = ({ onNavigate }) => {
  const { language, translations: t } = useLanguage();
  const playGamesMenuPrompt = useAudio((VOICE_PROMPTS[language].GAMES_MENU_PROMPT as {path: string}).path);
  
  useEffect(() => {
    const timer = setTimeout(playGamesMenuPrompt, 500);
    return () => clearTimeout(timer);
  }, [playGamesMenuPrompt]);

  const games = [
    // Standard games
    { page: 'name_game', label: t.gamesMenu.nameGame, color: 'paw-blue', Icon: GridIcon },
    { page: 'sound_game', label: t.gamesMenu.soundGame, color: 'paw-green', Icon: SoundWaveIcon },
    { page: 'diet_game', label: t.gamesMenu.dietGame, color: 'paw-red', Icon: AppleIcon },
    // Memory games
    { page: 'memory_game', label: t.gamesMenu.memoryGame, color: 'paw-orange', Icon: MemoryIcon },
    { page: 'sound_chain_game', label: t.gamesMenu.soundChainGame, color: 'paw-teal', Icon: SoundChainIcon },
    // TicTacToe games
    { page: 'tictactoe_name_game', label: t.gamesMenu.tictactoeNameGame, color: 'paw-pink', Icon: TicTacToeIcon },
    { page: 'tictactoe_sound_game', label: t.gamesMenu.tictactoeSoundGame, color: 'paw-purple', Icon: TicTacToeIcon },
    { page: 'tictactoe_memory_game', label: t.gamesMenu.tictactoeMemoryGame, color: 'paw-yellow', Icon: TicTacToeIcon },
  ];

  return (
    <div className="p-4 md:p-8 flex-grow flex items-center justify-center">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-8 md:gap-12 max-w-4xl md:max-w-5xl lg:max-w-7xl mx-auto">
        {games.map(game => (
            <button 
              key={game.page} 
              onClick={() => { stopAllAudio(); onNavigate(game.page as Page); }} 
              className={`paw-print-button ${game.color}`}
              aria-label={game.label}
            >
                <div className="paw-print-shape">
                    <div className="main-pad">
                        <game.Icon className="w-10 h-10 md:w-12 md:h-12 lg:w-14 lg:h-14 text-white" />
                    </div>
                    <div className="toe t1"></div>
                    <div className="toe t2"></div>
                    <div className="toe t3"></div>
                    <div className="toe t4"></div>
                </div>
                <span className="paw-print-label">
                    {game.label}
                </span>
            </button>
          )
        )}
      </div>
    </div>
  );
};

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

// --- Re-architected Audio Chain Logic ---
const useAudioChain = () => {
  const [isLocked, setIsLocked] = useState(true);
  const [audioChain, setAudioChain] = useState<{ sounds: string[], onEnd?: () => void } | null>(null);
  const [currentSoundIndex, setCurrentSoundIndex] = useState(0);

  const currentSoundPath = useMemo(() => audioChain?.sounds[currentSoundIndex] ?? '', [audioChain, currentSoundIndex]);

  const onCurrentSoundEnd = useCallback(() => {
    if (audioChain && currentSoundIndex < audioChain.sounds.length - 1) {
      setCurrentSoundIndex(prev => prev + 1);
    } else {
      audioChain?.onEnd?.();
      setAudioChain(null);
      setIsLocked(false);
    }
  }, [audioChain, currentSoundIndex]);

  const playCurrentSound = useAudio(currentSoundPath, { onEnded: onCurrentSoundEnd });

  useEffect(() => {
    if (currentSoundPath) {
      playCurrentSound();
    }
  }, [currentSoundPath, playCurrentSound]);

  const startAudioChain = useCallback((sounds: (string | undefined)[], onEnd?: () => void) => {
    stopAllAudio();
    const validSounds = sounds.filter((s): s is string => !!s);
    if (validSounds.length > 0) {
      setIsLocked(true);
      setCurrentSoundIndex(0);
      setAudioChain({ sounds: validSounds, onEnd });
    } else {
      onEnd?.();
      // If no sounds, don't lock the UI
      setIsLocked(false);
    }
  }, []);

  return { isLocked, setIsLocked, startAudioChain };
};


const NameGame: React.FC<{ onGoBack?: () => void }> = ({ onGoBack = () => {} }) => {
    const { language, translations: t } = useLanguage();
    const { speak, isReady: isTtsReady } = useTextToSpeech(language);

    const [animalsOnScreen, setAnimalsOnScreen] = useState<Animal[]>([]);
    const [foundAnimalIds, setFoundAnimalIds] = useState<Set<number>>(new Set());
    const [targetAnimal, setTargetAnimal] = useState<Animal | null>(null);
    const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);
    const [clickedAnimal, setClickedAnimal] = useState<Animal | null>(null);
    const [isGameWon, setIsGameWon] = useState(false);
    const [mistakesPerTarget, setMistakesPerTarget] = useState<Record<number, number>>({});

    const { isLocked, setIsLocked, startAudioChain } = useAudioChain();
    
    const initializeGame = useCallback(() => {
        setIsLocked(true);
        setIsGameWon(false);
        setFoundAnimalIds(new Set());
        setFeedback(null);
        setClickedAnimal(null);
        setMistakesPerTarget({});
        const newGameAnimals = [...ANIMALS].sort(() => 0.5 - Math.random()).slice(0, 9);
        setAnimalsOnScreen(newGameAnimals);
    }, [setIsLocked]);
    
    const playQuestion = useCallback(() => {
        if (!targetAnimal) return;
        
        const isFirst = foundAnimalIds.size === 0;
        const questionPromptSound = (VOICE_PROMPTS[language].NAME_GAME_QUESTION as {path: string}[])[Math.floor(Math.random() * 2)].path;
        const introSound = isFirst ? (VOICE_PROMPTS[language].GAME_START_PROMPT as {path: string}).path : undefined;
        const nameSounds = language === 'en' ? [targetAnimal.nameSoundUrl_en, targetAnimal.nameSoundUrl] : [targetAnimal.nameSoundUrl, targetAnimal.nameSoundUrl_en];

        startAudioChain([introSound, questionPromptSound, ...nameSounds]);
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
            const timer = setTimeout(playQuestion, 500);
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
            const sounds = [prefixSound, ...nameSounds, praiseSound];
            
            startAudioChain(sounds, () => {
                setFoundAnimalIds(prev => new Set(prev).add(animal.id));
            });
        } else {
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
            } else {
                const targetNameSounds = language === 'en' ? [targetAnimal.nameSoundUrl_en, targetAnimal.nameSoundUrl] : [targetAnimal.nameSoundUrl, targetAnimal.nameSoundUrl_en];
                const clickedNameSounds = language === 'en' ? [animal.nameSoundUrl_en, animal.nameSoundUrl] : [animal.nameSoundUrl, animal.nameSoundUrl_en];
                const suffixSound = (VOICE_PROMPTS[language].WRONG_SUFFIXES as {path: string}[])[Math.floor(Math.random() * 3)].path;
                
                const sounds = [
                    (VOICE_PROMPTS[language].WRONG_PREFIX_ALT as { path: string }).path,
                    ...targetNameSounds,
                    (VOICE_PROMPTS[language].WRONG_PREFIX as { path: string }).path,
                    ...clickedNameSounds,
                    suffixSound,
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

    const targetName = language === 'en' ? targetAnimal?.name_en : targetAnimal?.name_ar;
    const promptText = isGameWon ? t.nameGame.youWon : t.nameGame.prompt.replace('{animal}', targetName ?? '...');
    
    return (
        <GameContainer prompt={promptText} onGoBack={onGoBack} onPromptSound={playQuestion} isLocked={isLocked}>
            <div className="relative">
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
                            {t.nameGame.youWon}
                        </h2>
                        <button 
                            onClick={handlePlayAgain} 
                            disabled={isLocked}
                            className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white font-bold text-3xl md:text-4xl py-4 px-10 rounded-full shadow-lg transform hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-wait"
                        >
                            {t.nameGame.playAgain}
                        </button>
                    </div>
                )}
            </div>
        </GameContainer>
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

    const { isLocked, setIsLocked, startAudioChain } = useAudioChain();

    const initializeGame = useCallback(() => {
        setIsLocked(true);
        setIsGameWon(false);
        setFoundAnimalIds(new Set());
        setFeedback(null);
        setClickedAnimal(null);
        setMistakesPerTarget({});
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
            const sounds = [prefixSound, ...nameSounds, praiseSound];

            startAudioChain(sounds, () => {
                setFoundAnimalIds(prev => new Set(prev).add(animal.id));
            });
        } else {
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
            <div className="relative">
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

const GameScreenWrapper: React.FC<{
    children: React.ReactElement<{ onGoBack?: () => void; }>;
    onGoBack: () => void;
}> = ({ children, onGoBack }) => {

    const handleGoBack = () => {
        onGoBack();
    };

    return (
        <div className="w-full h-full flex flex-col relative">
            <div className="flex-grow flex flex-col">
                {React.cloneElement(children, { onGoBack: handleGoBack })}
            </div>
        </div>
    );
};

const HelpPage: React.FC<{}> = () => {
    const { language, translations: t } = useLanguage();
    const { speak, cancel, isReady } = useTextToSpeech(language);

    const instructionsText = `
        ${t.helpPage.welcome}
        ${t.helpPage.factsTitle}. ${t.helpPage.factsText}
        ${t.helpPage.gamesTitle}. ${t.helpPage.gamesText}
    `;

    useEffect(() => {
        return () => cancel();
    }, [cancel]);

    const handleReadInstructions = () => {
        stopAllAudio();
        speak(instructionsText);
    };

    return (
        <div className="flex-grow flex flex-col items-center justify-center text-center p-4 animate-fade-in">
            <div className="bg-white/80 rounded-3xl shadow-2xl p-6 md:p-8 max-w-3xl lg:max-w-5xl w-full">
                <p className="text-gray-800 text-xl md:text-2xl lg:text-3xl mb-4 md:mb-6">{t.helpPage.welcome}</p>
                
                <div className="space-y-4 md:space-y-6 text-gray-700 text-lg md:text-xl lg:text-2xl text-left" dir={language === 'ar' ? 'rtl' : 'ltr'}>
                    <div className="flex flex-col md:flex-row items-center gap-4 bg-green-100 p-4 md:p-5 rounded-xl shadow-sm">
                        <div className="bg-gradient-to-br from-green-400 to-teal-500 p-4 rounded-full flex-shrink-0">
                            <BookIcon className="w-12 h-12 md:w-16 md:h-16 text-white" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="font-bold text-2xl md:text-3xl text-green-700">{t.helpPage.factsTitle}</h3>
                            <p>{t.helpPage.factsText}</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4 bg-orange-100 p-4 md:p-5 rounded-xl shadow-sm">
                       <div className="bg-gradient-to-br from-orange-400 to-red-500 p-4 rounded-full flex-shrink-0">
                            <GameIcon className="w-12 h-12 md:w-16 md:h-16 text-white" />
                        </div>
                        <div className="flex-1 text-center md:text-left">
                            <h3 className="font-bold text-2xl md:text-3xl text-orange-700">{t.helpPage.gamesTitle}</h3>
                            <p>{t.helpPage.gamesText}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 md:mt-8">
                    <button 
                        onClick={handleReadInstructions}
                        disabled={!isReady}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg flex items-center justify-center gap-3 text-2xl md:text-3xl transition-transform hover:scale-105 disabled:bg-blue-300 disabled:cursor-not-allowed"
                    >
                        <SoundOnIcon className="w-8 h-8 md:w-10 md:h-10"/>
                        <span>{t.helpPage.readInstructions}</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProgressBar: React.FC<{ label: string; progress: number }> = ({ label, progress }) => (
    <div className="w-full">
        <p className={`text-left mb-1 transition-colors duration-500 ${progress === 100 ? 'text-green-300' : 'text-white'}`}>{label}</p>
        <div className="w-full bg-black/30 rounded-full h-5 md:h-6 shadow-inner overflow-hidden border border-white/20">
            <div
                className="bg-gradient-to-r from-green-400 to-blue-500 h-full rounded-full transition-all duration-300 ease-linear text-right pr-2 font-bold text-sm flex items-center justify-end"
                style={{ width: `${progress}%` }}
            >
              <span className="text-white text-shadow-sm">{progress > 10 && `${progress}%`}</span>
            </div>
        </div>
    </div>
);


const InitialLoadingScreen: React.FC = () => {
    const { translations: t } = useLanguage();
    const { progress } = useAssetStatus();

    return (
        <div className="flex flex-col items-center justify-center h-full text-center text-white p-8 animate-fade-in">
            <h2 className="text-4xl font-bold mb-8">{t.pageTitles.asset_loading}</h2>
            <div className="w-full max-w-lg md:max-w-xl space-y-4">
                <ProgressBar label={t.loader.downloadingCritical} progress={progress.critical} />
                <ProgressBar label={t.loader.downloadingEssentials} progress={progress.essentials} />
                <ProgressBar label={t.loader.downloadingSecondary} progress={progress.secondary} />
                <ProgressBar label={t.loader.installing} progress={progress.installation} />
            </div>
        </div>
    );
};


const WelcomeScreen: React.FC<{ 
  onStart: () => void; 
  disabled: boolean;
  language: Language;
  setLanguage: (lang: Language) => void;
  onShowDebug: () => void;
}> = ({ onStart, disabled, language, setLanguage, onShowDebug }) => {
    const { translations: t } = useLanguage();
    const [poppedMascots, setPoppedMascots] = useState<Set<number>>(new Set());
    const longPressTimer = useRef<number | null>(null);
    const [mascotSoundUrl, setMascotSoundUrl] = useState('');

    const playMascotSound = useAudio(mascotSoundUrl, { onEnded: () => setMascotSoundUrl('') });

    useEffect(() => {
        if (mascotSoundUrl) {
            playMascotSound();
        }
    }, [mascotSoundUrl, playMascotSound]);
    
    const handleSetLanguage = (lang: Language) => {
        stopAllAudio();
        setLanguage(lang);
    };

    const handleMascotClick = (mascot: Animal) => {
        if (disabled) return;
        stopAllAudio();
        setMascotSoundUrl(mascot.animalSoundUrl);
        setPoppedMascots(prev => new Set(prev).add(mascot.id));
    };

    const handleTitlePress = () => {
        longPressTimer.current = window.setTimeout(() => {
            onShowDebug();
        }, 2000); // 2 second long press
    };

    const handleTitleRelease = () => {
        if (longPressTimer.current) {
            clearTimeout(longPressTimer.current);
            longPressTimer.current = null;
        }
    };

    const languageButtonBase = "px-6 py-3 text-xl md:px-8 md:text-2xl font-bold transition-all duration-300 rounded-full flex items-center justify-center gap-2";
    const activeLangStyle = "bg-white text-sky-600 shadow-lg scale-110";
    const inactiveLangStyle = "bg-white/30 text-white hover:bg-white/50";

    const orbitRadius = 160; // Increased radius for 7 mascots
    const orbitContainerSize = orbitRadius * 2 + 120; // Adjusted container size
    const cornerLinksPosition = language === 'ar' ? 'fixed bottom-4 left-4' : 'fixed bottom-4 right-4';

    return (
        <div className="flex-grow flex flex-col items-center justify-center gap-4 md:gap-6 text-center p-4 text-white animate-fade-in z-10 h-full -mt-8">
             <div className="flex flex-col items-center gap-4">
                <h1 
                    className="welcome-title text-5xl md:text-6xl lg:text-7xl font-bold cursor-pointer"
                    onMouseDown={handleTitlePress}
                    onMouseUp={handleTitleRelease}
                    onMouseLeave={handleTitleRelease}
                    onTouchStart={handleTitlePress}
                    onTouchEnd={handleTitleRelease}
                >
                    {t.pageTitles.main_menu}
                </h1>

                <div className="flex justify-center items-center gap-4 bg-black/20 p-2 rounded-full">
                    <button 
                        onClick={() => handleSetLanguage('en')}
                        className={`${languageButtonBase} ${language === 'en' ? activeLangStyle : inactiveLangStyle}`}
                    >
                        <span role="img" aria-label="USA Flag">🇺🇸</span> English
                    </button>
                    <button 
                        onClick={() => handleSetLanguage('ar')}
                        className={`${languageButtonBase} ${language === 'ar' ? activeLangStyle : inactiveLangStyle}`}
                    >
                         <span role="img" aria-label="Saudi Arabia Flag">🇸🇦</span> العربية
                    </button>
                </div>
            </div>

            <div className="relative flex items-center justify-center" style={{ width: `${orbitContainerSize}px`, height: `${orbitContainerSize}px` }}>
                
                <div className="absolute w-full h-full animate-orbit-cw">
                    {WELCOME_MASCOTS.map((mascot, index) => {
                        const angle = (index / WELCOME_MASCOTS.length) * 2 * Math.PI;
                        const x = orbitRadius * Math.cos(angle);
                        const y = orbitRadius * Math.sin(angle);
                        const isPopped = poppedMascots.has(mascot.id);

                        const style = {
                            top: `calc(50% + ${y}px)`,
                            left: `calc(50% + ${x}px)`,
                        };

                        const mascotClasses = `
                            absolute
                            ${isPopped
                                ? 'animate-bubble-pop'
                                : 'animate-orbit-ccw cursor-pointer hover:scale-110'
                            }
                        `;

                        return (
                            <div
                                key={mascot.id}
                                onClick={() => !isPopped && handleMascotClick(mascot)}
                                className={mascotClasses}
                                style={style}
                            >
                                <div className="bg-black/20 rounded-full p-1.5 md:p-2 shadow-lg">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 bg-white rounded-lg overflow-hidden shadow-inner">
                                        <AssetImage
                                            path={mascot.imageUrl}
                                            alt={mascot.name}
                                            className="w-full h-full object-contain p-1"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <button
                    onClick={!disabled ? onStart : undefined}
                    disabled={disabled}
                    className={`
                        w-48 h-48 md:w-56 md:h-56
                        relative flex items-center justify-center
                        rounded-full
                        bg-gradient-to-br from-green-400 via-teal-500 to-green-600
                        text-white font-bold text-2xl md:text-3xl text-center p-4
                        shadow-[0_8px_30px_rgba(0,0,0,0.3),inset_0_4px_10px_rgba(0,0,0,0.4),inset_0_-4px_10px_rgba(255,255,255,0.2)]
                        transition-all duration-300 ease-in-out
                        transform
                        hover:scale-105 hover:shadow-[0_12px_40px_rgba(0,0,0,0.4),inset_0_4px_10px_rgba(0,0,0,0.4),inset_0_-4px_10px_rgba(255,255,255,0.2)]
                        disabled:cursor-wait disabled:opacity-70 disabled:scale-100
                    `}
                    style={{ zIndex: 5 }}
                    aria-label={t.loader.start}
                >
                    <span className={`
                        text-shadow-lg
                        ${!disabled ? 'animate-pulse-slow' : ''}
                    `}>
                        {disabled ? t.loading : t.loader.start}
                    </span>
                </button>
            </div>
            <div className={`${cornerLinksPosition} z-50 flex items-center gap-3`}>
                <a 
                    href="./privacy-policy.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 text-white rounded-full p-2.5 shadow-md hover:bg-white/40 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label={t.privacyPolicy.title}
                >
                    <ShieldIcon className="w-7 h-7" />
                </a>
                <a 
                    href="./credits.html"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 text-white rounded-full p-2.5 shadow-md hover:bg-white/40 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white"
                    aria-label={t.copyrightAndCredits.title}
                >
                    <CopyrightIcon className="w-7 h-7" />
                </a>
            </div>
        </div>
    );
};


function AppContent() {
  const { statuses, errorMessage, installationComplete } = useAssetStatus();
  const { language, setLanguage, translations: t } = useLanguage();
  const { startAudioChain } = useAudioChain();

  const [currentPage, setCurrentPage] = useState<Page>('main_menu');
  const [isStarting, setIsStarting] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<Animal | null>(null);
  const [welcomeSequenceHasPlayed, setWelcomeSequenceHasPlayed] = useState(false);
  const [highlightedButton, setHighlightedButton] = useState<string | null>(null);
  const highlightTimers = useRef<number[]>([]);
  const [showDebugPage, setShowDebugPage] = useState(false);

  useEffect(() => {
    return () => {
        highlightTimers.current.forEach(clearTimeout);
    };
  }, []);

  const onFullWelcomeSequenceEnd = useCallback(() => {
    setHighlightedButton(null);
    highlightTimers.current.forEach(clearTimeout);
    highlightTimers.current = [];
  }, []);

  // Gate the path: only provide a real path when assets are ready.
  const mainMenuPromptPath = installationComplete ? (VOICE_PROMPTS[language].MAIN_MENU_PROMPT as { path: string }).path : '';
  const playMainMenuPrompt = useAudio(mainMenuPromptPath, { onEnded: onFullWelcomeSequenceEnd });

  const onIntroSequenceEnd = useCallback(() => {
    playMainMenuPrompt();
    setWelcomeSequenceHasPlayed(true);
    setCurrentPage('main_menu');

    highlightTimers.current.forEach(clearTimeout);
    setHighlightedButton('facts');
    const t1 = setTimeout(() => setHighlightedButton('games_menu'), 4000);
    const t2 = setTimeout(() => {
        setHighlightedButton(null);
        highlightTimers.current = [];
    }, 7500);
    highlightTimers.current = [t1, t2];
  }, [playMainMenuPrompt]);

  const welcomeIntroPath = installationComplete ? (VOICE_PROMPTS[language].WELCOME_INTRO as {path: string}).path : '';
  const playWelcomeIntro = useAudio(welcomeIntroPath, { onEnded: onIntroSequenceEnd });
  
  const welcomeGreetingPath = installationComplete ? (VOICE_PROMPTS[language].WELCOME_GREETING as {path: string}).path : '';
  const playWelcomeGreeting = useAudio(welcomeGreetingPath, { onEnded: playWelcomeIntro });

  const handleStart = useCallback(() => {
    if (isStarting || !installationComplete) return;
    setIsStarting(true);
    stopAllAudio();
    playWelcomeGreeting();
  }, [isStarting, playWelcomeGreeting, installationComplete]);
  
  const handleNavigate = (page: Page) => setCurrentPage(page);
  const handleGoToMainMenu = () => setCurrentPage('main_menu');

  const handleSelectAnimal = (animal: Animal) => {
    stopAllAudio();
    setSelectedAnimal(animal);
  }
  const handleCloseModal = () => {
    stopAllAudio();
    setSelectedAnimal(null);
  }

  const handleGoodbye = () => {
    const goodbyePrompts = VOICE_PROMPTS[language].GOODBYE as {path: string}[];
    const randomGoodbye = goodbyePrompts[Math.floor(Math.random() * goodbyePrompts.length)].path;
    startAudioChain([randomGoodbye], () => {
      setWelcomeSequenceHasPlayed(false);
      setIsStarting(false);
      setCurrentPage('main_menu');
    });
  };
  
  const renderPageContent = () => {
    if (statuses.critical === 'error') {
        return (
          <div className="flex flex-col items-center justify-center h-full text-center text-white p-8">
              <div className="bg-red-800/80 p-8 rounded-2xl shadow-xl">
                  <ErrorIcon className="w-16 h-16 text-yellow-300 mx-auto mb-4" />
                  <h2 className="text-4xl font-bold mb-4">{t.loader.errorTitle}</h2>
                  <p className="text-xl mb-8 max-w-md">{errorMessage}</p>
                  <button
                      onClick={() => window.location.reload()}
                      className="bg-white text-red-600 font-bold py-3 px-8 rounded-full shadow-lg hover:bg-red-100 transition-colors transform hover:scale-105"
                  >
                      {t.loader.retry}
                  </button>
              </div>
          </div>
        );
    }

    if (!installationComplete) {
        return <InitialLoadingScreen />;
    }

    if (!welcomeSequenceHasPlayed) {
        return <WelcomeScreen 
                  onStart={handleStart} 
                  disabled={isStarting}
                  language={language}
                  setLanguage={setLanguage}
                  onShowDebug={() => setShowDebugPage(true)}
                />;
    }

    const pageTitles: Record<Page, string> = {
      main_menu: t.pageTitles.main_menu,
      help: t.pageTitles.help,
      facts: t.pageTitles.facts,
      games_menu: t.pageTitles.games_menu,
      name_game: t.pageTitles.name_game,
      sound_game: t.pageTitles.sound_game,
      memory_game: t.pageTitles.memory_game,
      diet_game: t.pageTitles.diet_game,
      sound_chain_game: t.pageTitles.sound_chain_game,
      tictactoe_name_game: t.pageTitles.tictactoe_name_game,
      tictactoe_sound_game: t.pageTitles.tictactoe_sound_game,
      tictactoe_memory_game: t.pageTitles.tictactoe_memory_game,
    };

    const pagesWithoutHeader: Page[] = [
      'name_game',
      'sound_game',
      'memory_game',
      'diet_game',
      'sound_chain_game',
      'tictactoe_name_game',
      'tictactoe_sound_game',
      'tictactoe_memory_game'
    ];

    const renderPage = () => {
      switch (currentPage) {
        case 'main_menu':
          return <MainMenu 
                      onNavigate={handleNavigate} 
                      onGoodbye={handleGoodbye}
                      highlightedButtonOverride={highlightedButton}
                  />;
        case 'help':
          return <HelpPage />;
        case 'facts':
          return <FactsView onSelectAnimal={handleSelectAnimal} />;
        case 'games_menu':
          return <GamesMenu onNavigate={handleNavigate} />;
        case 'name_game':
          return <GameScreenWrapper onGoBack={() => handleNavigate('games_menu')}><NameGame /></GameScreenWrapper>;
        case 'sound_game':
          return <GameScreenWrapper onGoBack={() => handleNavigate('games_menu')}><SoundGame /></GameScreenWrapper>;
        case 'memory_game':
          return <GameScreenWrapper onGoBack={() => handleNavigate('games_menu')}><MemoryGame /></GameScreenWrapper>;
        case 'diet_game':
            return <GameScreenWrapper onGoBack={() => handleNavigate('games_menu')}><DietGame /></GameScreenWrapper>;
        case 'sound_chain_game':
            return <GameScreenWrapper onGoBack={() => handleNavigate('games_menu')}><SoundChainGame /></GameScreenWrapper>;
        case 'tictactoe_name_game':
          return <GameScreenWrapper onGoBack={() => handleNavigate('games_menu')}><TicTacToeNameGame /></GameScreenWrapper>;
        case 'tictactoe_sound_game':
          return <GameScreenWrapper onGoBack={() => handleNavigate('games_menu')}><TicTacToeSoundGame /></GameScreenWrapper>;
        case 'tictactoe_memory_game':
          return <GameScreenWrapper onGoBack={() => handleNavigate('games_menu')}><TicTacToeMemoryGame /></GameScreenWrapper>;
        default:
          return <div>Page not found</div>;
      }
    };

    return (
      <>
        {!pagesWithoutHeader.includes(currentPage) && (
          <AppHeader 
            title={pageTitles[currentPage]} 
            onGoBackToMenu={currentPage === 'main_menu' ? undefined : handleGoToMainMenu} 
          />
        )}
        <main className="container mx-auto px-4 py-2 flex-grow flex flex-col overflow-hidden">
          {renderPage()}
        </main>
        {selectedAnimal && (
          <AnimalFactModal animal={selectedAnimal} onClose={handleCloseModal} />
        )}
      </>
    );
  };

  const pagesWithVolumeControl: Page[] = ['main_menu', 'help'];
  
  return (
    <>
      <AssetLoader />
      {showDebugPage && <DebugAudioPage onClose={() => setShowDebugPage(false)} />}
      <div className="z-10 relative flex flex-col flex-grow h-full">
          {renderPageContent()}
      </div>
      {installationComplete && welcomeSequenceHasPlayed && pagesWithVolumeControl.includes(currentPage) && (
        <VolumeControl />
      )}
    </>
  );
}

export default function App() {
  return (
    <VolumeProvider>
      <LanguageProvider>
        <AssetStatusProvider>
          <AppWrapper />
        </AssetStatusProvider>
      </LanguageProvider>
    </VolumeProvider>
  )
}

function AppWrapper() {
  const { language } = useLanguage();
  
  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.title = language === 'ar' ? 'حيوانات مرحة' : 'Fun Animals for Kids';
  }, [language]);

  return (
    <div className="min-h-screen sunny-hills-bg text-white flex flex-col relative overflow-hidden">
        <div className="sun"></div>
        <div className="clouds">
            <div className="cloud-group" style={{ top: '10%', animationDuration: '75s' }}>
                <div className="cloud"></div>
            </div>
            <div className="cloud-group" style={{ top: '25%', animationDuration: '90s', animationDelay: '-15s', transform: 'scale(0.8)' }}>
                <div className="cloud"></div>
            </div>
            <div className="cloud-group" style={{ top: '5%', animationDuration: '60s', animationDelay: '-30s', transform: 'scale(1.1)' }}>
                <div className="cloud"></div>
            </div>
            <div className="cloud-group" style={{ top: '40%', animationDuration: '100s', animationDelay: '-45s', transform: 'scale(0.6)' }}>
                <div className="cloud"></div>
            </div>
        </div>
        <div className="hills">
            <div className="hill1"></div>
            <div className="hill2"></div>
        </div>
        
        <AppContent />
    </div>
  );
}