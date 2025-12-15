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
                            onClick={() => setSelectedItem(item)}
                        >
                            {item.type === 'video' ? (
                                <VideoItem src={item.src} />
                            ) : (
                                <Image
                                    src={item.src}
                                    alt={item.alt}
                                    width={item.width}
                                    height={item.height}
                                    style={{ width: '100%', height: 'auto', display: 'block' }}
                                />
                            )}

                            <div className={styles.overlay}>
                                <span className={styles.zoomIcon}>{item.type === 'video' ? '▶' : '⊕'}</span>
                            </div>
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
                                src={selectedItem.src}
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

// Sub-component for Video - simplified to just show a thumbnail
// Videos will play in the lightbox with native controls
function VideoItem({ src }: { src: string }) {
    return (
        <div style={{
            position: 'relative',
            width: '100%',
            height: '100%',
            backgroundColor: '#1a1a1a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '150px'
        }}>
            {/* Video thumbnail - shows first frame or fallback */}
            <video
                src={src}
                muted
                playsInline
                preload="metadata" /* Load just enough to show first frame */
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                }}
            />
        </div>
    );
}
