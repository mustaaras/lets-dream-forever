import Link from 'next/link';
import styles from './Hero.module.css';

export default function Hero({ dict }: { dict: any }) {
    return (
        <section className={styles.hero}>
            <div className={styles.backgroundDecoration}></div>
            <div className={styles.content}>
                <h1 className={styles.title}>{dict.hero.title}</h1>
                <p className={styles.subtitle}>{dict.hero.subtitle}</p>
                <Link href="#contact" className={styles.cta}>
                    {dict.footer.contact_us}
                </Link>
            </div>
        </section>
    );
}
