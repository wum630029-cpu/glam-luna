import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * 内容集合定义（Astro v7 Content Layer API）。
 * - education：情趣内衣选购百科文章
 * - outfits：模特穿搭图文笔记（小红书式）
 * 图片统一放 src/assets/，用 image() 走 astro:assets 自动优化（压缩/WebP/响应式）。
 */
const education = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/education' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(), // SEO 描述 + 列表摘要
      category: z.enum(['guide', 'body', 'style', 'scene', 'material']),
      tags: z.array(z.string()).default([]),
      tldr: z.string().optional(), // 一句话总结，渲染在正文标题下（含关键词，利于搜索摘要）
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      cover: image().optional(), // 封面图路径（相对内容文件）
      author: z.string().default('品牌'),
      // 文末 FAQ：每篇 4–5 个真实问题，配 FAQPage 结构化数据（SEO + AI 引用）
      faq: z
        .array(
          z.object({
            q: z.string(),
            a: z.string(),
          }),
        )
        .default([]),
    }),
});

const outfits = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/outfits' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      pubDate: z.coerce.date(),
      cover: image().optional(), // 封面图（列表用）
      images: z.array(image()).default([]), // 多图轮播
      tags: z.array(z.string()).default([]),
      // 关联商品 id（商品板块预留，暂为空数组）
      relatedProducts: z.array(z.string()).default([]),
    }),
});

export const collections = { education, outfits };
