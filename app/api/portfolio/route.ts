import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Featured items to show first on homepage "Selected Works" (in order)
const FEATURED_FILES = [
    '20240530_135941.mp4',  // #1 - video
    '20240531_064602.jpg',  // #2 - image
    '20240530_140159.mp4',  // #3 - video
    '20240909_212334.mp4',  // #4 - video (kept for full portfolio)
    '20241018_191506.mp4',  // #5 - video (kept for full portfolio)
];

export async function GET() {
    try {
        const portfolioDir = path.join(process.cwd(), 'public', 'assets', 'portfolio');

        // Check if dir exists
        if (!fs.existsSync(portfolioDir)) {
            return NextResponse.json({ items: [] });
        }

        const files = fs.readdirSync(portfolioDir);

        const allItems = files
            .filter(file => /\.(jpg|jpeg|png|mp4)$/i.test(file))
            .map((file, index) => {
                const isVideo = /\.(mp4)$/i.test(file);
                return {
                    id: index,
                    src: `/assets/portfolio/${file}`,
                    alt: 'Stage Design Portfolio',
                    type: isVideo ? 'video' : 'image',
                    width: 600,
                    height: isVideo ? 400 : 600,
                    featured: FEATURED_FILES.includes(file),
                    filename: file,
                };
            });

        // Separate featured and non-featured
        const featured = allItems.filter(item => item.featured);
        const nonFeatured = allItems.filter(item => !item.featured);

        // Sort featured by their order in FEATURED_FILES array
        featured.sort((a, b) =>
            FEATURED_FILES.indexOf(a.filename) - FEATURED_FILES.indexOf(b.filename)
        );

        // For non-featured: interleave videos and images for better loading
        const videos = nonFeatured.filter(item => item.type === 'video');
        const images = nonFeatured.filter(item => item.type === 'image');

        // Sort each by filename descending (newest first)
        videos.sort((a, b) => b.src.localeCompare(a.src));
        images.sort((a, b) => b.src.localeCompare(a.src));

        // Interleave: video, image, video, image...
        const interleaved: typeof nonFeatured = [];
        const maxLen = Math.max(videos.length, images.length);
        for (let i = 0; i < maxLen; i++) {
            if (i < videos.length) interleaved.push(videos[i]);
            if (i < images.length) interleaved.push(images[i]);
        }

        // Combine: featured first, then interleaved rest
        const items = [...featured, ...interleaved];

        return NextResponse.json({ items });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to load portfolio' }, { status: 500 });
    }
}
