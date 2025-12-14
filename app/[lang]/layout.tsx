import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getDictionary } from "@/lib/get-dictionary";

export const metadata: Metadata = {
    title: "Lets Dream Forever | Premium Stage Design",
    description: "Unique stage designs for weddings and exhibitions by Lets Dream Forever.",
};

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
        <html lang={lang} dir={isRTL ? "rtl" : "ltr"}>
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
                <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Montserrat:wght@300;400;500&family=Playfair+Display:ital,wght@0,400;0,600;1,400&display=swap" rel="stylesheet" />
                {/* Basic font-awesome for icons if needed later, or use SVGs. Skipping for now */}
            </head>
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
