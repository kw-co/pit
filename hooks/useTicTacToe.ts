import { useState, useCallback, useMemo, useEffect } from 'react';
import { Animal } from '../types';
import { ANIMALS } from '../constants';

export type Player = 'X' | 'O';
export type Cell = { player: Player; animal: Animal } | null;
export type Board = Cell[];
export type GameState = 'SETUP' | 'SELECTING_CELL' | 'CHALLENGE' | 'GAMEOVER';

const checkWinner = (board: Board): { winner: Player; line: number[] } | null => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6], // diagonals
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a]?.player === board[b]?.player && board[a]?.player === board[c]?.player) {
      return { winner: board[a]!.player, line };
    }
  }
  return null;
};

export const useTicTacToe = (gameType: 'name' | 'sound' | 'memory') => {
  const [board, setBoard] = useState<Board>(Array(9).fill(null));
  const [currentPlayer, setCurrentPlayer] = useState<Player>('X');
  const [gameState, setGameState] = useState<GameState>(gameType === 'memory' ? 'SETUP' : 'SELECTING_CELL');
  const [winnerInfo, setWinnerInfo] = useState<{ winner: Player; line: number[]; animals: Animal[] } | null>(null);
  const [selectedCell, setSelectedCell] = useState<number | null>(null);

  // State specific to the challenge
  const [challengeAnimals, setChallengeAnimals] = useState<Animal[]>([]);
  const [targetAnimal, setTargetAnimal] = useState<Animal | null>(null);
  // State for memory game to track found animals in the challenge grid
  const [foundChallengeIndices, setFoundChallengeIndices] = useState<Set<number>>(new Set());

  const isTie = useMemo(() => !winnerInfo && board.every(cell => cell !== null), [board, winnerInfo]);

  const initializeChallenge = useCallback(() => {
    // For memory game, the animal grid is fixed. We just need to pick a new target from the unfound ones.
    if (gameType === 'memory') {
        const remainingAnimals = challengeAnimals.filter((_, index) => !foundChallengeIndices.has(index));
        if (remainingAnimals.length > 0) {
            setTargetAnimal(remainingAnimals[Math.floor(Math.random() * remainingAnimals.length)]);
        } else {
            // This case should not be hit if logic is correct, but as a fallback:
            setTargetAnimal(null);
        }
        return;
    }
    // For name and sound games, generate a fresh grid for each challenge.
    const newAnimals = [...ANIMALS].sort(() => 0.5 - Math.random()).slice(0, 9);
    setChallengeAnimals(newAnimals);
    setTargetAnimal(newAnimals[Math.floor(Math.random() * newAnimals.length)]);
  }, [gameType, challengeAnimals, foundChallengeIndices]);
  
  // This effect runs once when the memory game starts in 'SETUP' mode.
  useEffect(() => {
    if (gameType === 'memory' && gameState === 'SETUP') {
        const newAnimals = [...ANIMALS].sort(() => 0.5 - Math.random()).slice(0, 9);
        setChallengeAnimals(newAnimals);
    }
  }, [gameType, gameState]);

  const restartGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrentPlayer('X');
    setWinnerInfo(null);
    setSelectedCell(null);
    setChallengeAnimals([]);
    setTargetAnimal(null);
    setFoundChallengeIndices(new Set()); // Reset memory game state
    setGameState(gameType === 'memory' ? 'SETUP' : 'SELECTING_CELL');
  }, [gameType]);
  
  const selectCell = useCallback((index: number) => {
    if (board[index] || winnerInfo) return;
    setSelectedCell(index);
    initializeChallenge();
    setGameState('CHALLENGE');
  }, [board, winnerInfo, initializeChallenge]);

  const resolveChallenge = useCallback((success: boolean, challengeAnimal?: Animal) => {
    if (success && selectedCell !== null && challengeAnimal) {
      const newBoard = [...board];
      newBoard[selectedCell] = { player: currentPlayer, animal: challengeAnimal };
      setBoard(newBoard);

      // If memory game, mark the animal as found in the challenge grid.
      if (gameType === 'memory') {
        const foundIndex = challengeAnimals.findIndex(a => a.id === challengeAnimal.id);
        if (foundIndex !== -1) {
          setFoundChallengeIndices(prev => new Set(prev).add(foundIndex));
        }
      }

      const winnerResult = checkWinner(newBoard);
      if (winnerResult) {
        const winningAnimals = winnerResult.line.map(i => newBoard[i]!.animal);
        setWinnerInfo({ ...winnerResult, animals: winningAnimals });
        setGameState('GAMEOVER');
      } else if (newBoard.every(cell => cell !== null)) {
        setGameState('GAMEOVER'); // Tie
      } else {
        setCurrentPlayer(prev => (prev === 'X' ? 'O' : 'X'));
        setGameState('SELECTING_CELL');
      }
    } else {
      // Failed challenge
      setCurrentPlayer(prev => (prev === 'X' ? 'O' : 'X'));
      setGameState('SELECTING_CELL');
    }
    setSelectedCell(null);
  }, [board, currentPlayer, selectedCell, challengeAnimals, gameType]);

  // For memory game setup
  const completeSetup = useCallback(() => {
      if (gameType === 'memory') {
          setGameState('SELECTING_CELL');
      }
  }, [gameType]);

  return {
    board,
    currentPlayer,
    gameState,
    winner: winnerInfo,
    winningLine: winnerInfo?.line,
    isTie,
    selectCell,
    resolveChallenge,
    restartGame,
    completeSetup,
    challengeAnimals,
    targetAnimal,
    foundChallengeIndices, // Expose for the UI
  };
};