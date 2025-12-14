import { getDictionary } from '@/lib/get-dictionary'
import Hero from '@/components/Hero'
import About from '@/components/About'
import WhatsAppButton from '@/components/WhatsAppButton'
import Portfolio from '@/components/Portfolio'
import InstagramFeed from '@/components/InstagramFeed'

export default async function Home({ params }: { params: Promise<{ lang: 'en' | 'tr' | 'ar' }> }) {
    const { lang } = await params
    const dictionary = await getDictionary(lang)
    return (
        <>
            <Hero dict={dictionary} />
            <About dict={dictionary} />
            <Portfolio dict={dictionary} limit={6} lang={lang} />
            <InstagramFeed dict={dictionary} />
            <WhatsAppButton />
        </>
    )
}
