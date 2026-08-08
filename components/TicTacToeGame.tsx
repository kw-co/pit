

import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { useTicTacToe, Player } from '../hooks/useTicTacToe';
import { useLanguage } from '../contexts/LanguageContext';
import { useAudio, stopAllAudio } from '../hooks/useAudio';
import { VOICE_PROMPTS, BackIcon, SoundOnIcon, StarIcon } from '../constants';
import { Animal } from '../types';
import TicTacToeBoard from './TicTacToeBoard';
import TicTacToeChallenge from './TicTacToeChallenge';
import { useAudioChain } from './../hooks/useAudioChain';

type TicTacToeGameProps = {
  gameType: 'name' | 'sound' | 'memory';
  onGoBack?: () => void;
};

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


const TicTacToeGame: React.FC<TicTacToeGameProps> = ({ gameType, onGoBack = () => {} }) => {
  const {
    gameState,
    board,
    currentPlayer,
    winner,
    isTie,
    selectCell,
    resolveChallenge,
    restartGame,
    challengeAnimals,
    targetAnimal,
    foundChallengeIndices,
    completeSetup,
  } = useTicTacToe(gameType);

  const { language, translations: t } = useLanguage();
  
  const [highlightedWinnerAnimalIndex, setHighlightedWinnerAnimalIndex] = useState<number | null>(null);
  const [finalCelebration, setFinalCelebration] = useState(false);

  // Star rewards state
  const [consecutiveCorrect, setConsecutiveCorrect] = useState(0);
  const [starsEarned, setStarsEarned] = useState(0);
  const [showStarAnimation, setShowStarAnimation] = useState(false);
  
  const { isLocked, setIsLocked, startAudioChain } = useAudioChain({
    onSoundStart: (soundIndex: number) => {
      const animalSoundOffset = 2;
      if (winner && soundIndex >= animalSoundOffset && winner.line[Math.floor((soundIndex - animalSoundOffset) / 2)] !== undefined) {
          const animalPairIndex = Math.floor((soundIndex - animalSoundOffset) / 2);
          setHighlightedWinnerAnimalIndex(winner.line[animalPairIndex]);
      } else {
          setHighlightedWinnerAnimalIndex(null);
      }
    },
    onChainEnd: () => {
      if (winner) {
          setHighlightedWinnerAnimalIndex(null);
          setFinalCelebration(true);
      }
    }
  });
  
  const handleGoBack = () => {
    if (isLocked) return;
    stopAllAudio();
    onGoBack();
  };
  
  const handleFullRestart = useCallback(() => {
    setFinalCelebration(false);
    setHighlightedWinnerAnimalIndex(null);
    setConsecutiveCorrect(0);
    setStarsEarned(0);
    setShowStarAnimation(false);
    restartGame();
  }, [restartGame]);

  const handleChallengeResult = (success: boolean, challengeAnimal?: Animal) => {
    let onEnd = () => resolveChallenge(success, challengeAnimal);
    let sounds: string[] = [];

    if (success) {
        const newConsecutive = consecutiveCorrect + 1;
        const praiseSound = (VOICE_PROMPTS[language].CORRECT_PRAISE as {path: string}[])[Math.floor(Math.random() * 5)].path;
        sounds.push(praiseSound);

        if (newConsecutive >= 3) {
            setConsecutiveCorrect(0);
            sounds.push((VOICE_PROMPTS[language].STAR_AWARDED as { path: string }).path);
            onEnd = () => {
                setStarsEarned(prev => prev + 1);
                setShowStarAnimation(true);
                setTimeout(() => {
                    setShowStarAnimation(false);
                    resolveChallenge(success, challengeAnimal);
                }, 1500);
            };
        } else {
            setConsecutiveCorrect(newConsecutive);
        }
    } else {
        setConsecutiveCorrect(0);
        const errorSound = (VOICE_PROMPTS[language].WRONG_GENERIC_ERROR as {path: string}).path;
        const suffixSound = (VOICE_PROMPTS[language].WRONG_SUFFIXES as {path: string}[])[Math.floor(Math.random() * 3)].path;
        sounds.push(errorSound, suffixSound);
    }
    startAudioChain(sounds, onEnd);
  };

  const playPlayerPrompt = useCallback((player: Player) => {
      const playerSound = (VOICE_PROMPTS[language].TICTACTOE_PLAYER as {path:string}).path;
      const playerNumberSound = player === 'X' 
          ? (VOICE_PROMPTS[language].TICTACTOE_PLAYER_1 as {path:string}).path
          : (VOICE_PROMPTS[language].TICTACTOE_PLAYER_2 as {path:string}).path;
      const prefixSound = (VOICE_PROMPTS[language].TICTACTOE_PROMPT_PREFIX as {path:string}).path;
      const playerMarkSound = player === 'X' 
          ? (VOICE_PROMPTS[language].TICTACTOE_X as {path:string}).path
          : (VOICE_PROMPTS[language].TICTACTOE_O as {path:string}).path;

      startAudioChain([ playerSound, playerNumberSound, prefixSound, playerMarkSound ]);
  }, [language, startAudioChain]);
  
  const playChallengeQuestion = useCallback(() => {
    if (!targetAnimal) return;
    
    let sounds: (string | undefined)[] = [];
    switch (gameType) {
        case 'name':
        case 'memory':
            sounds = [(VOICE_PROMPTS[language].NAME_GAME_QUESTION as {path: string}[])[0].path, targetAnimal.nameSoundUrl, targetAnimal.nameSoundUrl_en];
            break;
        case 'sound':
            sounds = [(VOICE_PROMPTS[language].SOUND_GAME_QUESTION as {path: string}).path, targetAnimal.animalSoundUrl];
            break;
    }
    startAudioChain(sounds);
  }, [gameType, targetAnimal, language, startAudioChain]);

  const replayChallengeQuestion = useCallback(() => {
    if (!targetAnimal) return;

    let sounds: (string | undefined)[] = [];
    switch (gameType) {
        case 'name':
        case 'memory':
            sounds = [targetAnimal.nameSoundUrl, targetAnimal.nameSoundUrl_en];
            break;
        case 'sound':
            sounds = [targetAnimal.animalSoundUrl];
            break;
    }
    startAudioChain(sounds);
  }, [gameType, targetAnimal, startAudioChain]);
  
  const playWinSequence = useCallback(() => {
    if (!winner) return;
    const animalNameSounds = winner.animals.flatMap((animal: Animal) => [animal.nameSoundUrl, animal.nameSoundUrl_en]);
    
    const sounds = [
        (VOICE_PROMPTS[language].WIN_CONGRATS as {path:string}).path,
        (VOICE_PROMPTS[language].CORRECT_PREFIX_GENERIC as {path:string}).path,
        ...animalNameSounds
    ];

    startAudioChain(sounds);
  }, [winner, language, startAudioChain]);
  
  const playTieSound = useCallback(() => {
      startAudioChain([(VOICE_PROMPTS[language].TICTACTOE_TIE as {path:string}).path]);
  }, [language, startAudioChain]);

  const playAgainSound = useCallback(() => {
    setFinalCelebration(false);
    startAudioChain(
      [(VOICE_PROMPTS[language].PLAY_AGAIN_PROMPT as {path:string}).path],
      handleFullRestart
    );
  }, [language, startAudioChain, handleFullRestart]);

  
  useEffect(() => {
    if (gameState === 'SELECTING_CELL') {
        const timer = setTimeout(() => playPlayerPrompt(currentPlayer), 500);
        return () => clearTimeout(timer);
    } else if (gameState === 'GAMEOVER') {
        const timer = setTimeout(() => {
            if (winner) playWinSequence();
            else if (isTie) playTieSound();
        }, 800);
        return () => clearTimeout(timer);
    } else if (gameState === 'CHALLENGE') {
        const timer = setTimeout(playChallengeQuestion, 500);
        return () => clearTimeout(timer);
    } else if (gameState === 'SETUP' && gameType === 'memory') {
        const setupReadyPrompt = (VOICE_PROMPTS[language].MEMORY_GAME_START as {path: string}).path;
        const timer = setTimeout(() => startAudioChain([setupReadyPrompt]), 500);
        return () => clearTimeout(timer);
    }
  }, [gameState, currentPlayer, winner, isTie, gameType, language, playPlayerPrompt, playWinSequence, playTieSound, playChallengeQuestion, startAudioChain]);

  const handleCellClick = (index: number) => {
    if (isLocked || gameState !== 'SELECTING_CELL') return;
    if (board[index]) {
      const cellTakenSound = (VOICE_PROMPTS[language].WRONG_CELL_CONTAINS as {path:string}).path;
      const player = board[index]?.player === 'X' ? 
        (VOICE_PROMPTS[language].TICTACTOE_X as {path:string}).path : 
        (VOICE_PROMPTS[language].TICTACTOE_O as {path:string}).path;
      startAudioChain([cellTakenSound, player]);
    } else {
      selectCell(index);
    }
  };

  const getChallengePromptText = () => {
    if (!targetAnimal) return '';
    const animalName = language === 'en' ? targetAnimal.name_en : targetAnimal.name_ar;
    switch (gameType) {
      case 'name': return t.nameGame.prompt.replace('{animal}', animalName);
      case 'memory': return t.memoryGame.prompt.replace('{animal}', animalName);
      case 'sound': return t.soundGame.prompt;
    }
    return '';
  };

  const renderPromptText = () => {
    if (winner) return t.tictactoe.win_announcement;
    if (isTie) return t.tictactoe.tie_announcement;
    if (gameState === 'CHALLENGE') return getChallengePromptText();
    if (gameState === 'SETUP' && gameType === 'memory') return t.memoryGame.memorize;

    if (gameState === 'SELECTING_CELL') {
      const turnText = language === 'ar' ? 'دور اللاعب' : 'Player\'s Turn:';
      const playerTextX = t.tictactoe.player_X;
      const playerTextO = t.tictactoe.player_O;

      return (
        <>
          {turnText}{' '}
          {currentPlayer === 'X' ? (
            <span className="text-red-500 font-bold">❌</span>
          ) : (
            <span className="text-blue-500 font-bold">⭕️</span>
          )}
        </>
      );
    }
    return t.tictactoe.prompt_challenge_title;
  };

  const renderGameContent = () => {
    return (
      <div className="relative w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
        <StarCounter count={starsEarned} />
        {showStarAnimation && <StarCelebration />}
        <TicTacToeBoard
          board={board}
          onSelectCell={handleCellClick}
          disabled={isLocked || gameState !== 'SELECTING_CELL'}
          winningLine={winner?.line}
          highlightedCell={highlightedWinnerAnimalIndex}
          finalCelebration={finalCelebration}
        />
        {(gameState === 'CHALLENGE' || gameState === 'SETUP') && (
            <div className="absolute inset-0 bg-sky-200/95 flex flex-col items-center justify-center p-4 rounded-2xl animate-fade-in z-20">
                <TicTacToeChallenge
                    gameType={gameType}
                    onResult={handleChallengeResult}
                    onSetupComplete={completeSetup}
                    isSetupPhase={gameState === 'SETUP'}
                    challengeAnimals={challengeAnimals}
                    targetAnimal={targetAnimal}
                    disabled={isLocked}
                    foundChallengeIndices={foundChallengeIndices}
                />
            </div>
        )}
      </div>
    );
  };
  
  const backButton = (
    <button onClick={handleGoBack} className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLocked}>
      <BackIcon className="h-7 w-7 md:h-8 md:w-8 text-sky-600"/>
    </button>
  );

  const promptTextElement = (
    <h2 className="text-xl md:text-2xl font-bold text-gray-800 flex-1 text-center mx-2 whitespace-nowrap">
      {renderPromptText()}
    </h2>
  );
  
  let rightButton;
  if (gameState === 'GAMEOVER') {
    rightButton = (
      <button
          onClick={playAgainSound}
          disabled={isLocked}
          className="bg-green-500 text-white font-semibold text-lg md:text-xl py-2 px-4 rounded-full shadow-md hover:bg-green-600 transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
      >
          {t.tictactoe.playAgain}
      </button>
    );
  } else if (gameState === 'SELECTING_CELL' || gameState === 'CHALLENGE') {
    rightButton = (
      <button
          onClick={gameState === 'CHALLENGE' ? replayChallengeQuestion : () => playPlayerPrompt(currentPlayer)}
          disabled={isLocked}
          className="bg-white rounded-full p-2 shadow-md hover:bg-gray-100 transition-transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
          aria-label={t.gamesMenu.hearQuestion}
      >
          <SoundOnIcon className="h-7 w-7 md:h-8 md:w-8 text-sky-600" />
      </button>
    );
  } else {
    rightButton = <div className="w-11 md:w-12 h-11 md:h-12" />;
  }


  return (
    <div className="w-full h-full flex flex-col text-center">
      <div className="flex-grow flex items-center justify-center p-2">
        {renderGameContent()}
      </div>
       {gameState !== 'SETUP' && (
        <div className="flex-shrink-0 bg-white/90 rounded-full py-2 px-3 mb-4 mx-auto w-full max-w-lg md:max-w-xl lg:max-w-2xl shadow-lg flex items-center justify-between gap-3">
            {language === 'ar' ? (
              <>
                {rightButton}
                {promptTextElement}
                {backButton}
              </>
            ) : (
              <>
                {backButton}
                {promptTextElement}
                {rightButton}
              </>
            )}
        </div>
      )}
    </div>
  );
};

export default TicTacToeGame;
