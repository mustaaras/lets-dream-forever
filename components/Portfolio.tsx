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

// Simple video thumbnail - shows poster with play button, click to open in lightbox
function VideoItem({ src, onSelect }: { src: string, onSelect?: () => void, onPlayingChange?: (isPlaying: boolean) => void }) {
    // Generate poster image path from video path
    // e.g., /assets/portfolio/20240226_232023.mp4 -> /assets/posters/20240226_232023.jpg
    const filename = src.split('/').pop()?.replace(/\.(mp4|webm|mov)$/i, '.jpg') || '';
    const posterSrc = `/assets/posters/${filename}`;

    return (
        <div
            onClick={() => onSelect && onSelect()}
            style={{
                position: 'relative',
                width: '100%',
                aspectRatio: '16/9',
                backgroundColor: '#1a1a1a',
                overflow: 'hidden',
                cursor: 'pointer'
            }}
        >
            {/* Poster image */}
            <img
                src={posterSrc}
                alt="Video thumbnail"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            />

            {/* Play button overlay */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                color: 'white',
                pointerEvents: 'none'
            }}>
                ▶
            </div>
        </div>
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
