/** @type {import('next').NextConfig} */
const nextConfig = {
  // ===== 开启 standalone 模式（核心） =====
  output: 'standalone',
  experimental: {
    optimizePackageImports: ["@chakra-ui/react"],
  },
  allowedDevOrigins: ["*.nikiss.top"],
};

export default nextConfig;
