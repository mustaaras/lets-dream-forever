import { getDictionary } from '@/lib/get-dictionary';
import Contact from '@/components/Contact';

export default async function ContactPage({ params }: { params: Promise<{ lang: 'en' | 'tr' | 'ar' | 'ru' }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    return (
        <div style={{ paddingTop: '80px' }}>
            <Contact dict={dictionary} />
        </div>
    );
}
