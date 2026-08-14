#!/bin/bash

# ===== 颜色输出 =====
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${GREEN}🚀 Starting zero-downtime Next.js deployment...${NC}"

set -e

# ===== 1. 拉取代码 =====
echo -e "${YELLOW}📦 Pulling latest code...${NC}"
git pull --rebase

# ===== 2. 安装依赖 =====
echo -e "${YELLOW}📥 Installing dependencies...${NC}"
pnpm install

# ===== 3. 构建 =====
echo -e "${YELLOW}🔨 Building Next.js application...${NC}"
pnpm build

# ===== 4. 检查构建 =====
if [ ! -d ".next/standalone" ]; then
    echo -e "${RED}❌ Build failed! .next/standalone not found.${NC}"
    exit 1
fi

# ===== 5. 复制静态文件 =====
echo -e "${YELLOW}📁 Copying static files...${NC}"
cp -r public .next/standalone/public 2>/dev/null || true
cp -r .next/static .next/standalone/.next/static 2>/dev/null || true

# ===== 6. 零停机重载（分步执行） =====
if pm2 list | grep -q "nya-www"; then
    echo -e "${YELLOW}🔄 Reloading application with zero downtime...${NC}"
    
    # ===== 关键修改：逐个重载 =====
    # 获取当前运行的实例数量
    INSTANCES=$(pm2 list | grep "nya-www" | grep -c "online" || echo "0")
    
    if [ "$INSTANCES" -gt 1 ]; then
        echo -e "${YELLOW}📌 Reloading instance 0 first...${NC}"
        pm2 reload nya-www 0 --update-env
        
        echo -e "${YELLOW}⏳ Waiting for instance 0 to be ready...${NC}"
        sleep 5  # 等待 5 秒让进程稳定
        
        echo -e "${YELLOW}📌 Reloading instance 1...${NC}"
        pm2 reload nya-www 1 --update-env
        
        echo -e "${YELLOW}⏳ Waiting for instance 1 to be ready...${NC}"
        sleep 3
    else
        # 如果只有一个实例，直接重载
        pm2 reload ecosystem.config.js --update-env
    fi
else
    echo -e "${YELLOW}🚀 Starting application for the first time...${NC}"
    pm2 start ecosystem.config.js
    pm2 save
fi

# ===== 7. 保存配置 =====
pm2 save

echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Service running on http://localhost:3000${NC}"

pm2 status