import sharp from 'sharp'
import { readFileSync } from 'fs'
import path from 'path'

const svgPath = path.join(process.cwd(), 'public', 'icon.svg')
const svg = readFileSync(svgPath)
const publicDir = path.join(process.cwd(), 'public')

async function generate() {
  // 192x192 PNG for PWA manifest
  await sharp(svg)
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'icon-192.png'))
  console.log('Generated icon-192.png')

  // 512x512 PNG for PWA manifest
  await sharp(svg)
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'icon-512.png'))
  console.log('Generated icon-512.png')

  // 32x32 favicon as PNG (Next.js supports PNG favicons)
  await sharp(svg)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'))
  console.log('Generated favicon.png')

  // 180x180 Apple Touch Icon
  await sharp(svg)
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'))
  console.log('Generated apple-touch-icon.png')

  // 16x16 favicon variant
  await sharp(svg)
    .resize(16, 16)
    .png()
    .toFile(path.join(publicDir, 'favicon-16x16.png'))
  console.log('Generated favicon-16x16.png')

  // Generate ICO-compatible 32x32 PNG as favicon.ico
  // (Modern browsers accept PNG data in .ico files)
  await sharp(svg)
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon.ico'))
  console.log('Generated favicon.ico')

  console.log('\nAll icons generated successfully!')
}

generate().catch(console.error)
