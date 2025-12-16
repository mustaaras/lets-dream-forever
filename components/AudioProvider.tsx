'use client';

import { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

interface AudioContextType {
    isPlaying: boolean;
    isMuted: boolean;
    togglePlay: () => void;
    toggleMute: () => void;
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export function useAudio() {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within AudioProvider');
    }
    return context;
}

export function AudioProvider({ children }: { children: ReactNode }) {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(true);
    const [hasInteracted, setHasInteracted] = useState(false);

    // Handle user interaction to enable audio
    useEffect(() => {
        const handleInteraction = () => {
            if (!hasInteracted) {
                setHasInteracted(true);
                // Try to play after first interaction
                if (audioRef.current) {
                    audioRef.current.play().catch(() => {
                        // Still blocked, user needs to click play button
                    });
                }
            }
        };

        document.addEventListener('click', handleInteraction, { once: true });
        document.addEventListener('touchstart', handleInteraction, { once: true });

        return () => {
            document.removeEventListener('click', handleInteraction);
            document.removeEventListener('touchstart', handleInteraction);
        };
    }, [hasInteracted]);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play().then(() => {
                    setIsPlaying(true);
                    setIsMuted(false);
                    audioRef.current!.muted = false;
                }).catch(() => {
                    // Failed to play
                });
            }
        }
    };

    const toggleMute = () => {
        if (audioRef.current) {
            audioRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    // Sync playing state with audio element
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handlePlay = () => setIsPlaying(true);
        const handlePause = () => setIsPlaying(false);

        audio.addEventListener('play', handlePlay);
        audio.addEventListener('pause', handlePause);

        return () => {
            audio.removeEventListener('play', handlePlay);
            audio.removeEventListener('pause', handlePause);
        };
    }, []);

    return (
        <AudioContext.Provider value={{ isPlaying, isMuted, togglePlay, toggleMute }}>
            {/* Hidden audio element that persists across pages */}
            <audio
                ref={audioRef}
                src="/api/video/hero-bg.mp4"
                loop
                muted={isMuted}
                preload="metadata"
            />
            {children}
        </AudioContext.Provider>
    );
}
