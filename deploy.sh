#!/bin/bash

# ===== 颜色输出 =====
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Starting zero-downtime Next.js deployment...${NC}"

set -euo pipefail

# ===== 0. 切换到脚本所在目录（保证 pm2 相对路径解析正确） =====
cd "$(dirname "$0")"

APP_NAME="nya-www"

# ===== 1. 拉取代码 =====
echo -e "${YELLOW}📦 Pulling latest code...${NC}"
if ! git pull --rebase; then
    echo -e "${RED}❌ git pull 失败：请先处理本地冲突或未提交改动后重试。${NC}"
    exit 1
fi

# ===== 2. 安装依赖 =====
echo -e "${YELLOW}📥 Installing dependencies...${NC}"
pnpm install --frozen-lockfile

# ===== 3. 构建 =====
echo -e "${YELLOW}🔨 Building Next.js application...${NC}"
pnpm build

# ===== 4. 检查构建产物 =====
# 注意：next build 默认会清空整个输出目录（cleanDistDir: true，含 standalone），
# 所以把构建输出放到独立的 build/（见 next.config.mjs 的 distDir: 'build'），
# 绝不直接写进正在被 pm2 使用的 .next/，否则构建期间网站会全部 400。
if [ ! -f "build/standalone/server.js" ]; then
    echo -e "${RED}❌ Build failed! build/standalone/server.js not found.${NC}"
    exit 1
fi

# ===== 5. 复制静态文件到 standalone 产物（失败即中止，避免新进程缺静态资源） =====
echo -e "${YELLOW}📁 Copying static files...${NC}"
rm -rf build/standalone/public
cp -r public build/standalone/public
cp -r build/static build/standalone/.next/static

# ===== 6. 确保 PM2 日志目录存在 =====
mkdir -p logs

# ===== 7. 原子切换发布目录（同文件系统内 mv 是原子操作，秒级完成） =====
echo -e "${YELLOW}🔄 Switching release directory (build/ -> .next)...${NC}"
rm -rf .next-old
if [ -d .next ]; then mv .next .next-old; fi
mv build .next
rm -rf .next-old

# ===== 8. 零停机重载 =====
# 零停机原理：cluster 模式下 `pm2 reload` 本身就是滚动重载——
# pm2 会逐个实例优雅重启（先起新进程、确认就绪后再杀旧进程），
# 期间服务不中断，无需手动指定实例序号。
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
    echo -e "${YELLOW}🔄 Rolling-reloading ${APP_NAME} (zero downtime)...${NC}"
    pm2 reload "$APP_NAME" --update-env
else
    echo -e "${YELLOW}🚀 Starting ${APP_NAME} for the first time...${NC}"
    pm2 start ecosystem.config.js
fi

# ===== 9. 保存配置 =====
pm2 save

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Service running on http://localhost:3000${NC}"

pm2 status