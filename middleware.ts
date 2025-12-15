import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const locales = ["en", "tr", "ar", "ru"];
const defaultLocale = "tr"; // Assuming TR since it's an Izmir based business

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Check if there is any supported locale in the pathname
    const pathnameIsMissingLocale = locales.every(
        (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
    );

    // Redirect if there is no locale
    if (pathnameIsMissingLocale) {
        // Exclude static files and api
        if (pathname.startsWith("/_next") || pathname.startsWith("/assets") || pathname.startsWith("/favicon.ico") || pathname.startsWith("/icon.png") || pathname.startsWith("/api")) {
            return;
        }

        // Redirect to default locale
        return NextResponse.redirect(
            new URL(`/${defaultLocale}${pathname.startsWith("/") ? "" : "/"}${pathname}`, request.url)
        );
    }
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        '/((?!_next).*)',
        // Optional: only run on root (/)
        // '/'
    ],
};
