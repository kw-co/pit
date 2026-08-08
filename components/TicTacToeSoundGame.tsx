import React from 'react';
import TicTacToeGame from './TicTacToeGame';

const TicTacToeSoundGame: React.FC<{ onGoBack?: () => void }> = ({ onGoBack }) => {
  return <TicTacToeGame gameType="sound" onGoBack={onGoBack} />;
};

export default TicTacToeSoundGame;
