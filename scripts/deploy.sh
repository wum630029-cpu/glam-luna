#!/usr/bin/env bash
# 一键部署脚本：本地构建 dist → 上传 Cloudflare Pages (glam-luna)
# 用法：./scripts/deploy.sh
# 前置：~/.cloudflare-token 里存着有 Pages 权限的 API token
set -euo pipefail

cd "$(dirname "$0")/.."

if [ ! -s ~/.cloudflare-token ]; then
  echo "❌ 没找到 ~/.cloudflare-token"
  echo "   请先运行:  ! echo '你的TOKEN' > ~/.cloudflare-token"
  exit 1
fi

export CLOUDFLARE_API_TOKEN="$(cat ~/.cloudflare-token)"

echo "▶ 构建中..."
npm run build

echo "▶ 部署到 Cloudflare Pages (glam-luna)..."
npx wrangler pages deploy dist --project-name=glam-luna --commit-dirty=true

echo "✅ 完成，已上线：https://glamluna.net"
