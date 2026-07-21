# Bank tariflari monitoringi — Frontend (Dashboard)

Markaziy bank huzuridagi Moliyaviy xizmatlar isteʼmolchilari huquqlarini himoya qilish
xizmati uchun AI-agentning **boshqaruv paneli** (dashboard).

Mutaxassis shu panel orqali:

- 35 ta bankning kuzatuv holatini ko'radi,
- AI aniqlagan **tarif o'zgarishlarini** (aynan o'zgargan nuqtalar) ko'rib chiqadi,
- har bir o'zgarishni **ko'rib chiqildi / rad etildi** deb belgilaydi,
- qo'lda skanerlashni ishga tushiradi.

## Texnologiyalar

- **React 19 + TypeScript + Vite 7**
- **React Router** — sahifalar
- **Axios** — backend API

## Sahifalar

| Yo'l                            | Sahifa                                                                             |
| ------------------------------- | ---------------------------------------------------------------------------------- |
| `/`                             | Boshqaruv paneli — ko'rsatkichlar, kategoriyalar diagrammasi, so'nggi o'zgarishlar |
| `/changes`                      | O'zgarishlar feed'i (status/bo'lim bo'yicha filtr)                                 |
| `/changes/:id`                  | O'zgarish tafsiloti — **eski → yangi qiymat** (diff) + mutaxassis qarori           |
| `/banks`                        | 35 ta bank ro'yxati                                                                |
| `/banks/:slug`                  | Bank tafsiloti — kuzatiladigan manbalarni sozlash, snapshotlar                     |
| `/snapshots` · `/snapshots/:id` | Yig'ilgan ma'lumot holatlari                                                       |
| `/scans`                        | Skanerlashlar tarixi                                                               |

## Ishga tushirish

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/ ishlab chiqarish uchun
npm run preview  # build'ni ko'rish
```

Backend manzili `.env` faylida:

```
VITE_API_URL=http://localhost:8091
```

> Backend (`../bank-backend`) ishlab turishi kerak. Avval u yerda `yarn seed` bilan
> banklarni yozing va `yarn dev` bilan serverni ishga tushiring.
