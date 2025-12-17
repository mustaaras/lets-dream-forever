const sharp = require('sharp');
const path = require('path');

const input = path.join(process.cwd(), 'public/assets/hero-poster.png');
const output = path.join(process.cwd(), 'public/assets/hero-poster.jpg');

sharp(input)
    .jpeg({ quality: 60 })
    .toFile(output)
    .then(() => console.log('Poster compressed to JPG'))
    .catch(err => console.error('Compression failed', err));
