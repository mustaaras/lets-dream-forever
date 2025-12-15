import { getDictionary } from '@/lib/get-dictionary';
import Contact from '@/components/Contact';
import WhatsAppButton from '@/components/WhatsAppButton';

export default async function ContactPage({ params }: { params: Promise<{ lang: 'en' | 'tr' | 'ar' | 'ru' }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    return (
        <>
            <div style={{ paddingTop: '80px' }}> {/* Add padding to account for fixed header if needed, though main usually has it */}
                <Contact dict={dictionary} />
            </div>
            <WhatsAppButton />
        </>
    );
}
