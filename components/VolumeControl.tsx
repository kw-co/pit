import React, { useEffect, useRef } from 'react';
import { useVolume, VolumeLevel } from '../contexts/VolumeContext';
import { useLanguage } from '../contexts/LanguageContext';
import { 
    VolumeFullIcon,
    VolumeHighIcon, 
    VolumeMediumIcon, 
    VolumeLowIcon, 
    VolumeMuteIcon,
    VOICE_PROMPTS
} from '../constants';
import { useAudio, stopAllAudio } from '../hooks/useAudio';

const VolumeControl: React.FC = () => {
    const { level, setLevel } = useVolume();
    const { language } = useLanguage();
    
    // This ref helps distinguish between the component's first render and subsequent updates by tracking the previous volume level.
    const prevLevelRef = useRef<VolumeLevel | undefined>(undefined);

    const volumeCycle: VolumeLevel[] = ['full', 'high', 'medium', 'low', 'mute'];
    
    const feedbackSoundPath = (VOICE_PROMPTS[language].WELCOME_GREETING as {path: string}).path;
    const playVolumeFeedbackSound = useAudio(feedbackSoundPath);

    // This effect runs whenever the volume level or language changes.
    useEffect(() => {
        const isFirstRun = prevLevelRef.current === undefined;
        const levelHasChanged = prevLevelRef.current !== level;

        // We only want to play feedback sound when the user *explicitly* changes the volume,
        // not on the initial mount or when the language changes (which also causes a re-render).
        if (!isFirstRun && levelHasChanged) {
             if (level !== 'mute') {
                stopAllAudio(); // Stop any currently playing sounds to prevent overlap.
                playVolumeFeedbackSound();
            }
        }

        // Keep the ref updated for the next render to correctly detect future changes.
        prevLevelRef.current = level;

    }, [level, playVolumeFeedbackSound]); // Dependencies must include everything used in the effect to satisfy linter rules.

    const handleVolumeChange = () => {
        const currentIndex = volumeCycle.indexOf(level);
        const nextIndex = (currentIndex + 1) % volumeCycle.length;
        setLevel(volumeCycle[nextIndex]);
    };

    const getIcon = () => {
        const iconProps = { className: "w-8 h-8" };
        switch (level) {
            case 'full':
                return <VolumeFullIcon {...iconProps} />;
            case 'high':
                return <VolumeHighIcon {...iconProps} />;
            case 'medium':
                return <VolumeMediumIcon {...iconProps} />;
            case 'low':
                return <VolumeLowIcon {...iconProps} />;
            case 'mute':
                return <VolumeMuteIcon {...iconProps} />;
            default:
                return <VolumeMediumIcon {...iconProps} />;
        }
    };

    const positionClass = language === 'ar' ? "fixed bottom-4 left-4" : "fixed bottom-4 right-4";
    const accessibleLabel = `Current volume: ${level}. Change volume.`;

    return (
        <button
            onClick={handleVolumeChange}
            className={`${positionClass} z-40 bg-white/50 text-white rounded-full p-2 shadow-md hover:bg-white/80 transition-all transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-white`}
            aria-label={accessibleLabel}
        >
            {getIcon()}
        </button>
    );
};

export default VolumeControl;