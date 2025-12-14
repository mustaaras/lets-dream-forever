import styles from './About.module.css';

export default function About({ dict }: { dict: any }) {
    // Using hardcoded text for now as dict might not have full about text yet.
    // In a real app, this would come from the CMS or extended dictionary.
    return (
        <section id="about" className={styles.about}>
            <div className={styles.container}>
                <h2 className={styles.title}>{dict.navigation.about}</h2>
                <p className={styles.description}>
                    {dict.about.description_1}
                    <br /><br />
                    {dict.about.description_2}
                </p>
            </div>
        </section>
    );
}
