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
                                <VideoItem src={item.src} onSelect={() => setSelectedItem(item)} />
                            ) : (
                                <>
                                    <Image
                                        src={item.src}
                                        alt={item.alt}
                                        width={item.width}
                                        height={item.height}
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

// Video component - shows poster until tapped, then plays video
// This approach completely eliminates native play buttons on mobile
function VideoItem({ src, onSelect }: { src: string; onSelect?: () => void }) {
    const [isActive, setIsActive] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Convert /assets/portfolio/filename.mp4 to /api/video/portfolio/filename.mp4
    const streamingSrc = src.replace('/assets/', '/api/video/');

    // Handle visibility-based pause (only when video is active/playing)
    useEffect(() => {
        if (!isActive) return;

        const video = videoRef.current;
        if (!video) return;

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

        return () => {
            observer.unobserve(video);
        };
    }, [isActive]);

    // Auto-play when video becomes active
    useEffect(() => {
        if (isActive && videoRef.current) {
            videoRef.current.play().catch(() => { });
        }
    }, [isActive]);

    const handleClick = () => {
        if (!isActive) {
            // First tap: activate video
            setIsActive(true);
        } else {
            // Second tap: open lightbox
            if (onSelect) onSelect();
        }
    };

    // Show poster/thumbnail until activated
    if (!isActive) {
        return (
            <div
                ref={containerRef}
                onClick={handleClick}
                style={{
                    width: '100%',
                    aspectRatio: '9/16', // Assume portrait videos
                    backgroundColor: '#1a1a1a',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    position: 'relative',
                }}
            >
                {/* Video poster - use video element with poster for first frame */}
                <video
                    src={streamingSrc}
                    preload="metadata"
                    muted
                    playsInline
                    style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        pointerEvents: 'none',
                    }}
                />
                {/* Single play button - no native controls since video won't play until activated */}
                <div
                    style={{
                        position: 'absolute',
                        width: '60px',
                        height: '60px',
                        borderRadius: '50%',
                        background: 'rgba(0, 0, 0, 0.6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingLeft: '5px',
                        backdropFilter: 'blur(4px)',
                        zIndex: 10,
                    }}
                >
                    <span style={{ fontSize: '2rem', color: 'white' }}>▶</span>
                </div>
            </div>
        );
    }

    // Active state: real playing video
    return (
        <video
            ref={videoRef}
            src={streamingSrc}
            preload="auto"
            muted
            loop
            playsInline
            autoPlay
            onClick={handleClick}
            style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                backgroundColor: '#1a1a1a',
                cursor: 'pointer',
            }}
        />
    );
}

