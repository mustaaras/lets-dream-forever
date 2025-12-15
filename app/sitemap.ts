import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://letsdreamforever.com';
    const languages = ['en', 'tr', 'ar', 'ru'];
    const routes = ['', '/portfolio', '/contact', '/faq'];

    const sitemap: MetadataRoute.Sitemap = [];

    routes.forEach((route) => {
        languages.forEach((lang) => {
            sitemap.push({
                url: `${baseUrl}/${lang}${route}`,
                lastModified: new Date(),
                changeFrequency: 'weekly',
                priority: route === '' ? 1 : 0.8,
            });
        });
    });

    return sitemap;
}
