/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http", // 改为 http
        hostname: "localhost", // 加入 localhost
        port: "3000", // 端口号是 3000
        pathname: "**", // 对应你图片的路径
      },
    ],
  },
  typescript: {
    // 忽略 TypeScript 错误
    ignoreBuildErrors: true,
  },
  eslint: {
    // 忽略 ESLint 错误
    ignoreDuringBuilds: true,
  },
  output: "standalone",
};

export default nextConfig;
