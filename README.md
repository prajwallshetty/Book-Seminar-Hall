# Seminar Hall Booking System

Admin-only booking management for 3 predefined seminar halls using Next.js App Router, shadcn/ui, Prisma (PostgreSQL), NextAuth, and Tailwind.

## Quickstart

1. Install deps
```bash
pnpm i # or npm i / yarn
```
2. Configure environment
```bash
cp .env.example .env.local
# set DATABASE_URL, NEXTAUTH_SECRET
```
3. Prisma
```bash
pnpm prisma:generate
pnpm prisma:push
pnpm prisma:seed
```
4. Dev
```bash
pnpm dev
```

## Notes
- Uses App Router in `app/`
- shadcn/ui base tokens in `app/globals.css`
- Roles: `SUPER_ADMIN`, `ADMIN`
"# Book-Seminar-Hall" 
