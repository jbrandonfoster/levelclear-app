# Level Clear - Alcohol-Free Journey Platform

A Next.js 14 production-ready application for guiding users through a 60+1 day challenge to build an alcohol-free lifestyle. Built with TypeScript, Tailwind CSS, Prisma ORM, and NextAuth.js.

## Overview

Level Clear is a peer-to-peer community platform designed for people ready to elevate their lives. The app features:

- **The 60+1 Day Challenge**: A structured 60-day program divided into 4 phases, plus an ongoing "+1" journey
- **The Classroom**: 7 deep-dive levels covering identity, motivation, presence, time reclamation, physical transformation, community impact, and homecoming
- **Community Hub**: Share stories, support others, earn points
- **Leaderboard**: Track progress with a points-based ranking system
- **Profile & Badges**: Personal progress tracking with achievement badges

## Technology Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Custom CSS
- **Database**: Prisma ORM with SQLite (easily swappable to PostgreSQL)
- **Authentication**: NextAuth.js (email/password credentials)
- **Deployment**: Vercel-ready

## Project Structure

```
levelclear-app/
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx (Landing)
│   │   ├── globals.css
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.ts
│   │   │   │   └── signup/route.ts
│   │   │   ├── challenge/route.ts
│   │   │   ├── community/route.ts
│   │   │   ├── community/[id]/like/route.ts
│   │   │   ├── leaderboard/route.ts
│   │   │   └── profile/route.ts
│   │   └── dashboard/
│   │       ├── layout.tsx
│   │       ├── challenge/page.tsx
│   │       ├── classroom/page.tsx
│   │       ├── community/page.tsx
│   │       ├── ranks/page.tsx
│   │       └── profile/page.tsx
│   ├── components/
│   │   ├── Avatar.tsx
│   │   ├── Badge.tsx
│   │   ├── BottomNav.tsx
│   │   ├── Icons.tsx
│   │   └── SectionCard.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── prisma.ts
│   │   ├── challenge-data.ts
│   │   └── classroom-data.ts
│   └── types/
│       └── index.ts
├── .env.example
└── README.md
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env.local` file based on `.env.example`:

```bash
# Database (SQLite - easy local development)
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-string-here"

# Optional: Email configuration for production
SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="your-email@example.com"
SMTP_PASSWORD="your-password"
SMTP_FROM="noreply@levelclear.com"
```

Generate a random secret:
```bash
openssl rand -base64 32
```

### 3. Set Up Database

Initialize Prisma and create the SQLite database:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

This creates a `dev.db` file in the root directory.

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Default Test User

Create a test account during signup, or seed the database:

```bash
npx prisma db seed
```

## Key Features

### Landing Page (`/`)
- Email capture signup form
- Brand messaging
- Live stats (member count, days completed)
- Free access, no credit card required

### Challenge Tab (`/dashboard/challenge`)
- 60 days organized in 4 phases
- Each day features: Title, The Truth, The Question, The Move
- Sequential unlock system
- Journal/reflection textarea
- Progress tracking
- +1 section after Day 60

**Content Included**:
- Days 1-15: Full personalized content (THE DECISION phase)
- Days 16-60: Placeholder structure (ready for custom content)
- Day 61+: The +1 Forever journey

### Classroom Tab (`/dashboard/classroom`)
- 7 comprehensive levels
- All levels accessible from Day 1 (no gatekeeping)
- Deep-dive content on:
  1. Identity Crisis
  2. Intrinsic Motivation
  3. Showing Up
  4. Time Reclamation
  5. Physical Transformation
  6. Community Impact
  7. Homecoming

### Community Tab (`/dashboard/community`)
- Text-based post feed
- User avatars with day badges
- Like and comment counts
- Creator badge for J Brandon Foster
- Posts sorted by newest first

### Ranks Tab (`/dashboard/ranks`)
- Points system:
  - Complete Day: +25 points
  - Streak Bonus: +10 points
  - Community Post: +15 points
  - Complete Level: +100 points
  - Journal Entry: +10 points
- Ranked leaderboard
- Top 3 highlighted with medals
- Current user rank card

### Profile Tab (`/dashboard/profile`)
- User avatar, name, member since date
- Stats: points, streak, best streak, current day
- 8 achievement badges:
  - Day 1 (Day 1)
  - One Week (Day 7)
  - Two Weeks (Day 14)
  - The Valley (Day 30)
  - The Shift (Day 45)
  - 60 Days (Day 60)
  - +1 Forever (Day 61)
  - Level 7 (Completing all 7 levels)
- Sign out button

## Authentication

NextAuth.js handles authentication with:
- Email/password credentials provider
- Secure password hashing (bcryptjs)
- Session management
- Protected routes via middleware

