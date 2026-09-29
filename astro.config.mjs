// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const SITE = 'https://glamluna.net';

// 从 content markdown 的 frontmatter 提取每篇文章的 pubDate，
// 用于给 sitemap 精确输出 <lastmod>（Bing 用它判断内容新鲜度、决定是否重抓）。
function buildLastmodMap() {
  const map = new Map();
  let latest = null;
  for (const coll of ['education', 'outfits']) {
    const dir = fileURLToPath(new URL(`./src/content/${coll}/`, import.meta.url));
    for (const f of readdirSync(dir)) {
      if (!f.endsWith('.md')) continue;
      const raw = readFileSync(`${dir}/${f}`, 'utf8');
      const updated = /^updatedDate:\s*(\d{4}-\d{2}-\d{2})$/m.exec(raw);
      const pub = /^pubDate:\s*(\d{4}-\d{2}-\d{2})$/m.exec(raw);
      const dateStr = updated?.[1] ?? pub?.[1];
      if (!dateStr) continue;
      const d = new Date(dateStr);
      map.set(`/${coll}/${f.replace(/\.md$/, '')}/`, d);
      if (!latest || d > latest) latest = d;
    }
  }
  return { map, latest };
}

const { map: lastmodByPath, latest: latestDate } = buildLastmodMap();

// https://astro.build/config
export default defineConfig({
  site: SITE,
  integrations: [
    sitemap({
      serialize(item) {
        // 文章页用真实发布时间；首页/列表页等无对应 markdown 的页面用全站最新日期
        const path = new URL(item.url).pathname;
        return { ...item, lastmod: lastmodByPath.get(path) ?? latestDate };
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
