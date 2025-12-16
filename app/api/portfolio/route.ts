import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Featured items to show first on homepage "Selected Works"
const FEATURED_FILES = [
    '20240531_064602.jpg',
    '20240530_140159.mp4',
    '20240909_212334.mp4',
    '20241018_191506.mp4',
];

export async function GET() {
    try {
        const portfolioDir = path.join(process.cwd(), 'public', 'assets', 'portfolio');

        // Check if dir exists
        if (!fs.existsSync(portfolioDir)) {
            return NextResponse.json({ items: [] });
        }

        const files = fs.readdirSync(portfolioDir);

        const items = files
            .filter(file => /\.(jpg|jpeg|png|mp4)$/i.test(file))
            .map((file, index) => {
                const isVideo = /\.(mp4)$/i.test(file);
                return {
                    id: index,
                    src: `/assets/portfolio/${file}`,
                    alt: 'Stage Design Portfolio',
                    type: isVideo ? 'video' : 'image',
                    // Use random heights for masonry effect if we can't determine dimensions easily
                    // Or let CSS handle aspect ratio
                    width: 600,
                    height: isVideo ? 400 : 600,
                    featured: FEATURED_FILES.includes(file),
                };
            });

        // Sort: featured items first, then by filename descending
        items.sort((a, b) => {
            // Featured items come first
            if (a.featured && !b.featured) return -1;
            if (!a.featured && b.featured) return 1;
            // Then sort by filename descending
            return b.src.localeCompare(a.src);
        });

        return NextResponse.json({ items });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load portfolio' }, { status: 500 });
    }
}
