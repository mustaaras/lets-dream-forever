'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from './InstagramFeed.module.css';

interface InstagramPost {
    id: string;
    mediaUrl: string;
    permalink: string;
    caption?: string;
    mediaType?: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
    thumbnailUrl?: string; // Add this field for videos
}

export default function InstagramFeed({ dict }: { dict: any }) {
    const [posts, setPosts] = useState<InstagramPost[]>([]);
    const [loading, setLoading] = useState(true);

    const BEHOLD_URL = process.env.NEXT_PUBLIC_BEHOLD_URL;

    useEffect(() => {
        if (!BEHOLD_URL) {
            setLoading(false);
            return;
        }

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                fetchFeed();
                observer.disconnect();
            }
        }, { rootMargin: '200px' });

        const element = document.getElementById('instagram-feed');
        if (element) observer.observe(element);

        async function fetchFeed() {
            try {
                const response = await fetch(BEHOLD_URL!);
                if (response.ok) {
                    const data = await response.json();
                    if (data && data.posts && Array.isArray(data.posts)) {
                        setPosts(data.posts.slice(0, 6));
                    } else if (Array.isArray(data)) {
                        setPosts(data.slice(0, 6));
                    }
                }
            } catch (error) {
                console.error('Failed to fetch Instagram feed:', error);
            } finally {
                setLoading(false);
            }
        }

        return () => observer.disconnect();
    }, [BEHOLD_URL]);

    // Fallback items if no API or empty
    const placeholderItems = [1, 2, 3, 4, 5, 6];
    const displayItems = posts.length > 0 ? posts : placeholderItems;

    return (
        <section className={styles.feed} id="instagram-feed">
            <div className={styles.header}>
                <h2 className={styles.title}>{dict.gallery.title || dict.navigation.gallery}</h2>
                <Link href="https://www.instagram.com/lets.dream.forever/" target="_blank" className={styles.handle}>
                    @lets.dream.forever
                </Link>
            </div>

            <div className={styles.grid}>
                {displayItems.map((item, index) => {
                    const isRealPost = typeof item !== 'number';
                    // Behold specific: mediaUrl might be different depending on type
                    const post = item as InstagramPost;

                    // Choose the right image source: thumbnail for videos, mediaUrl for images
                    const imageUrl = post.mediaType === 'VIDEO' && post.thumbnailUrl
                        ? post.thumbnailUrl
                        : post.mediaUrl;

                    return (
                        <div key={isRealPost ? post.id : index} className={styles.item}>
                            {isRealPost ? (
                                <>
                                    <Image
                                        src={imageUrl}
                                        alt={post.caption || 'Instagram Post'}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        style={{ objectFit: 'cover' }}
                                    />
                                    {/* Optional: Add video indicator icon */}
                                    {post.mediaType === 'VIDEO' && (
                                        <div style={{
                                            position: 'absolute', top: '10px', right: '10px', zIndex: 1,
                                            textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                                        }}>
                                            🎥
                                        </div>
                                    )}
                                    <div className={styles.overlay}>
                                        <Link href={post.permalink} target="_blank" className={styles.viewBtn}>
                                            {dict.gallery.view_on_instagram}
                                        </Link>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className={styles.placeholderIcon}>📷</span>
                                    <div className={styles.overlay}>
                                        <Link href="https://www.instagram.com/lets.dream.forever/" target="_blank" className={styles.viewBtn}>
                                            {dict.gallery.view_on_instagram}
                                        </Link>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
