import React from 'react';
import TicTacToeGame from './TicTacToeGame';

const TicTacToeNameGame: React.FC<{ onGoBack?: () => void }> = ({ onGoBack }) => {
  return <TicTacToeGame gameType="name" onGoBack={onGoBack} />;
};

export default TicTacToeNameGame;
