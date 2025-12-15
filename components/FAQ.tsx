import styles from './FAQ.module.css';

export default function FAQ({ dict }: { dict: any }) {
    return (
        <section className={styles.section}>
            <h1 className={styles.title}>{dict.faq.title}</h1>

            <div className={styles.list}>
                <div className={styles.item}>
                    <h3 className={styles.question}>{dict.faq.q1}</h3>
                    <p className={styles.answer}>{dict.faq.a1}</p>
                </div>
                <div className={styles.item}>
                    <h3 className={styles.question}>{dict.faq.q2}</h3>
                    <p className={styles.answer}>{dict.faq.a2}</p>
                </div>
                <div className={styles.item}>
                    <h3 className={styles.question}>{dict.faq.q3}</h3>
                    <p className={styles.answer}>{dict.faq.a3}</p>
                </div>
            </div>
        </section>
    );
}