### Creating Accounts
Users can signup from the landing page with:
- Name (optional, defaults to email prefix)
- Email
- Password

## Database Schema

Key tables:

**User**
- Basic profile info, current progress
- Points, streak, and day tracking
- Relations to all user-generated content

**DayCompletion**
- Tracks which days users have completed
- Stores completion timestamp

**JournalEntry**
- One entry per user per day
- Stores user reflections

**CommunityPost**
- User-generated posts
- Text content (max 500 chars)
- Relations to likes and comments

**PostLike** / **PostComment**
- Social interactions
- User engagement tracking

## Design System

### Colors
- **Background**: `#0a0a0a` (dark-bg)
- **Cards**: `#222222` (dark-card)
- **Borders**: `#333333` (dark-border)
- **Accent**: `#c8a961` (accent-gold)

### Typography
- System font stack for optimal rendering
- Short sentences, white space, ellipses
- Peer voice (not preachy)

### Layout
- Mobile-first responsive design
- Max content width: 640px (centered)
- Bottom navigation for mobile accessibility
- Safe area inset support for notched devices

## API Routes

### Authentication
- `POST /api/auth/signup` - Create account
- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints

### User Data
- `GET/POST /api/challenge` - Get/update challenge progress
- `GET /api/profile` - Get user profile
- `GET /api/leaderboard` - Get ranked users

### Community
- `GET/POST /api/community` - Get posts / create post
- `POST /api/community/[id]/like` - Like/unlike post

## Session Management

All routes in `/dashboard` require authentication. The `DashboardLayout` component checks the session and redirects unauthenticated users to the landing page.

## Content Management

### Challenge Days
Content is stored in `/src/lib/challenge-data.ts`:
- Days 1-15 have full custom content
- Days 16-60 use a template structure
- Day 61+ is the "+1 Forever" journey

Edit the `challengeDays` array to customize content.

### Classroom Levels
Content is stored in `/src/lib/classroom-data.ts`:
- 7 levels with multiple sections each
- Each section has title and content
- Fully editable for customization

## Customization

### Changing Colors
Edit `tailwind.config.ts`:
```typescript
colors: {
  'dark-bg': '#your-color',
  'accent-gold': '#your-accent',
  // ...
}
```

### Changing Challenge Content
Edit `/src/lib/challenge-data.ts` to update day content.

### Adding New Features
1. Create API route in `/src/app/api/`
2. Add Prisma schema changes in `prisma/schema.prisma`
3. Run `npx prisma migrate dev`
4. Create frontend components in `/src/components/`

## Deployment to Vercel

### 1. Prepare Environment
```bash
# Generate NEXTAUTH_SECRET
openssl rand -base64 32
```

### 2. Set Up Database
Switch from SQLite to PostgreSQL:

Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3. Deploy
```bash
npm run build
vercel deploy
```

### 4. Set Environment Variables on Vercel
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_URL` - Your production domain
- `NEXTAUTH_SECRET` - Generated random string

## Performance Optimizations

- **Server Components**: Used by default for better performance
- **Client Components**: Only where interactivity is needed
- **Image Optimization**: Avatar colors computed on-the-fly
- **Database Queries**: Optimized with selective field selection
- **CSS**: Tailwind with custom optimizations
- **Bundle Size**: Minimal dependencies

## Security Considerations

- ✅ Password hashing with bcryptjs
- ✅ NextAuth.js session security
- ✅ CSRF protection via NextAuth
- ✅ Server-side authentication checks
- ✅ Protected API routes
- ✅ Secure secret management
- ✅ No sensitive data in URLs

## Common Tasks

### Reset Database
```bash
rm dev.db
npx prisma migrate dev --name init
```

### View Database
```bash
npx prisma studio
```

### Update Database Schema
```bash
# Edit prisma/schema.prisma
npx prisma migrate dev --name description_of_change
```

### Build for Production
```bash
npm run build
npm start
```

## Troubleshooting

**Port 3000 already in use**
```bash
npm run dev -- -p 3001
```

**Database locked error**
```bash
rm dev.db*
npx prisma migrate dev
```

**NextAuth not working**
- Verify `NEXTAUTH_SECRET` is set
- Check `NEXTAUTH_URL` matches your domain
- Review `.env.local` for typos

**Prisma client not generated**
```bash
npx prisma generate
```

## Future Enhancements

Potential features for v2:
- Email notifications for milestones
- Weekly progress reports
- Sponsor/mentorship system
- Video content integration
- Mobile app (React Native)
- Advanced analytics
- Integration with other sobriety apps
- Live community events

## License

Proprietary - Built for jbrandonfoster.com

## Support

For issues, reach out to the Level Clear team.

---

**Built with care for people on the journey to elevation.**
