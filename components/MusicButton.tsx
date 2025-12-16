'use client';

import { useAudio } from './AudioProvider';
import styles from './MusicButton.module.css';

export default function MusicButton() {
    const { isPlaying, togglePlay } = useAudio();

    return (
        <button
            onClick={togglePlay}
            className={styles.musicButton}
            aria-label={isPlaying ? 'Pause music' : 'Play music'}
            title={isPlaying ? 'Pause music' : 'Play music'}
        >
            {isPlaying ? '🎵' : '🔇'}
        </button>
    );
}
