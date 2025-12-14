import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

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
                    height: isVideo ? 800 : 600,
                };
            });

        // Shuffle items for a more dynamic look? Or just reverse to show newest (if sorted by name) first?
        // Filenames like 2025... suggest date. Inverse sort is good.
        items.sort((a, b) => b.src.localeCompare(a.src));

        return NextResponse.json({ items });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load portfolio' }, { status: 500 });
    }
}
