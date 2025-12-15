import { getDictionary } from '@/lib/get-dictionary';
import FAQ from '@/components/FAQ';
import WhatsAppButton from '@/components/WhatsAppButton';

export default async function FAQPage({ params }: { params: Promise<{ lang: 'en' | 'tr' | 'ar' }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang);

    return (
        <>
            <div style={{ paddingTop: '40px' }}>
                <FAQ dict={dictionary} />
            </div>
            <WhatsAppButton />
        </>
    );
}
