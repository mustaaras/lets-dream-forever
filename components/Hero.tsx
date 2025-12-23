'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero({ dict }: { dict: any }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        // Aggressive play attempts for iOS
        const tryPlay = () => {
            if (video.paused) {
                video.play().catch(() => { });
            }
        };

        // Try on multiple events
        video.addEventListener('loadedmetadata', tryPlay);
        video.addEventListener('canplay', tryPlay);
        video.addEventListener('canplaythrough', tryPlay);

        // Try immediately
        tryPlay();

        // Also try after a short delay (helps with some browsers)
        const timer = setTimeout(tryPlay, 100);
        const timer2 = setTimeout(tryPlay, 500);

        return () => {
            video.removeEventListener('loadedmetadata', tryPlay);
            video.removeEventListener('canplay', tryPlay);
            video.removeEventListener('canplaythrough', tryPlay);
            clearTimeout(timer);
            clearTimeout(timer2);
        };
    }, []);

    return (
        <section className={styles.hero}>
            {/* Using src directly + webkit attributes for iOS autoplay */}
            <video
                ref={videoRef}
                className={styles.videoBackground}
                src="/assets/hero-bg.mp4"
                autoPlay
                muted
                loop
                playsInline
                // @ts-ignore - webkit specific
                webkit-playsinline="true"
                preload="auto"
            />
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
        </section>
    );
}
