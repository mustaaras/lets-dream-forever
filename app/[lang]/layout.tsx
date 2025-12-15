import type { Metadata } from "next";
import { Montserrat, Playfair_Display, Great_Vibes } from "next/font/google"; // Optimized Fonts
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
        ar: "Lets Dream Forever | تصميم المسرح الفاخر"
    };

    const descriptions = {
        en: "Unique stage designs for weddings and exhibitions by Lets Dream Forever.",
        tr: "Lets Dream Forever ile düğünler ve sergiler için benzersiz sahne tasarımları.",
        ar: "تصميمات مسرح فريدة لحفلات الزفاف والمعارض من Lets Dream Forever."
    };

    return {
        title: titles[lang as keyof typeof titles] || titles.en,
        description: descriptions[lang as keyof typeof descriptions] || descriptions.en,
        icons: {
            icon: "/icon.png",
        },
    };
}

export async function generateStaticParams() {
    return [{ lang: "en" }, { lang: "tr" }, { lang: "ar" }];
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
        <html lang={lang} dir={isRTL ? "rtl" : "ltr"} className={`${montserrat.variable} ${playfair.variable} ${greatVibes.variable}`}>
            <body>
                <Header lang={lang} dict={dict} />
                <main style={{ minHeight: '100vh', paddingTop: '80px' }}>
                    {children}
                </main>
                <Footer dict={dict} />
            </body>
        </html>
    );
}
