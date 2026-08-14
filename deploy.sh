#!/bin/bash

# ===== 颜色输出 =====
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}🚀 Starting zero-downtime Next.js deployment...${NC}"

# 出错立即停止
set -e

# ===== 1. 拉取最新代码 =====
echo -e "${YELLOW}📦 Pulling latest code...${NC}"
git pull --rebase

# ===== 2. 安装依赖（如果需要） =====
echo -e "${YELLOW}📥 Installing dependencies...${NC}"
pnpm install

# ===== 3. 构建 Next.js（生成 standalone） =====
echo -e "${YELLOW}🔨 Building Next.js application (standalone mode)...${NC}"
pnpm build

# ===== 4. 检查构建是否成功 =====
if [ ! -d ".next/standalone" ]; then
    echo -e "${RED}❌ Build failed! .next/standalone not found.${NC}"
    exit 1
fi

# ===== 5. 复制 public 和 .next/static 到 standalone 目录（重要！） =====
echo -e "${YELLOW}📁 Copying static files...${NC}"
cp -r public .next/standalone/public 2>/dev/null || true
cp -r .next/static .next/standalone/.next/static 2>/dev/null || true

# ===== 6. 零停机重载 =====
if pm2 list | grep -q "nya-www"; then
    echo -e "${YELLOW}🔄 Reloading application with zero downtime...${NC}"
    pm2 reload ecosystem.config.js --update-env
else
    echo -e "${YELLOW}🚀 Starting application for the first time...${NC}"
    pm2 start ecosystem.config.js
    pm2 save
fi

# ===== 7. 保存 PM2 配置（开机自启） =====
pm2 save

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Service running on http://localhost:3000${NC}"

# ===== 8. 显示运行状态 =====
pm2 status