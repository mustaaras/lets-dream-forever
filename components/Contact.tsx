import Link from 'next/link';
import styles from './Contact.module.css';

export default function Contact({ dict }: { dict: any }) {
    const PHONE_NUMBER = "+905051516611";
    const WHATSAPP_URL = "https://wa.me/905051516611";

    return (
        <section id="contact" className={styles.section}>
            <h2 className={styles.title}>{dict.contact.title}</h2>
            <p className={styles.subtitle}>{dict.contact.subtitle}</p>

            <div className={styles.content}>
                <p className={styles.text}>{dict.contact.text}</p>

                <div className={styles.actions}>
                    <Link href={`tel:${PHONE_NUMBER}`} className={styles.button}>
                        <span>📞</span> {dict.contact.phone}
                    </Link>
                    <Link href={WHATSAPP_URL} target="_blank" className={`${styles.button} ${styles.whatsappButton}`}>
                        <span>💬</span> {dict.contact.whatsapp}
                    </Link>
                </div>
            </div>
        </section>
    );
}
