import { getDictionary } from '@/lib/get-dictionary'
import Portfolio from '@/components/Portfolio'

export default async function PortfolioPage({ params }: { params: Promise<{ lang: 'en' | 'tr' | 'ar' }> }) {
    const { lang } = await params
    const dictionary = await getDictionary(lang)

    return (
        <main>
            <div style={{ paddingTop: '80px' }}>
                {/* No limit implies show all items */}
                <Portfolio dict={dictionary} />
            </div>
        </main>
    )
}
