import styles from './About.module.css';

export default function About({ dict }: { dict: any }) {
    // Using hardcoded text for now as dict might not have full about text yet.
    // In a real app, this would come from the CMS or extended dictionary.
    return (
        <section id="about" className={styles.about}>
            <div className={styles.container}>
                <h2 className={styles.title}>{dict.navigation.about}</h2>
                <p className={styles.description}>
                    {/* Extended text would go here. Using a generic placeholder based on user description. */}
                    We design the best stages by hand. Each work is unique, crafted with passion and precision.
                    Serving weddings and exhibitions in Izmir and surrounding cities, we turn your dreams into reality.
                    <br /><br />
                    Our creator mindset ensures that every detail involves artistic touch and dedication.
                </p>
            </div>
        </section>
    );
}
