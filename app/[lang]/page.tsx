import { getDictionary } from '@/lib/get-dictionary'
import Hero from '@/components/Hero'
import WhatsAppButton from '@/components/WhatsAppButton'
import About from '@/components/About'
import InstagramFeed from '@/components/InstagramFeed'

export default async function Home({ params }: { params: Promise<{ lang: 'en' | 'tr' | 'ar' }> }) {
    const { lang } = await params;
    const dictionary = await getDictionary(lang)

    return (
        <>
            <Hero dict={dictionary} />
            <About dict={dictionary} />
            <InstagramFeed dict={dictionary} />
            <WhatsAppButton />
        </>
    );
}
