'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero({ dict }: { dict: any }) {
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Force play on mount to ensure autoplay works reliably
        if (videoRef.current) {
            videoRef.current.play().catch(e => {
                console.log("Autoplay prevented:", e);
                // Interaction usually required if this fails, but it's muted so it should pass
            });
        }
    }, []);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
            // Ensure video plays if it was paused (e.g. by battery saver)
            if (videoRef.current.paused) {
                videoRef.current.play().catch(e => console.log("Play failed on mute toggle:", e));
            }
        }
    };

    const handleHeroClick = () => {
        if (videoRef.current && videoRef.current.paused) {
            videoRef.current.play().catch(e => console.log("Play failed on click:", e));
        }
    };

    return (
        <section className={styles.hero} onClick={handleHeroClick}>
            <video
                ref={videoRef}
                className={styles.videoBackground}
                autoPlay
                muted={isMuted}
                loop
                playsInline
                preload="auto"
                poster="/assets/logo-2.jpg"
            >
                <source src="/assets/hero-bg.mp4" type="video/mp4" />
            </video>
            <div className={styles.videoOverlay}></div>
            <div className={styles.content}>
                <Image
                    src="/assets/logo-v2.png"
                    alt={dict.hero.title}
                    width={500}
                    height={200}
                    priority
                    className={styles.heroLogo}
                />
                <p className={styles.subtitle}>{dict.hero.subtitle}</p>
                <Link href="https://wa.me/905051516611" target="_blank" className={styles.cta}>
                    {dict.footer.contact_us}
                </Link>
            </div>

            <button onClick={toggleMute} className={styles.soundButton} aria-label="Toggle Sound">
                {isMuted ? '🔇' : '🔊'}
            </button>
        </section>
    );
}
