# Fuad Gasanov — Portfolio

Personal portfolio site built with Next.js App Router.

## Stack

- Next.js (App Router) + React + TypeScript
- Tailwind CSS v4
- Framer Motion
- Lucide Icons
- Lenis (smooth scroll)
- next-intl (EN / UK / RU / FR / DE / ES / IT / PT)

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000/en](http://localhost:3000/en)

## Structure

```
messages/                      # translations
public/works/                  # project previews
src/app/[locale]/page.tsx      # main page
src/components/
  brand/gf-logo.tsx
  layout/{header,language-switcher}.tsx
  sections/{hero,skills,works,contact}.tsx
src/lib/data.ts                # projects & socials
```

Edit content in `src/lib/data.ts` and `messages/*.json`.
