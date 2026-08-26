import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "framerusercontent.com",
      },
    ],
  },
  typescript: {
    // Игнорируем ошибки TypeScript при деплое на Vercel
    ignoreBuildErrors: true,
  },
  eslint: {
    // Игнорируем ошибки линтера при деплое
    ignoreDuringBuilds: true,
  },
};

export default withNextIntl(nextConfig);