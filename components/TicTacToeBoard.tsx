



import React from 'react';
import { Board } from '../hooks/useTicTacToe';
import AssetImage from './AssetImage';

interface TicTacToeBoardProps {
  board: Board;
  onSelectCell: (index: number) => void;
  disabled: boolean;
  winningLine?: number[];
  highlightedCell?: number | null;
  finalCelebration?: boolean;
}

const TicTacToeBoard: React.FC<TicTacToeBoardProps> = ({ board, onSelectCell, disabled, winningLine, highlightedCell, finalCelebration }) => {
  
  return (
    <div className="grid grid-cols-3 gap-3 md:gap-4 w-full max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
      {board.map((cell, index) => {
        const isWinningCell = winningLine?.includes(index);
        const isIndividuallyHighlighted = highlightedCell === index;

        let animationClass = '';
        if (finalCelebration && isWinningCell) {
            animationClass = 'animate-wiggle';
        } else if (isIndividuallyHighlighted) {
            animationClass = 'animate-gentle-wiggle';
        }
        
        return (
          <div
            key={index}
            className={`xo-cell aspect-square ${!cell && !disabled ? 'cursor-pointer hover:scale-105' : ''} ${disabled ? 'cursor-wait' : ''} ${cell ? '' : 'bg-white/30'}`}
            onClick={() => !disabled && onSelectCell(index)}
          >
            {cell && (
              <>
                <AssetImage
                  path={cell.animal.imageUrl}
                  alt={cell.animal.name_ar}
                  className={`xo-cell-content ${animationClass}`}
                />
                <div className={`xo-cell-mark text-6xl md:text-7xl lg:text-8xl ${cell.player === 'X' ? 'xo-cell-mark-x' : 'xo-cell-mark-o'}`}>
                  {cell.player === 'X' ? '❌' : '⭕️'}
                </div>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TicTacToeBoard;