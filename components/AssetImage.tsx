import React, { useState, useEffect } from 'react';
import { getFile } from '../lib/db';
import { PawIcon } from '../constants';

interface AssetImageProps {
  path: string;
  alt: string;
  className?: string;
}

const AssetImage: React.FC<AssetImageProps> = ({ path, alt, className }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    let isMounted = true;
    let objectUrl: string | null = null;

    const loadImage = async () => {
      try {
        const blob = await getFile(path);
        if (isMounted && blob) {
          objectUrl = URL.createObjectURL(blob);
          setImageUrl(objectUrl);
        } else if (isMounted) {
          // console.error(`Asset not found in DB: ${path}`);
          setError(true);
        }
      } catch (err) {
        // console.error(`Error loading asset from DB: ${path}`, err);
        if (isMounted) {
          setError(true);
        }
      }
    };

    loadImage();

    return () => {
      isMounted = false;
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [path]);

  if (error) {
    return (
      <div className={`${className} bg-purple-100 flex items-center justify-center p-2 rounded-xl border border-purple-200`}>
        <span className="text-purple-700 font-bold text-center leading-tight">{alt}</span>
      </div>
    );
  }

  if (!imageUrl) {
    return (
        <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
            <PawIcon className="w-1/2 h-1/2 text-gray-400" />
        </div>
    );
  }

  return <img src={imageUrl} alt={alt} className={className} />;
};

export default AssetImage;
