import type { Metadata } from "next";
import { Montserrat, Playfair_Display, Great_Vibes } from "next/font/google"; // Optimized Fonts
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { AudioProvider } from "@/components/AudioProvider";
import MusicButton from "@/components/MusicButton";
import { getDictionary } from "@/lib/get-dictionary";

// Font Configurations
const montserrat = Montserrat({
    subsets: ["latin"],
    variable: "--font-body",
    display: "swap",
});

const playfair = Playfair_Display({
    subsets: ["latin"],
    variable: "--font-heading",
    display: "swap",
});

const greatVibes = Great_Vibes({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-script",
    display: "swap",
});

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
    const { lang } = await params;

    const titles = {
        en: "Lets Dream Forever | Premium Stage Design",
        tr: "Lets Dream Forever | Premium Sahne Tasarımı",
        ar: "Lets Dream Forever | تصميم المسرح الفاخر",
        ru: "Lets Dream Forever | Премиальный дизайн сцены"
    };

    const descriptions = {
        en: "Unique stage designs for weddings and exhibitions by Lets Dream Forever.",
        tr: "Lets Dream Forever ile düğünler ve sergiler için benzersiz sahne tasarımları.",
        ar: "تصميمات مسرح فريدة لحفلات الزفاف والمعارض من Lets Dream Forever.",
        ru: "Уникальный дизайн сцен для свадеб и выставок от Lets Dream Forever."
    };

    const keywords = {
        en: ["Stage Design", "Wedding Stage", "Exhibition Stand", "Event Design", "Izmir Stage Design", "Luxury Weddings"],
        tr: ["Sahne Tasarımı", "Düğün Sahnesi", "Fuar Standı", "Etkinlik Tasarımı", "İzmir Sahne Tasarımı", "Lüks Düğünler"],
        ar: ["تصميم المسرح", "مسرح الزفاف", "منصة المعرض", "تصميم الفعاليات", "تصميم مسرح إزمير", "حفلات زفاف فاخرة"],
        ru: ["Дизайн сцены", "Свадебная сцена", "Выставочный стенд", "Дизайн мероприятий", "Дизайн сцены в Измире", "Роскошные свадьбы"]
    };

    return {
        metadataBase: new URL('https://letsdreamforever.com'),
        title: titles[lang as keyof typeof titles] || titles.en,
        description: descriptions[lang as keyof typeof descriptions] || descriptions.en,
        keywords: keywords[lang as keyof typeof keywords] || keywords.en,
        alternates: {
            canonical: `/${lang}`,
            languages: {
                'en': '/en',
                'tr': '/tr',
                'ar': '/ar',
                'ru': '/ru',
            },
        },
        openGraph: {
            title: titles[lang as keyof typeof titles] || titles.en,
            description: descriptions[lang as keyof typeof descriptions] || descriptions.en,
            url: `/${lang}`,
            siteName: 'Lets Dream Forever',
            locale: lang,
            type: 'website',
            images: [
                {
                    url: '/assets/logo-v2.png', // Fallback or specific OG image
                    width: 1200,
                    height: 630,
                    alt: titles[lang as keyof typeof titles],
                },
            ],
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1,
            },
        },
        icons: {
            icon: [
                { url: "/favicon.ico", sizes: "32x32" },
                { url: "/icon.png", sizes: "192x192", type: "image/png" },
            ],
            apple: [
                { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
            ],
        },
    };
}

export async function generateStaticParams() {
    return [{ lang: "en" }, { lang: "tr" }, { lang: "ar" }, { lang: "ru" }];
}

export default async function RootLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ lang: string }>;
}) {
    const { lang } = await params;
    const isRTL = lang === 'ar';
    const dict = await getDictionary(lang);

    return (
        <html lang={lang} dir={isRTL ? "rtl" : "ltr"} className={`${montserrat.variable} ${playfair.variable} ${greatVibes.variable}`} suppressHydrationWarning>
            <body suppressHydrationWarning>
                <AudioProvider>
                    <Header lang={lang} dict={dict} />
                    <main style={{ minHeight: '100vh', paddingTop: '80px' }}>
                        {children}
                    </main>
                    <Footer dict={dict} />
                    <MusicButton />
                </AudioProvider>
            </body>
        </html>
    );
}
