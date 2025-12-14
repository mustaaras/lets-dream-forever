import Link from 'next/link';
import styles from './InstagramFeed.module.css';

export default function InstagramFeed({ dict }: { dict: any }) {
    // Placeholder items since we don't have API access yet
    const items = [1, 2, 3, 4, 5, 6];

    return (
        <section className={styles.feed}>
            <div className={styles.header}>
                <h2 className={styles.title}>{dict.navigation.gallery}</h2>
                <Link href="https://www.instagram.com/lets.dream.forever/" target="_blank" className={styles.handle}>
                    @lets.dream.forever
                </Link>
            </div>

            <div className={styles.grid}>
                {items.map((i) => (
                    <div key={i} className={styles.item}>
                        {/* In a real app, Next/Image here with external URL */}
                        <span className={styles.placeholderIcon}>📷</span>
                        <div className={styles.overlay}>
                            <Link href="https://www.instagram.com/lets.dream.forever/" target="_blank" className={styles.viewBtn}>
                                View on Instagram
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
