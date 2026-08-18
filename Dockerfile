# syntax=docker/dockerfile:1

# Next.js 16 `output: 'standalone'` rejimida quriladi — natijada faqat
# runtime uchun kerak bo'lgan fayllar qoladi, image kichik chiqadi.

# ---------- base ----------
FROM node:22-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---------- deps: bog'liqliklar ----------
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---------- dev: `next dev` ----------
FROM base AS dev
ENV NODE_ENV=development
COPY --from=deps /app/node_modules ./node_modules
COPY . .
EXPOSE 8090
CMD ["npm", "run", "dev"]

# ---------- builder: production build ----------
FROM base AS builder
ENV NODE_ENV=production

# NEXT_PUBLIC_* qiymatlari build paytida bundle ichiga "inline" qilinadi,
# shuning uchun ular ARG sifatida keladi — konteynerni ishga tushirishda
# o'zgartirib bo'lmaydi, qayta build qilish kerak.
ARG NEXT_PUBLIC_API_URL=http://localhost:8090/api/v1
ARG NEXT_PUBLIC_APP_URL=http://localhost:8090

# Ochiq katalog server tomonda o'qiladi (Server Component + ISR).
# Build paytida SHART: `generateStaticParams` sahifalarni shu manzildan
# yig'adi. Runner bosqichida ham qayta beriladi — ISR yangilanishi
# konteyner ishlab turganda sodir bo'ladi.
ARG CATALOGUE_API_URL=https://api.yopamiz.uz/api/v1

ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL \
    CATALOGUE_API_URL=$CATALOGUE_API_URL

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# ---------- runner: production server ----------
FROM base AS runner
ARG CATALOGUE_API_URL=https://api.yopamiz.uz/api/v1
ENV NODE_ENV=production \
    PORT=8090 \
    HOSTNAME=0.0.0.0 \
    CATALOGUE_API_URL=$CATALOGUE_API_URL

# Root emas, alohida foydalanuvchi ostida ishlaydi.
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs
EXPOSE 8090

# standalone rejimida `next start` emas, o'sha minimal server ishlatiladi.
CMD ["node", "server.js"]
