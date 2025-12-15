'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero({ dict }: { dict: any }) {
    const [isMuted, setIsMuted] = useState(true);
    const videoRef = useRef<HTMLVideoElement>(null);

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    return (
        <section className={styles.hero}>
            <video
                ref={videoRef}
                className={styles.videoBackground}
                autoPlay
                muted={isMuted}
                loop
                playsInline
            >
                <source src="/assets/hero-bg.mp4" type="video/mp4" />
            </video>
            <div className={styles.videoOverlay}></div>
            <div className={styles.backgroundDecoration}></div>
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
