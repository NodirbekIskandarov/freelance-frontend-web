import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Docker image uchun: build faqat runtime'ga kerakli fayllarni
  // `.next/standalone` ichiga yig'adi.
  output: 'standalone',
  images: {
    // Rasmlar tashqi domendan kelsa shu yerga qo'shiladi.
    remotePatterns: [],
  },

  /*
   * Statik chizishning TEZLIGI ataylab cheklangan.
   *
   * Katalog sahifalari build paytida haqiqiy backendga so'rov yuboradi.
   * Ikki til qo'shilgach sahifalar soni ikki barobar oshdi va Next 23 ta
   * ishchini bir vaqtda ishga solganda backend (3 ta gunicorn ishchisi)
   * bardosh bermay, nginx 502 qaytara boshladi — build esa shu yerda
   * yiqildi.
   *
   * `cpus` ishchilar sonini, `staticGenerationMaxConcurrency` esa bitta
   * ishchidagi bir vaqtdagi sahifalar sonini cheklaydi. Build biroz
   * sekinlashadi, lekin oxirigacha yetadi — yiqilgan build'dan tezroq.
   */
  experimental: {
    cpus: 4,
    staticGenerationMaxConcurrency: 4,
    // Vaqtinchalik 502 butun build'ni yiqitmasin.
    staticGenerationRetryCount: 3,
  },
};

export default nextConfig;
