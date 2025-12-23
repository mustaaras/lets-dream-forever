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

        // Simple play attempt when video can play
        const tryPlay = () => {
            video.play().catch(() => { });
        };

        video.addEventListener('canplaythrough', tryPlay);

        // Also try immediately if already loaded
        if (video.readyState >= 4) {
            tryPlay();
        }

        return () => {
            video.removeEventListener('canplaythrough', tryPlay);
        };
    }, []);

    return (
        <section className={styles.hero}>
            <video
                ref={videoRef}
                className={styles.videoBackground}
                autoPlay
                muted
                loop
                playsInline
                preload="auto"
            >
                {/* Direct static file - most reliable method */}
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
        </section>
    );
}
