import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic'; // Disable Next.js caching
export const runtime = 'nodejs'; // Use Node.js runtime for file system access

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ path: string[] }> }
) {
    try {
        const { path: pathSegments } = await params;
        const videoPath = pathSegments.join('/');
        const filePath = path.join(process.cwd(), 'public', 'assets', videoPath);

        // Check if file exists
        try {
            await fs.access(filePath);
        } catch {
            return NextResponse.json({ error: 'Video not found' }, { status: 404 });
        }

        const stat = await fs.stat(filePath);
        const fileSize = stat.size;
        const range = request.headers.get('range');

        // Determine content type
        const ext = path.extname(filePath).toLowerCase();
        const contentType = ext === '.mp4' ? 'video/mp4' :
            ext === '.webm' ? 'video/webm' :
                ext === '.mov' ? 'video/quicktime' : 'video/mp4';

        // Common headers to bypass Cloudflare cache and enable streaming
        const commonHeaders = {
            'Content-Type': contentType,
            'Accept-Ranges': 'bytes',
            'Cache-Control': 'no-cache, no-store, must-revalidate', // Bypass CF cache
            'Pragma': 'no-cache', // Legacy cache bypass
            'Expires': '0', // Legacy cache bypass
            'CDN-Cache-Control': 'no-store', // Cloudflare specific
            'Cloudflare-CDN-Cache-Control': 'no-store', // Cloudflare specific
        };

        if (range) {
            // Parse Range header
            const parts = range.replace(/bytes=/, '').split('-');
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
            const chunkSize = end - start + 1;

            // Read the requested chunk
            const fileHandle = await fs.open(filePath, 'r');
            const buffer = Buffer.alloc(chunkSize);
            await fileHandle.read(buffer, 0, chunkSize, start);
            await fileHandle.close();

            // Return 206 Partial Content
            return new NextResponse(buffer, {
                status: 206,
                headers: {
                    ...commonHeaders,
                    'Content-Range': `bytes ${start}-${end}/${fileSize}`,
                    'Content-Length': chunkSize.toString(),
                },
            });
        } else {
            // No range requested - return full file with Accept-Ranges header
            const file = await fs.readFile(filePath);

            return new NextResponse(file, {
                status: 200,
                headers: {
                    ...commonHeaders,
                    'Content-Length': fileSize.toString(),
                },
            });
        }
    } catch (error) {
        console.error('Video streaming error:', error);
        return NextResponse.json({ error: 'Failed to stream video' }, { status: 500 });
    }
}
