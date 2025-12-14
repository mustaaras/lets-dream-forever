import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';
import styles from './Header.module.css';

export default function Header({ lang, dict }: { lang: string, dict: any }) {
    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                {/* Placeholder for Logo Image - replaced with text for now or verify path */}
                <Link href={`/${lang}`} className={styles.logoLink}>
                    <Image
                        src="/assets/favicon-transparent.png"
                        alt="Lets Dream Forever"
                        width={50}
                        height={50}
                        priority
                        className={styles.logoImage}
                    />
                </Link>
            </div>

            <nav className={styles.nav}>
                <Link href={`/${lang}`} className={styles.navLink}>
                    {dict.navigation.home}
                </Link>
                <Link href={`/${lang}/#about`} className={styles.navLink}>
                    {dict.navigation.about}
                </Link>
                <Link href={`/${lang}/portfolio`} className={styles.navLink}>
                    {dict.navigation.portfolio}
                </Link>
                <Link href={`/${lang}/#contact`} className={styles.navLink}>
                    {dict.navigation.contact}
                </Link>
                <LanguageSwitcher currentLang={lang} />
            </nav>

            <button className={styles.mobileMenuButton} aria-label="Menu">
                ☰
            </button>
        </header>
    );
}
