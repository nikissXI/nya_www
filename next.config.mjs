/** @type {import('next').NextConfig} */
const nextConfig = {
  // ===== 开启 standalone 模式（核心） =====
  output: 'standalone',
  // 说明：这里不要用 distDir: 'build'。
  // next build 会默认清空 .next（cleanDistDir: true），但线上服务器跑在 release/（由 deploy.sh 组装），
  // 所以 .next 被清空不影响线上；且默认 .next 的 standalone 布局固定（server.js 平铺 + .next/ 在其内），最可靠。
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  allowedDevOrigins: ["*.nikiss.top"],
};

export default nextConfig;
