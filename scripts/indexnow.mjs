#!/usr/bin/env node
// 部署后把「新出现的 URL」推给 IndexNow（Bing/Yandex/Seznam/Naver），加速收录
// 用法：node scripts/indexnow.mjs [--all]
// 状态记在 scripts/.indexnow-state.json（已 gitignore），只提交没推过的 URL；--all 强制全量重推
import { readFileSync, readdirSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(fileURLToPath(import.meta.url), '..', '..');
const ALL = process.argv.includes('--all');

// 域名从 public/CNAME 取，保证和线上一致
const host = readFileSync(join(ROOT, 'public', 'CNAME'), 'utf8').trim();
const site = `https://${host}`;

// 找 IndexNow key 文件：public/ 下 32 位十六进制的 .txt
const keyFile = readdirSync(join(ROOT, 'public'))
  .find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) {
  console.error('❌ 没找到 IndexNow key 文件（public/<key>.txt）');
  process.exit(1);
}
const key = keyFile.replace(/\.txt$/, '');
const keyLocation = `${site}/${key}.txt`;

// 解析 dist 里的 sitemap，收集全部 URL
const distDir = join(ROOT, 'dist');
if (!existsSync(distDir)) {
  console.error('❌ dist 不存在，先 npm run build');
  process.exit(1);
}
const sitemaps = readdirSync(distDir).filter(
  (f) => f.startsWith('sitemap-') && !f.includes('index')
);
const urls = new Set();
for (const f of sitemaps) {
  const xml = readFileSync(join(distDir, f), 'utf8');
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) urls.add(m[1]);
}
if (!urls.size) {
  console.error('❌ sitemap 里没解析到 URL');
  process.exit(1);
}

// 读状态，算「新 URL」
const statePath = join(ROOT, 'scripts', '.indexnow-state.json');
const prev = existsSync(statePath) ? JSON.parse(readFileSync(statePath, 'utf8')) : [];
const prevSet = new Set(prev);
const fresh = ALL ? [...urls] : [...urls].filter((u) => !prevSet.has(u));

if (!fresh.length) {
  console.log(`ℹ️  没有新 URL（已提交 ${prev.length} 个，用 --all 强制全量重推）`);
  process.exit(0);
}

console.log(`▶ 提交 ${fresh.length} 个 URL → api.indexnow.org`);
const res = await fetch('https://api.indexnow.org/indexnow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({ host, key, keyLocation, urlList: fresh }),
});

if (res.ok) {
  const shown = fresh.slice(0, 3).join(', ');
  console.log(`✅ IndexNow 已接收（${res.status}）：${shown}${fresh.length > 3 ? ` …共 ${fresh.length} 个` : ''}`);
  writeFileSync(statePath, JSON.stringify([...new Set([...prev, ...fresh])], null, 2));
} else {
  console.error(`❌ IndexNow 返回 ${res.status}: ${(await res.text()).slice(0, 300)}`);
  process.exit(1);
}
