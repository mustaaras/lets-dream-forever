"use client";

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LanguageSwitcher from './LanguageSwitcher';
import styles from './Header.module.css';

export default function Header({ lang, dict }: { lang: string, dict: any }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <header className={styles.header}>
            <div className={styles.logoContainer}>
                <Link href={`/${lang}`} className={styles.logoLink} onClick={closeMenu}>
                    <Image
                        src="/icon.png" // Updated to use the new icon explicitly
                        alt="Lets Dream Forever"
                        width={50}
                        height={50}
                        priority
                        className={styles.logoImage}
                    />
                </Link>
            </div>

            {/* Desktop Nav */}
            <nav className={styles.nav}>
                <Link href={`/${lang}`} className={styles.navLink} prefetch={false}>
                    {dict.navigation.home}
                </Link>
                <Link href={`/${lang}/#about`} className={styles.navLink} prefetch={false}>
                    {dict.navigation.about}
                </Link>
                <Link href={`/${lang}/portfolio`} className={styles.navLink} prefetch={false}>
                    {dict.navigation.portfolio}
                </Link>
                <Link href={`/${lang}/contact`} className={styles.navLink} prefetch={false}>
                    {dict.navigation.contact}
                </Link>
                <Link href={`/${lang}/faq`} className={styles.navLink} prefetch={false}>
                    {dict.navigation.faq}
                </Link>
                <LanguageSwitcher currentLang={lang} />
            </nav>

            <button
                className={styles.mobileMenuButton}
                aria-label="Menu"
                onClick={toggleMenu}
            >
                {isMenuOpen ? '✕' : '☰'}
            </button>

            {/* Mobile Nav Overlay */}
            <div className={`${styles.mobileNav} ${isMenuOpen ? styles.mobileNavOpen : ''}`}>
                <button
                    className={styles.closeButton}
                    onClick={closeMenu}
                    aria-label="Close Menu"
                >
                    &times;
                </button>
                <Link href={`/${lang}`} className={styles.mobileNavLink} onClick={closeMenu} prefetch={false}>
                    {dict.navigation.home}
                </Link>
                <Link href={`/${lang}/#about`} className={styles.mobileNavLink} onClick={closeMenu} prefetch={false}>
                    {dict.navigation.about}
                </Link>
                <Link href={`/${lang}/portfolio`} className={styles.mobileNavLink} onClick={closeMenu} prefetch={false}>
                    {dict.navigation.portfolio}
                </Link>
                <Link href={`/${lang}/contact`} className={styles.mobileNavLink} onClick={closeMenu} prefetch={false}>
                    {dict.navigation.contact}
                </Link>
                <Link href={`/${lang}/faq`} className={styles.mobileNavLink} onClick={closeMenu} prefetch={false}>
                    {dict.navigation.faq}
                </Link>
                <div style={{ marginTop: '2rem' }}>
                    <LanguageSwitcher currentLang={lang} />
                </div>
            </div>
        </header>
    );
}
