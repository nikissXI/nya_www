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
# next build 输出到默认的 .next/standalone（布局固定：server.js 平铺 + .next/ 在其内）。
# 正在运行的服务器跑在 release/，所以 next build 清空 .next 不影响线上。
if [ ! -f ".next/standalone/server.js" ]; then
    echo -e "${RED}❌ Build failed! .next/standalone/server.js not found.${NC}"
    exit 1
fi

# ===== 5. 组装新的发布目录 release-new/（拷贝 standalone + public + static） =====
echo -e "${YELLOW}📁 Assembling release directory...${NC}"
rm -rf release-new
cp -r .next/standalone release-new
cp -r public release-new/public
cp -r .next/static release-new/.next/static

# 组装后自检：server.js、.next/server（页面路由）、.next/static（前端资源）必须齐全，否则中止
if [ ! -f release-new/server.js ] || [ ! -d release-new/.next/server ] || [ ! -d release-new/.next/static ]; then
    echo -e "${RED}❌ release 目录不完整（缺 server.js / .next/server / .next/static）！"
    echo -e "   请确认 pnpm build 真的产出了 standalone，并检查磁盘空间。${NC}"
    exit 1
fi

# ===== 6. 确保 PM2 日志目录存在 =====
mkdir -p logs

# ===== 7. 原子切换发布目录（同文件系统内 mv 是原子操作，秒级完成） =====
echo -e "${YELLOW}🔄 Switching release directory...${NC}"
rm -rf release-old
if [ -d release ]; then mv release release-old; fi
mv release-new release
rm -rf release-old

# ===== 8. 零停机重载 =====
# 零停机原理：cluster 模式下 `pm2 reload` 本身就是滚动重载——
# pm2 会逐个实例优雅重启（先起新进程、确认就绪后再杀旧进程），
# 期间服务不中断。用配置文件重载，以便应用 release/server.js 的新入口。
if pm2 describe "$APP_NAME" > /dev/null 2>&1; then
    echo -e "${YELLOW}🔄 Rolling-reloading ${APP_NAME} (zero downtime)...${NC}"
    pm2 reload ecosystem.config.js --update-env
else
    echo -e "${YELLOW}🚀 Starting ${APP_NAME} for the first time...${NC}"
    pm2 start ecosystem.config.js
fi

# ===== 9. 保存配置 =====
pm2 save

# ===== 10. 健康检查 =====
echo -e "${YELLOW}🧪 Health check...${NC}"
sleep 2
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ 2>/dev/null || echo "000")
echo -e "GET http://localhost:3000/ -> HTTP ${HTTP_CODE}（期望 200）"
if [ "$HTTP_CODE" != "200" ]; then
    echo -e "${RED}⚠️  首页返回 ${HTTP_CODE}，部署可能未成功。请查看：pm2 logs nya-www --lines 50 --nostream${NC}"
fi

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"

pm2 status