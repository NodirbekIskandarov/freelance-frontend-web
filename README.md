# Web (sayt)

Next.js 16 · React 19 · TypeScript · Redux Toolkit + RTK Query · Tailwind CSS v4

Admin panel alohida loyiha va alohida repository'da — `admin/`.

## Ishga tushirish

```bash
npm install
cp .env.example .env.local
npm run dev
```

`http://localhost:3000`

## Skriptlar

| Skript | Vazifasi |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm start` | Build qilingan versiyani ishga tushirish |
| `npm run typecheck` | Route tiplarini generatsiya qilib, TS tekshiruvi |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Muhit o'zgaruvchilari

| O'zgaruvchi | Izoh |
|---|---|
| `NEXT_PUBLIC_API_URL` | Backend manzili |
| `NEXT_PUBLIC_ENABLE_MOCKS` | `true` — MSW mock API (backend tayyor bo'lguncha) |

`src/lib/env.ts` bu qiymatlarni ishga tushishda tekshiradi — noto'g'ri sozlansa
xato darhol chiqadi, birinchi so'rov 404 bo'lganda emas.

## Struktura

```
src/
  app/            Next App Router — sahifalar va layout
    providers.tsx Redux Provider (Client Component) + MSW gate
    globals.css   Tailwind + dizayn tokenlari
  store/
    api.ts        RTK Query baseApi — endpoint'lar injectEndpoints bilan qo'shiladi
    index.ts      makeStore() — har so'rovga alohida store (SSR xavfsizligi)
    hooks.ts      Tiplangan useAppDispatch / useAppSelector
  shared/         admin bilan umumiy kod — src/shared/README.md ga qarang
  mocks/          MSW worker (faqat dev)
  lib/env.ts      Muhit o'zgaruvchilari
```

### API endpoint qo'shish

Bitta ulkan api fayli o'smasligi uchun har domen o'z faylida:

```ts
// src/features/products/productsApi.ts
import { baseApi } from '@/store/api';
import type { Paginated, ListQuery } from '@/shared/types';

export const productsApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getProducts: build.query<Paginated<Product>, ListQuery>({
      query: (params) => ({ url: '/products', params }),
      providesTags: ['Product'],
    }),
  }),
});

export const { useGetProductsQuery } = productsApi;
```

## Backend

Backend hali yo'q. `NEXT_PUBLIC_ENABLE_MOCKS=true` bo'lganda so'rovlarni MSW
ushlab, `src/shared/mocks/` dagi soxta ma'lumotni qaytaradi. Production
build'da MSW butunlay tashlanadi — bundle'ga tushmaydi.

Backend tayyor bo'lgach: `src/shared/types/api.ts` ni real API shakliga
moslash → `NEXT_PUBLIC_ENABLE_MOCKS=false` → `src/mocks/` va
`src/shared/mocks/` ni o'chirish.

## Dizayn

Figma eksporti `../design/` papkasida (repository'dan tashqarida).
Ranglar va shriftlar `src/shared/styles/tokens.css` da — hozircha
vaqtinchalik qiymatlar, `design/tokens/tokens.md` to'lgach almashtiriladi.

## Deploy (CI/CD)

`main` ga push bo'lishi bilan `.github/workflows/deploy.yml` ishga tushadi:
kodni tortadi va konteynerni qayta quradi. Natija (muvaffaqiyat yoki xatolik)
Telegram guruhiga yuboriladi.

Job **self-hosted runner** da, ya'ni serverning o'zida bajariladi — GitHub
Actions daqiqalari sarflanmaydi va SSH kaliti kerak emas.

Server manzili: `/var/www/yopamiz-front/freelance-frontend-web`

GitHub repo secrets (Settings → Secrets and variables → Actions):

| Secret | Nima |
| --- | --- |
| `TELEGRAM_BOT_TOKEN` | Bot tokeni |
| `TELEGRAM_CHAT_ID` | Guruh/chat id |
| `TELEGRAM_THREAD_ID` | Forum mavzusi id — ixtiyoriy, bo'sh qoldirilsa ishlatilmaydi |

Serverda bir martalik tayyorgarlik:

```bash
mkdir -p /var/www/yopamiz-front
cd /var/www/yopamiz-front
git clone git@github-web:NodirbekIskandarov/freelance-frontend-web.git
cd freelance-frontend-web
cp .env.prod.example .env   # qiymatlarni to'ldiring
docker compose -f docker-compose.prod.yml up -d --build
```

Bunga qo'shimcha ravishda self-hosted runner o'rnatiladi (Settings → Actions →
Runners → New self-hosted runner), va `svc.sh install` bilan servis qilinadi.
Runner ishlaydigan foydalanuvchi: `docker` guruhida bo'lishi, yuqoridagi
katalogga yozish huquqiga va `git pull` uchun deploy key'ga (`~/.ssh/gh_web`)
ega bo'lishi kerak.

### Zaxira deploy (cron)

Actions ishlamay qolsa (billing bloki va h.k.) `scripts/autodeploy.sh` serverda
cron orqali ishlaydi: `origin/main` da yangi commit bo'lsa deploy qiladi va
natijani Telegram'ga yuboradi. Bir martalik sozlash:

```bash
# Telegram sozlamalari (repoga tushmaydi)
cat > /etc/yopamiz-web-deploy.env <<'EOF'
TG_TOKEN=<bot tokeni>
TG_CHAT=<chat id>
TG_THREAD=<thread id yoki bo'sh>
EOF
chmod 600 /etc/yopamiz-web-deploy.env

# Har 2 daqiqada tekshirish
( crontab -l 2>/dev/null
  echo "*/2 * * * * /var/www/yopamiz-front/freelance-frontend-web/scripts/autodeploy.sh" ) | crontab -
```

Log: `/var/log/yopamiz-web-deploy.log`. Actions qayta ishlay boshlagach cron'ni
`crontab -e` bilan o'chirib qo'ying — aks holda ikkalasi bir vaqtda deploy
qilishga urinadi (skriptdagi `flock` to'qnashuvdan saqlaydi, lekin ortiqcha).

`.env` dagi `NEXT_PUBLIC_*` qiymatlari build paytida bundle'ga yoziladi —
o'zgartirgandan keyin qayta build kerak (deploy `--build` bilan ishlaydi,
qo'lda esa `docker compose -f docker-compose.prod.yml up -d --build`).
