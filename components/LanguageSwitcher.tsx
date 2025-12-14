'use client'

import styles from './LanguageSwitcher.module.css';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

export default function LanguageSwitcher({ currentLang }: { currentLang: string }) {
    const pathname = usePathname();

    const redirectedPathName = (locale: string) => {
        if (!pathname) return '/';
        const segments = pathname.split('/');
        segments[1] = locale;
        return segments.join('/');
    };

    return (
        <div className={styles.switcher}>
            <Link href={redirectedPathName('en')} className={`${styles.langLink} ${currentLang === 'en' ? styles.active : ''}`}>
                EN
            </Link>
            <Link href={redirectedPathName('tr')} className={`${styles.langLink} ${currentLang === 'tr' ? styles.active : ''}`}>
                TR
            </Link>
            <Link href={redirectedPathName('ar')} className={`${styles.langLink} ${currentLang === 'ar' ? styles.active : ''}`}>
                AR
            </Link>
        </div>
    );
}
