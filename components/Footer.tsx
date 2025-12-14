import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer({ dict }: { dict: any }) {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <h2 className={styles.brand}>LETS DREAM FOREVER</h2>
                <div className={styles.links}>
                    <Link href="https://instagram.com/lets.dream.forever" target="_blank" className={styles.link}>
                        Instagram
                    </Link>
                    <Link href="#" className={styles.link}>
                        WhatsApp
                    </Link>
                    <Link href="#" className={styles.link}>
                        Email
                    </Link>
                </div>
                <div className={styles.copyright}>
                    © {new Date().getFullYear()} Lets Dream Forever. {dict.footer.rights}
                </div>
            </div>
        </footer>
    );
}
