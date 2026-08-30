// 生成占位图（骨架阶段用，用户上传真实图后可删除）
// 用法：node scripts/make-placeholders.mjs
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const make = (w, h, [r, g, b], out) =>
  sharp({ create: { width: w, height: h, channels: 3, background: { r, g, b } } })
    .jpeg({ quality: 80 })
    .toFile(out);

await mkdir('src/assets/education', { recursive: true });
await mkdir('src/assets/outfits', { recursive: true });

// 品牌主色 #c2185b = rgb(194,24,91)
await make(800, 450, [194, 24, 91], 'src/assets/education/placeholder.jpg');
await make(600, 800, [176, 139, 192], 'src/assets/outfits/placeholder-1.jpg');
await make(600, 800, [158, 111, 153], 'src/assets/outfits/placeholder-2.jpg');
await make(600, 800, [120, 84, 115], 'src/assets/outfits/placeholder-3.jpg');

console.log('占位图已生成');
