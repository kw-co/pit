
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { VOICE_PROMPTS, SoundOnIcon } from '../constants';
import { useAudio, stopAllAudio } from '../hooks/useAudio';

interface DebugAudioPageProps {
  onClose: () => void;
}

const PlayButton: React.FC<{ path: string }> = ({ path }) => {
    const playSound = useAudio(path);
    const handleClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        stopAllAudio();
        playSound();
    };
    return (
        <button onClick={handleClick} className="bg-sky-500 hover:bg-sky-600 rounded-md p-2 text-white transition-colors">
            <SoundOnIcon className="w-5 h-5" />
        </button>
    );
};

const DebugAudioPage: React.FC<DebugAudioPageProps> = ({ onClose }) => {
    const { language } = useLanguage();

    const renderPrompts = (lang: 'ar' | 'en') => {
        const prompts = VOICE_PROMPTS[lang];
        return Object.entries(prompts).map(([key, value]) => {
            if (Array.isArray(value)) {
                return (
                    <div key={`${lang}-${key}`} className="bg-gray-700/50 p-3 rounded-lg">
                        <h3 className="font-bold text-lg text-amber-300 mb-2 border-b border-amber-300/20 pb-1">{key}</h3>
                        <div className="space-y-2">
                            {value.map((item, index) => (
                                <div key={index} className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1 text-sm">
                                    <PlayButton path={item.path} />
                                    <div className="flex flex-col overflow-hidden">
                                      <span className="font-mono text-gray-300 break-words" dir="ltr">{item.path}</span>
                                      <span className="text-cyan-300">{item.desc}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            } else {
                return (
                    <div key={`${lang}-${key}`} className="bg-gray-700/50 p-3 rounded-lg">
                       <h3 className="font-bold text-lg text-amber-300 mb-2 border-b border-amber-300/20 pb-1">{key}</h3>
                       <div className="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1 text-sm">
                          <PlayButton path={value.path} />
                          <div className="flex flex-col overflow-hidden">
                            <span className="font-mono text-gray-300 break-words" dir="ltr">{value.path}</span>
                            <span className="text-cyan-300">{value.desc}</span>
                          </div>
                       </div>
                    </div>
                );
            }
        });
    };

    return (
        <div 
          className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in"
          onClick={onClose}
        >
          <div 
            className="bg-gray-800 text-white rounded-2xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col border border-gray-600"
            onClick={(e) => e.stopPropagation()}
          >
            <header className="flex justify-between items-center p-4 border-b border-gray-600 flex-shrink-0">
              <h2 className="text-2xl font-bold text-white">Audio File Diagnostics</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white text-3xl transition-colors">&times;</button>
            </header>
            <div className="p-4 overflow-y-auto flex-grow">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-2 text-center text-amber-400 border-b-2 border-amber-400/50 pb-1 sticky top-0 bg-gray-800 py-2 z-10">Arabic Prompts (AR)</h3>
                  <div className="space-y-3 mt-3">{renderPrompts('ar')}</div>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2 text-center text-sky-400 border-b-2 border-sky-400/50 pb-1 sticky top-0 bg-gray-800 py-2 z-10">English Prompts (EN)</h3>
                  <div className="space-y-3 mt-3">{renderPrompts('en')}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
    );
};

export default DebugAudioPage;
