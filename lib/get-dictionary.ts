import 'server-only'

const dictionaries = {
    en: () => import('@/dictionaries/en.json').then((module) => module.default),
    tr: () => import('@/dictionaries/tr.json').then((module) => module.default),
    ar: () => import('@/dictionaries/ar.json').then((module) => module.default),
    ru: () => import('@/dictionaries/ru.json').then((module) => module.default),
}

export const getDictionary = async (locale: string) => {
    // Fallback to 'en' or 'tr' if locale is not found (should be handled by middleware though)
    return dictionaries[locale as keyof typeof dictionaries]?.() ?? dictionaries.tr();
}
