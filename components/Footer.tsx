import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer({ dict }: { dict: any }) {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <h2 className={styles.brand}>LET&apos;S DREAM FOREVER</h2>
                <div className={styles.links}>
                    <Link href="https://instagram.com/lets.dream.forever" target="_blank" className={styles.link}>
                        Instagram
                    </Link>
                    <Link href="https://wa.me/905051516611" target="_blank" className={styles.link}>
                        WhatsApp
                    </Link>
                </div>
                <div className={styles.copyright}>
                    © {new Date().getFullYear()} Let&apos;s Dream Forever. {dict.footer.rights}
                    <span className={styles.separator}> | </span>
                    <span className={styles.designer}>
                        Website designed with ♥ by <Link href="https://x.com/mustaaras" target="_blank" className={styles.designerLink}>@mustaaras</Link>
                    </span>
                </div>
            </div>
        </footer>
    );
}
