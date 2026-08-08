import React from 'react';
import TicTacToeGame from './TicTacToeGame';

const TicTacToeMemoryGame: React.FC<{ onGoBack?: () => void }> = ({ onGoBack }) => {
  return <TicTacToeGame gameType="memory" onGoBack={onGoBack} />;
};

export default TicTacToeMemoryGame;
