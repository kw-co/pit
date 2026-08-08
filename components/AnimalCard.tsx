
import React from 'react';
import { Animal } from '../types';
import AssetImage from './AssetImage';

interface AnimalCardProps {
  animal: Animal;
  onClick: (animal: Animal) => void;
  disabled?: boolean;
}

const AnimalCard: React.FC<AnimalCardProps> = ({ animal, onClick, disabled = false }) => {
  return (
    <div
      onClick={() => !disabled && onClick(animal)}
      className={`
        aspect-square bg-white rounded-2xl shadow-lg overflow-hidden 
        transform transition-all duration-300 ease-in-out
        ${disabled 
          ? 'opacity-50 cursor-not-allowed' 
          : 'hover:scale-105 hover:shadow-2xl cursor-pointer'
        }
      `}
    >
      <AssetImage path={animal.imageUrl} alt={animal.name_ar} className="w-full h-full object-contain" />
    </div>
  );
};

export default AnimalCard;
