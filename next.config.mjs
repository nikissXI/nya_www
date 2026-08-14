/** @type {import('next').NextConfig} */
const nextConfig = {
  // ===== 开启 standalone 模式（核心） =====
  output: 'standalone',
  // ===== 关键：构建到独立目录 =====
  // next build 默认会清空整个输出目录（cleanDistDir: true，含 standalone），
  // 若直接用 .next，正在运行的 pm2 服务器文件会被删掉，构建期间网站全部 400。
  // 构建产物先落在 build/，由 deploy.sh 在构建完成后用 mv 原子切换到 .next/。
  distDir: 'build',
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  allowedDevOrigins: ["*.nikiss.top"],
};

export default nextConfig;
