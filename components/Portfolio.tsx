"use client";

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import styles from './Portfolio.module.css';

// Type definitions
interface PortfolioItem {
    id: number;
    src: string;
    alt: string;
    width: number; // Aspect ratio height (relative)
    height: number;
    type: 'image' | 'video';
}

interface PortfolioProps {
    dict: any;
    limit?: number;
    lang?: string;
}

export default function Portfolio({ dict, limit, lang = 'en' }: PortfolioProps) {
    const [items, setItems] = useState<PortfolioItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPortfolio() {
            try {
                const res = await fetch('/api/portfolio');
                const data = await res.json();
                if (data.items) {
                    setItems(data.items);
                }
            } catch (error) {
                console.error('Failed to load portfolio', error);
            } finally {
                setLoading(false);
            }
        }
        fetchPortfolio();
    }, []);

    // Filter items if limit is set
    const displayItems = limit ? items.slice(0, limit) : items;

    return (
        <section className={styles.portfolio} id="portfolio">
            <div className={styles.header}>
                <h2 className={styles.title}>{dict.portfolio.title}</h2>
                <p className={styles.subtitle}>{dict.portfolio.subtitle}</p>

                {!limit && (
                    <div className={styles.infoText}>
                        <p dangerouslySetInnerHTML={{ __html: dict.portfolio.description }} />
                    </div>
                )}
            </div>

            {loading ? (
                <div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Loading works...</div>
            ) : (
                <div className={styles.grid}>
                    {displayItems.map((item) => (
                        <div
                            key={item.id}
                            className={styles.item}
                            // Only clickable for images at container level (optional, or move to icon too)
                            onClick={item.type === 'image' ? () => setSelectedItem(item) : undefined}
                            style={{ cursor: item.type === 'image' ? 'pointer' : 'default' }}
                        >
                            {item.type === 'video' ? (
                                <VideoWithOverlay
                                    src={item.src}
                                    onSelect={() => setSelectedItem(item)}
                                />
                            ) : (
                                <>
                                    <Image
                                        src={item.src}
                                        alt={item.alt}
                                        width={item.width}
                                        height={item.height}
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        priority={items.indexOf(item) < 2}
                                        style={{ width: '100%', height: 'auto', display: 'block' }}
                                    />
                                    <div className={styles.overlay}>
                                        <span className={styles.zoomIcon}>⊕</span>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {limit && (
                <div style={{ textAlign: 'center', marginTop: '3rem' }}>
                    <a href={`/${lang}/portfolio`} className={styles.viewBtn}>
                        {dict.portfolio.view_all}
                    </a>
                </div>
            )}

            {/* Lightbox */}
            <div className={`${styles.lightbox} ${selectedItem ? styles.open : ''}`} onClick={() => setSelectedItem(null)}>
                {selectedItem && (
                    <div className={styles.lightboxContent} onClick={(e) => e.stopPropagation()}>
                        <button className={styles.closeBtn} onClick={() => setSelectedItem(null)}>&times;</button>
                        {selectedItem.type === 'video' ? (
                            <video
                                src={selectedItem.src.replace('/assets/', '/api/video/')}
                                controls
                                autoPlay
                                playsInline
                                className={styles.lightboxImage}
                            />
                        ) : (
                            <Image
                                src={selectedItem.src}
                                alt={selectedItem.alt}
                                width={1200}
                                height={800}
                                className={styles.lightboxImage}
                                style={{ objectFit: 'contain' }}
                            />
                        )}
                    </div>
                )}
            </div>
        </section>
    );
}

// Video component with scroll-based autoplay using IntersectionObserver
function VideoItem({ src, onSelect, onPlayingChange }: { src: string, onSelect?: () => void, onPlayingChange?: (isPlaying: boolean) => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);

    // Convert /assets/portfolio/filename.mp4 to /api/video/portfolio/filename.mp4
    const streamingSrc = src.replace('/assets/', '/api/video/');

    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const updatePlayingState = () => {
            if (onPlayingChange) onPlayingChange(!video.paused);
        };

        video.addEventListener('play', updatePlayingState);
        video.addEventListener('pause', updatePlayingState);

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        video.play().catch(() => { });
                    } else {
                        video.pause();
                    }
                });
            },
            { threshold: 0.25 }
        );

        observer.observe(video);

        // Manually trigger initial play attempt when video is ready
        const handleCanPlay = () => {
            // Check if video is currently visible
            const rect = video.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            if (isVisible) {
                video.play().catch(() => { });
            }
        };

        if (video.readyState >= 3) {
            handleCanPlay();
        } else {
            video.addEventListener('canplay', handleCanPlay);
        }

        return () => {
            video.removeEventListener('play', updatePlayingState);
            video.removeEventListener('pause', updatePlayingState);
            video.removeEventListener('canplay', handleCanPlay);
            observer.unobserve(video);
        };
    }, []);

    return (
        <video
            ref={videoRef}
            src={streamingSrc}
            preload="metadata"
            muted
            loop
            playsInline
            onClick={(e) => {
                const video = e.currentTarget;
                if (video.paused) {
                    video.play().catch(() => { });
                } else {
                    if (onSelect) onSelect();
                }
            }}
            style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                backgroundColor: '#1a1a1a',
                cursor: 'pointer'
            }}
        />
    );
}

// Wrapper component to handle overlay state for each video
function VideoWithOverlay({ src, onSelect }: { src: string, onSelect: () => void }) {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div style={{ position: 'relative', width: '100%', height: '100%' }}>
            <VideoItem
                src={src}
                onSelect={onSelect}
                onPlayingChange={setIsPlaying}
            />
            {/* Show overlay only when playing - mimics "Tap to play" (native) then "Tap to open" (custom) */}
            {isPlaying && (
                <div className={styles.overlay} style={{ opacity: 1, pointerEvents: 'none' }}>
                    <span
                        className={styles.playIcon}
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect();
                        }}
                        style={{ pointerEvents: 'auto' }}
                    >
                        ▶
                    </span>
                </div>
            )}
        </div>
    );
}
