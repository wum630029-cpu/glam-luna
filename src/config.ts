/**
 * 站点级配置：导航、科普子分类、全局常量。
 * 商品板块暂时不启用，NAV 中已预留注释，上线商品时取消注释即可。
 */

import guideCover from './assets/education/guide.png';
import bodyCover from './assets/education/body.png';
import styleCover from './assets/education/style.png';
import sceneCover from './assets/education/scene.png';
import materialCover from './assets/education/material.png';

// TODO: 替换成真实站点信息
// 品牌统一：中文名「伊菲塔」= 英文名/域名「GlamLuna」，同一品牌，全站并写以帮助搜索引擎识别
export const SITE = {
  name: '伊菲塔',
  nameEn: 'GlamLuna',
  url: 'https://glamluna.net',
  tagline: '女性内衣选购、穿搭与护理指南',
  description: '伊菲塔 GlamLuna 女性内衣选购、穿搭与护理指南',
  language: 'zh-CN',
  logo: '/logo.jpg',
};

/** 一级导航（商品：预留，暂不启用） */
export const NAV = [
  { label: '首页', href: '/' },
  { label: '情趣内衣选购百科', href: '/education/' },
  { label: '模特穿搭', href: '/outfits/' },
  { label: '尺码表', href: '/size-guide/' },
  { label: '关于', href: '/about/' },
  // { label: '商品', href: '/products/' }, // TODO: 商品上线时启用
];

/** 情趣内衣选购百科 5 个子分类（卡片样式统一由 CategoryCard 组件控制） */
export const EDUCATION_CATEGORIES = [
  { slug: 'guide', name: '选购指南', description: '怎么选、选什么，帮你挑对第一件', cover: guideCover },
  { slug: 'body', name: '身材穿搭', description: '不同身材怎么穿更出彩', cover: bodyCover },
  { slug: 'style', name: '款式百科', description: '睡裙、连体衣、吊带……款式一次看懂', cover: styleCover },
  { slug: 'scene', name: '场景节日', description: '约会、纪念日、节日氛围怎么搭', cover: sceneCover },
  { slug: 'material', name: '材质保养', description: '蕾丝、真丝、网纱的挑选与养护', cover: materialCover },
] as const;

export type EducationCategory = (typeof EDUCATION_CATEGORIES)[number]['name'];

/** slug → 中文名 */
export const categoryName = (slug: string) =>
  EDUCATION_CATEGORIES.find((c) => c.slug === slug)?.name ?? slug;
