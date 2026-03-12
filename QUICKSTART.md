# Level Clear - Quick Start Guide

## Installation & Setup (5 minutes)

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Create Environment File
Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Edit `.env.local` and generate a secret:
```bash
# Generate a random NEXTAUTH_SECRET
openssl rand -base64 32
# Copy output into .env.local
```

Your `.env.local` should look like:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-generated-secret-here"
```

### Step 3: Set Up Database
```bash
npx prisma generate
npx prisma migrate dev --name init
```

This creates a SQLite database file (`dev.db`) with all tables.

### Step 4: Run Development Server
```bash
npm run dev
```

Navigate to http://localhost:3000

## First Steps in the App

1. **Create an account** on the landing page with:
   - Your name
   - Email (any email works locally)
   - Password

2. **Start Day 1** of the challenge
   - Read "The Truth"
   - Reflect on "The Question"
   - Complete "The Move"
   - Write in your journal
   - Click "Complete Day"

3. **Explore the Classroom** - Access all 7 levels instantly

4. **Share to Community** - Create your first post

5. **Check Ranks** - See the leaderboard

6. **View Profile** - Track your progress and badges

## Project Structure (Quick Reference)

```
levelclear-app/
├── src/
│   ├── app/                    # Next.js pages & API routes
│   │   ├── page.tsx            # Landing page
│   │   └── dashboard/          # 5 main tabs
│   ├── components/             # Reusable UI components
│   ├── lib/                    # Core logic
│   │   ├── challenge-data.ts   # 60 days of content
│   │   ├── classroom-data.ts   # 7 levels of content
│   │   └── auth.ts             # Authentication config
│   └── types/                  # TypeScript types
├── prisma/
│   └── schema.prisma           # Database schema
├── package.json
├── tailwind.config.ts          # Design system
└── .env.local                  # Secrets (not in git)
```

## Key Features Walkthrough

### Landing Page (`/`)
- Signup / Login
- Brand messaging
- Stats display

### Challenge Tab (`/dashboard/challenge`)
- Current day content
- Journal reflection
- Complete day to unlock next

### Classroom Tab (`/dashboard/classroom`)
- 7 in-depth levels
- All accessible from Day 1
- No progression requirements

### Community Tab (`/dashboard/community`)
- Post feed
- Like posts
- See others' day badges

### Ranks Tab (`/dashboard/ranks`)
- Leaderboard
- Points system
- Streak tracking

### Profile Tab (`/dashboard/profile`)
- User stats
- Achievement badges
- Sign out

## Making Changes

### Edit Challenge Content
File: `/src/lib/challenge-data.ts`

```typescript
{
  dayNumber: 1,
  title: 'Your Title',
  truth: 'The truth...',
  question: 'Your question?',
  move: 'What to do...',
  phase: 'THE DECISION',
}
```

### Edit Classroom Content
File: `/src/lib/classroom-data.ts`

### Edit Colors/Design
File: `/tailwind.config.ts`

```typescript
colors: {
  'dark-bg': '#0a0a0a',
  'accent-gold': '#c8a961',
  // ...
}
```

## Database Management

### View Database
```bash
npx prisma studio
```
Opens visual editor at http://localhost:5555

### Reset Database
```bash
rm dev.db*
npx prisma migrate dev --name init
```

### See All Users
```bash
npx prisma db execute --stdin < query.sql
```

## Testing Checklist

- [ ] Create account with email/password
- [ ] View Day 1 content
- [ ] Write journal entry
- [ ] Complete day and advance to Day 2
- [ ] Visit Classroom and read Level 1
- [ ] Create community post
- [ ] Like someone's post
- [ ] Check Ranks leaderboard
- [ ] View profile with badges
- [ ] Sign out and log back in

## Common Commands

```bash
# Development
npm run dev           # Start dev server

# Database
npx prisma studio    # Visual DB editor
npx prisma migrate dev --name description  # Schema changes

# Build & Deploy
npm run build         # Production build
npm start             # Run production build

# Linting
npm run lint          # Check code quality
```

## Deployment Checklist

Before deploying to production:

1. Switch database from SQLite to PostgreSQL:
   - Update `prisma/schema.prisma` provider
   - Set `DATABASE_URL` env var on Vercel

2. Set environment variables:
   - `NEXTAUTH_URL` = your domain
   - `NEXTAUTH_SECRET` = new random secret
   - `DATABASE_URL` = PostgreSQL connection

3. Run migrations on production database:
   ```bash
   npx prisma migrate deploy
   ```

4. Deploy:
   ```bash
   git push  # If using git
   ```

## Troubleshooting

**"Cannot find module" errors**
```bash
npm install
npx prisma generate
```

**Port 3000 in use**
```bash
npm run dev -- -p 3001
```

**Database errors**
```bash
rm dev.db*
npx prisma migrate dev --name init
```

**Authentication not working**
- Check `.env.local` for typos
- Verify `NEXTAUTH_SECRET` is set
- Confirm `NEXTAUTH_URL` is correct

**Prisma errors**
```bash
npx prisma generate
npx prisma migrate dev
```

## Next Steps

1. Customize challenge content in `challenge-data.ts`
2. Update design colors in `tailwind.config.ts`
3. Add more classroom content
4. Deploy to Vercel
5. Monitor user engagement
6. Gather feedback and iterate

## Support Resources

- Next.js Docs: https://nextjs.org/docs
- Prisma Docs: https://www.prisma.io/docs
- Tailwind CSS: https://tailwindcss.com
- NextAuth.js: https://next-auth.js.org

## Architecture Notes

- **Server Components**: Pages are server components by default (faster)
- **Client Components**: Only interactive parts use 'use client'
- **API Routes**: Handle all data mutations and external calls
- **Prisma**: ORM handles all database operations safely
- **NextAuth**: Secures all routes and manages sessions
- **Tailwind**: Utility-first CSS for fast, consistent styling

---

**Ready to start? Run `npm run dev` and visit http://localhost:3000**
