#!/usr/bin/env node
/**
 * Generate poster images from video files in the portfolio folder
 * Uses ffmpeg-static (npm package) to extract the first frame of each video
 * PRESERVES original video aspect ratio
 * 
 * Usage: node scripts/generate-posters.js
 */

const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');

// Set ffmpeg path to the static binary
ffmpeg.setFfmpegPath(ffmpegPath);

const PORTFOLIO_DIR = path.join(__dirname, '..', 'public', 'assets', 'portfolio');
const POSTERS_DIR = path.join(__dirname, '..', 'public', 'assets', 'posters');

// Create posters directory if it doesn't exist
if (!fs.existsSync(POSTERS_DIR)) {
    fs.mkdirSync(POSTERS_DIR, { recursive: true });
}

// Get all video files
const files = fs.readdirSync(PORTFOLIO_DIR);
const videoFiles = files.filter(file =>
    file.endsWith('.mp4') || file.endsWith('.webm') || file.endsWith('.mov')
);

console.log(`Found ${videoFiles.length} video files`);
console.log(`Using ffmpeg at: ${ffmpegPath}\n`);

let generated = 0;
let skipped = 0;
let failed = 0;

function processVideo(videoFile, forceRegenerate = false) {
    return new Promise((resolve) => {
        const baseName = path.basename(videoFile, path.extname(videoFile));
        const posterPath = path.join(POSTERS_DIR, `${baseName}.jpg`);
        const videoPath = path.join(PORTFOLIO_DIR, videoFile);

        // Skip if poster already exists (unless force regenerate)
        if (!forceRegenerate && fs.existsSync(posterPath)) {
            console.log(`⏭ Skipping ${videoFile} (poster exists)`);
            skipped++;
            resolve();
            return;
        }

        // Delete existing poster if regenerating
        if (forceRegenerate && fs.existsSync(posterPath)) {
            fs.unlinkSync(posterPath);
        }

        ffmpeg(videoPath)
            .screenshots({
                timestamps: [0.1], // Capture at 0.1 seconds
                filename: `${baseName}.jpg`,
                folder: POSTERS_DIR
                // NO size specified - preserves original aspect ratio!
            })
            .on('end', () => {
                console.log(`✓ Generated poster for ${videoFile}`);
                generated++;
                resolve();
            })
            .on('error', (err) => {
                console.error(`✗ Failed ${videoFile}: ${err.message}`);
                failed++;
                resolve();
            });
    });
}

async function main() {
    // Check if --force flag was passed
    const forceRegenerate = process.argv.includes('--force');

    if (forceRegenerate) {
        console.log('🔄 Force regeneration enabled - recreating all posters\n');
    }

    // Process videos in batches to avoid overwhelming the system
    const batchSize = 5;

    for (let i = 0; i < videoFiles.length; i += batchSize) {
        const batch = videoFiles.slice(i, i + batchSize);
        await Promise.all(batch.map(v => processVideo(v, forceRegenerate)));
    }

    console.log(`\n✅ Done! Generated: ${generated}, Skipped: ${skipped}, Failed: ${failed}`);
}

main().catch(console.error);
