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
