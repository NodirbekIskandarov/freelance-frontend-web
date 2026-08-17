import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Docker image uchun: build faqat runtime'ga kerakli fayllarni
  // `.next/standalone` ichiga yig'adi.
  output: 'standalone',
  images: {
    // Rasmlar tashqi domendan kelsa shu yerga qo'shiladi.
    remotePatterns: [],
  },
};

export default nextConfig;
