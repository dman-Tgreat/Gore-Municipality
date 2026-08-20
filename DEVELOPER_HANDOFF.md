# 🏛️ Gore Municipality — Developer Handoff Document

> **Project:** Gore Woreda Municipal Administration Portal
> **Date:** August 2026
> **Purpose:** Complete onboarding guide for the incoming developer

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Tech Stack](#2-tech-stack)
3. [Repository Structure](#3-repository-structure)
4. [Getting Started](#4-getting-started)
5. [Environment Variables](#5-environment-variables)
6. [Database Schema](#6-database-schema)
7. [API Reference](#7-api-reference)
8. [Authentication](#8-authentication)
9. [File Upload System](#9-file-upload-system)
10. [Internationalization (i18n)](#10-internationalization-i18n)
11. [Frontend Architecture](#11-frontend-architecture)
12. [Admin Dashboard](#12-admin-dashboard)
13. [Deployment](#13-deployment)
14. [Testing](#14-testing)
15. [Known Issues & Gotchas](#15-known-issues--gotchas)
16. [Useful Commands Reference](#16-useful-commands-reference)

---

## 1. Project Overview

This is the official website for **Gore Woreda** (district) in the Illubabor Zone, Oromia, Ethiopia. It serves as a digital presence for the municipal government, providing:

- **Public-facing pages:** News, announcements, projects, investments/tourism, departments, contact form
- **Admin CMS:** Full content management for all content types (news, announcements, projects, departments, investments, hero slides, settings, admin users)
- **Trilingual support:** English (en), Amharic (am), Oromo (om)
- **Dark/light theme:** Client-side toggle with localStorage persistence

---

## 2. Tech Stack

### Backend (`/server`)
| Layer | Technology |
|-------|-----------|
| Framework | **NestJS 11** (Node.js) |
| Language | **TypeScript 5.7** |
| ORM | **TypeORM 1.0** |
| Database | **PostgreSQL** (with SSL) |
| Auth | **JWT** via `passport-jwt` + `bcrypt` |
| Validation | **class-validator** + **class-transformer** |
| Email | **Resend** API |
| File Storage | **Cloudinary** (images + docs) |
| File Upload | **Multer** (memory storage → buffer → Cloudinary) |
| API Docs | **Swagger / OpenAPI** (`@nestjs/swagger`) |
| Testing | **Jest** + **Supertest** |

### Frontend (`/client`)
| Layer | Technology |
|-------|-----------|
| Framework | **Next.js 16** (App Router) |
| React | **React 19** |
| Styling | **Tailwind CSS 4** (via PostCSS) |
| i18n | **next-intl 4** (3 locales) |
| Icons | **lucide-react** |
| Fonts | **Inter** (via `next/font`) |

---

## 3. Repository Structure

```
├── server/                        # NestJS backend
│   ├── src/
│   │   ├── main.ts                # App bootstrap (CORS, pipes, static assets)
│   │   ├── app.module.ts          # Root module (TypeORM, all feature modules)
│   │   ├── admin/                 # Admin user management (CRUD)
│   │   ├── auth/                  # JWT login, guards, strategies
│   │   ├── news/                  # News articles (CRUD + i18n)
│   │   ├── announcements/         # Public announcements (CRUD + i18n)
│   │   ├── projects/              # Municipal projects (CRUD + i18n)
│   │   ├── departments/           # Government departments (CRUD + i18n)
│   │   ├── investments/           # Investment opportunities (CRUD + i18n)
│   │   ├── contact/               # Contact form submissions
│   │   ├── hero-slides/           # Homepage carousel images
│   │   ├── settings/              # Key-value site settings
│   │   ├── upload/                # Cloudinary file upload/delete
│   │   └── config/                # (empty - using ConfigModule.forRoot)
│   ├── seed.js                    # Database seed script
│   ├── .env                       # Environment variables (gitignored)
│   ├── .env.test.example          # Test env template
│   └── package.json
├── client/                        # Next.js frontend
│   ├── src/
│   │   ├── app/                   # App Router pages
│   │   │   ├── layout.tsx         # Root layout (fonts, theme, i18n provider)
│   │   │   ├── page.tsx           # Homepage
│   │   │   ├── news/              # News listing + detail pages
│   │   │   ├── announcements/     # Announcements listing + detail
│   │   │   ├── projects/          # Projects listing + detail
│   │   │   ├── investment-tourism/ # Investments listing + detail
│   │   │   ├── about/             # About page
│   │   │   ├── service/           # Services/departments page
│   │   │   ├── contact/           # Contact form page
│   │   │   └── admin/             # Admin dashboard (login + CMS)
│   │   ├── component/             # Reusable UI components
│   │   │   ├── Header.tsx         # Navigation header
│   │   │   ├── Footer.tsx         # Site footer
│   │   │   ├── Hero.tsx           # Homepage hero carousel
│   │   │   ├── FileUpload.tsx     # Cloudinary file upload widget
│   │   │   ├── Pagination.tsx     # Reusable pagination component
│   │   │   ├── StatsGrid.tsx      # Homepage stats
│   │   │   ├── Services.tsx       # Services overview
│   │   │   └── QuickLinks.tsx     # Quick navigation links
│   │   ├── context/               # React contexts
│   │   │   ├── LocaleContext.tsx   # Language (en/am/om) state
│   │   │   └── ThemeContext.tsx    # Dark/light theme state
│   │   ├── i18n/
│   │   │   └── messages.ts        # All translation strings
│   │   └── lib/
│   │       └── api.ts             # API client (fetch wrapper + typed endpoints)
│   └── package.json
├── scripts/
│   └── i18n-validate.js           # Script to validate i18n key coverage
└── .github/                       # GitHub Actions workflows
```

---

## 4. Getting Started

### Prerequisites
- **Node.js** ≥ 20 (project uses `.nvmrc` — run `nvm use` in server/)
- **PostgreSQL** database (cloud or local)
- **Cloudinary** account (for file uploads)
- **Resend** API key (for email)

### Backend Setup

```bash
cd server

# Install dependencies
npm install

# Create environment file
cp .env.test.example .env
# Edit .env with your credentials (see Environment Variables section below)

# Seed the database (creates admin user + sample data)
node seed.js

# Start development server (runs on port 3001)
npm run start:dev
```

**Default admin credentials after seeding:**
- Email: `admin2@gmail.com`
- Password: `admin1236`

### Frontend Setup

```bash
cd client

# Install dependencies
npm install

# Create environment file
echo "NEXT_PUBLIC_API_URL=http://localhost:3001" > .env.local

# Start development server (runs on port 3000)
npm run dev
```

---

## 5. Environment Variables

### Backend (`server/.env`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `DB_HOST` | ✅ | PostgreSQL host | `db.example.com` |
| `DB_PORT` | ✅ | PostgreSQL port | `5432` |
| `DB_USER` | ✅ | PostgreSQL username | `postgres` |
| `DB_PASSWORD` | ✅ | PostgreSQL password | `secret123` |
| `DB_NAME` | ✅ | PostgreSQL database name | `gore_municipality` |
| `JWT_SECRET` | ✅ | JWT signing secret (use a long random string) | `your-super-secret-key` |
| `JWT_EXPIRES_IN` | ❌ | Token expiry duration | `7d` (default) |
| `RESEND_API_KEY` | ✅ | Resend email API key | `re_xxxxx` |
| `RESEND_FROM_EMAIL` | ✅ | Sender email address | `noreply@gore.gov.et` |
| `CONTACT_NOTIFICATION_EMAIL` | ✅ | Inbox for contact form submissions | `admin@gore.gov.et` |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name | `your-cloud` |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key | `123456789` |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret | `your-secret` |
| `PORT` | ❌ | Server listen port | `3001` (default) |

### Frontend (`client/.env.local`)

| Variable | Required | Description | Example |
|----------|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend API base URL | `http://localhost:3001` |

---

## 6. Database Schema

The project uses **TypeORM with `synchronize: true`** — tables are auto-created/updated from entities. Here are the key tables:

### `admins`
| Column | Type | Notes |
|--------|------|-------|
| id | integer (PK) | Auto-increment |
| fullName | varchar(100) | |
| email | varchar(150) | Unique |
| password | varchar | bcrypt hash |
| isActive | boolean | Default: true |
| createdAt | timestamp | Auto |
| updatedAt | timestamp | Auto |

### `news`
| Column | Type | Notes |
|--------|------|-------|
| id | integer (PK) | Auto-increment |
| title | varchar(255) | English (required) |
| titleAm | varchar(255) | Amharic (optional) |
| titleOm | varchar(255) | Oromo (optional) |
| slug | varchar(255) | Unique, auto-generated from title |
| summary | text | English (required) |
| summaryAm | text | Amharic (optional) |
| summaryOm | text | Oromo (optional) |
| content | text | English (required) |
| contentAm | text | Amharic (optional) |
| contentOm | text | Oromo (optional) |
| coverImage | varchar(500) | Cloudinary URL or null |
| published | boolean | Default: true |
| createdBy | FK → admins.id | |
| createdAt / updatedAt | timestamps | Auto |

### `announcement`
Same structure as `news` but with `description` field instead of `slug`. Fields: `title`, `titleAm`, `titleOm`, `description`, `descriptionAm`, `descriptionOm`, `content`, `contentAm`, `contentOm`, `published`, `createdBy`.

### `project`
| Column | Type | Notes |
|--------|------|-------|
| id | integer (PK) | |
| name / nameAm / nameOm | varchar(255) | Trilingual |
| description / descriptionAm / descriptionOm | text | Trilingual |
| budget | decimal(15,2) | Nullable |
| status | varchar(50) | `planned` (default), `ongoing`, `completed` |
| startDate / endDate | date | Nullable |
| location | text | Nullable |
| coverImage | varchar(500) | Cloudinary URL |
| fundingSource / contractor | text | Nullable |
| category | varchar(100) | Nullable |
| createdBy | FK → admins.id | |
| createdAt / updatedAt | timestamps | |

### `department`
| Column | Type | Notes |
|--------|------|-------|
| id | integer (PK) | |
| name / nameAm / nameOm | text | Trilingual |
| description / descriptionAm / descriptionOm | text | Trilingual |
| head | text | Department head name |
| phone | varchar(50) | Validated format |
| email | text | |
| office | text | Physical location |
| image | varchar(500) | Nullable |
| createdAt / updatedAt | timestamps | |

### `investments`
| Column | Type | Notes |
|--------|------|-------|
| id | integer (PK) | |
| title / titleAm / titleOm | varchar(255) | Trilingual |
| description / descriptionAm / descriptionOm | text | Trilingual |
| content / contentAm / contentOm | text | Trilingual |
| category | varchar(100) | e.g. `opportunity` |
| coverImage | varchar(500) | |
| location | varchar(255) | |
| contactPhone | varchar(50) | |
| contactEmail | varchar(255) | |
| published | boolean | Default: true |
| createdBy | FK → admins.id | |
| createdAt / updatedAt | timestamps | |

### `contact`
| Column | Type | Notes |
|--------|------|-------|
| id | integer (PK) | |
| name | varchar(255) | Submitter name |
| email | varchar(255) | Submitter email |
| subject | varchar(255) | |
| message | text | |
| isRead | boolean | Default: false |
| createdAt / updatedAt | timestamps | |

### `hero_slide`
| Column | Type | Notes |
|--------|------|-------|
| id | integer (PK) | |
| imageUrl | varchar(500) | Cloudinary URL |
| description | text | Slide caption |
| sortOrder | integer | Default: 0 |
| isActive | boolean | Default: true |
| createdAt / updatedAt | timestamps | |

### `setting`
| Column | Type | Notes |
|--------|------|-------|
| id | integer (PK) | |
| settingKey | varchar(100) | Unique key |
| settingValue | text | Value (English) |
| settingValueom | text | Value (Oromo) — nullable |
| settingValueam | text | Value (Amharic) — nullable |
| createdAt / updatedAt | timestamps | |

---

## 7. API Reference

**Base URL:** `http://localhost:3001` (development)

> 📘 **Swagger UI** is available at `http://localhost:3001/api` when the server is running.

### Authentication

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/login` | POST | No | Login, returns JWT |

**Login Request:**
```json
{ "email": "admin2@gmail.com", "password": "admin1236" }
```

**Login Response:**
```json
{ "success": true, "message": "Login successful", "accessToken": "eyJhbG..." }
```

All protected endpoints require header: `Authorization: Bearer <token>`

### News

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/news` | GET | No | List all (query: `page`, `limit`, `published`) |
| `/news/:id` | GET | No | Get one |
| `/news` | POST | ✅ | Create |
| `/news/:id` | PATCH | ✅ | Update |
| `/news/:id` | DELETE | ✅ | Delete |

**Create/Update Body:**
```json
{
  "title": "Breaking News",
  "titleAm": "...",        // optional
  "titleOm": "...",        // optional
  "slug": "breaking-news", // optional (auto-generated)
  "summary": "...",
  "content": "...",
  "coverImage": "https://res.cloudinary.com/...", // optional
  "published": true         // optional, default true
}
```

### Announcements

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/announcements` | GET | No | List all (query: `page`, `limit`, `published`) |
| `/announcements/:id` | GET | No | Get one |
| `/announcements` | POST | ✅ | Create |
| `/announcements/:id` | PATCH | ✅ | Update |
| `/announcements/:id` | DELETE | ✅ | Delete |

**Create/Update Body:**
```json
{
  "title": "...",
  "description": "...",  // short description
  "content": "...",       // full HTML/text content
  "published": true
}
```

### Projects

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/projects` | GET | No | List all (query: `page`, `limit`, `status`) |
| `/projects/:id` | GET | No | Get one |
| `/projects` | POST | ✅ | Create |
| `/projects/:id` | PATCH | ✅ | Update |
| `/projects/:id` | DELETE | ✅ | Delete |

**Create/Update Body:**
```json
{
  "name": "Road Upgrade",
  "description": "...",
  "budget": 5000000,       // optional
  "status": "planned",     // planned | ongoing | completed
  "startDate": "2026-01-01",
  "endDate": "2026-12-31",
  "location": "Gore Town",
  "coverImage": "...",
  "fundingSource": "...",
  "contractor": "...",
  "category": "infrastructure"
}
```

### Departments

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/departments` | GET | No | List all (query: `page`, `limit`) |
| `/departments/:id` | GET | No | Get one |
| `/departments` | POST | ✅ | Create |
| `/departments/:id` | PATCH | ✅ | Update |
| `/departments/:id` | DELETE | ✅ | Delete |

### Investments

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/investments` | GET | No | List all (query: `page`, `limit`, `published`, `category`) |
| `/investments/:id` | GET | No | Get one |
| `/investments` | POST | ✅ | Create |
| `/investments/:id` | PATCH | ✅ | Update |
| `/investments/:id` | DELETE | ✅ | Delete |

### Contact

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/contact` | POST | No | Submit contact form |
| `/contact` | GET | ✅ | List all messages (query: `page`, `limit`) |
| `/contact/:id` | GET | ✅ | Get one message |
| `/contact/:id` | PATCH | ✅ | Mark as read (`{ "isRead": true }`) |
| `/contact/:id` | DELETE | ✅ | Delete message |

**Contact Submission Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Inquiry",
  "message": "Hello, I have a question..."
}
```

### Hero Slides

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/hero-slides` | GET | No | List all |
| `/hero-slides/active` | GET | No | List active only |
| `/hero-slides/:id` | GET | No | Get one |
| `/hero-slides` | POST | ✅ | Create |
| `/hero-slides/:id` | PATCH | ✅ | Update |
| `/hero-slides/:id` | DELETE | ✅ | Delete |

### Settings

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/settings` | GET | No | List all |
| `/settings/key/:key` | GET | No | Get value by key |
| `/settings/:id` | GET | No | Get one |
| `/settings` | POST | ✅ | Create |
| `/settings/bulk` | POST | ✅ | Bulk upsert |
| `/settings/:id` | PATCH | ✅ | Update |
| `/settings/:id` | DELETE | ✅ | Delete |

### Upload (Cloudinary)

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/upload` | POST | ✅ | Upload file (multipart: `file`) |
| `/upload?publicId=xxx` | DELETE | ✅ | Delete by public ID |
| `/upload?url=xxx` | DELETE | ✅ | Delete by URL |

**Allowed file types:** jpg, jpeg, png, gif, webp, pdf, doc, docx, xls, xlsx
**Max size:** 10 MB

### Admin Users

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/admin` | GET | ✅ | List all admins |
| `/admin/:id` | GET | ✅ | Get one |
| `/admin` | POST | ✅ | Create admin |
| `/admin/:id` | PATCH | ✅ | Update |
| `/admin/:id` | DELETE | ✅ | Delete |

---

## 8. Authentication

- **Strategy:** JWT Bearer Token
- **Guard:** `JwtAuthGuard` (applied per-route with `@UseGuards(JwtAuthGuard)`)
- **Login:** `POST /auth/login` with `{ email, password }` → returns `{ accessToken }`
- **Password hashing:** bcrypt (cost factor: 10)
- **Token storage (frontend):** `localStorage` under key `admin_token`
- **Token expiry:** Configurable via `JWT_EXPIRES_IN` env var (default: 7 days)

The JWT payload contains `{ sub: adminId, email: "..." }`. The `JwtStrategy` decodes it and attaches `req.user = { id, email }`.

---

## 9. File Upload System

Files are uploaded to **Cloudinary** (not local disk). The flow:

1. Client sends `POST /upload` with `FormData` containing a `file` field
2. Multer uses `memoryStorage()` — file stays in memory as a `Buffer`
3. Backend validates file type and size (10MB max)
4. `CloudinaryService.uploadBuffer()` streams the buffer to Cloudinary
5. Returns `{ url, publicId, ... }` — URL is a full Cloudinary HTTPS URL

**Key files:**
- `server/src/upload/upload.controller.ts` — Upload/delete endpoints
- `server/src/upload/cloudinary.service.ts` — Cloudinary SDK wrapper
- `server/src/upload/upload.module.ts` — Module wiring
- `client/src/component/FileUpload.tsx` — Reusable upload widget

**Delete:** Uses `publicId` query param (preferred) or extracts it from the Cloudinary URL.

---

## 10. Internationalization (i18n)

### Three Languages
- **English (en)** — Default/fallback
- **Amharic (am)** — Ethiopian national language
- **Oromo (om)** — Regional language of Oromia

### How It Works

**Translation strings** are in `client/src/i18n/messages.ts` — a massive object with keys for every UI string in all 3 languages.

**Locale context** (`client/src/context/LocaleContext.tsx`) provides:
- `locale` — current language code
- `setLocale(lang)` — switch language
- `t` — translation object (accessed as `t.nav.home`, `t.admin.dashboard`, etc.)

**Content i18n** — Content entities (news, announcements, projects, departments, investments) store trilingual fields directly in the database:
- `title` (English), `titleAm` (Amharic), `titleOm` (Oromo)
- `content` (English), `contentAm` (Amharic), `contentOm` (Oromo)
- etc.

The frontend renders the field matching the current locale, falling back to English if the translation is empty.

**i18n validation script:** `scripts/i18n-validate.js` — checks that all locale keys exist in all 3 languages.

---

## 11. Frontend Architecture

### Routing (Next.js App Router)
All pages are under `client/src/app/`. Most are `'use client'` components.

| Route | Description |
|-------|-------------|
| `/` | Homepage (hero, stats, services, quick links) |
| `/news` | News listing with pagination |
| `/news/[id]` | Single news article |
| `/announcements` | Announcements listing |
| `/announcements/[id]` | Single announcement |
| `/projects` | Projects listing with filters |
| `/projects/[id]` | Single project |
| `/investment-tourism` | Investments listing |
| `/investment-tourism/[id]` | Single investment |
| `/about` | About the municipality |
| `/service` | Departments/services |
| `/contact` | Contact form |
| `/admin` | Admin dashboard (protected) |
| `/admin/login` | Admin login page |

### Key Components (`client/src/component/`)

- **`Header.tsx`** — Top navigation with language switcher, dark mode toggle, mobile accordion menu
- **`Footer.tsx`** — Site footer with links
- **`Hero.tsx`** — Homepage image carousel (fetches from `/hero-slides/active`)
- **`FileUpload.tsx`** — Reusable file upload widget (Cloudinary-backed)
- **`Pagination.tsx`** — Reusable pagination component
- **`StatsGrid.tsx`** — Homepage statistics section
- **`Services.tsx`** — Services overview section
- **`QuickLinks.tsx`** — Quick navigation cards

### API Client (`client/src/lib/api.ts`)

A typed fetch wrapper that:
- Prepends `NEXT_PUBLIC_API_URL` to all paths
- Sets `Content-Type: application/json`
- Provides typed functions for every API endpoint (e.g. `newsApi.getAll()`, `projectsApi.create()`)
- Handles errors by parsing JSON error responses

### Context Providers

- **`LocaleContext`** — Manages language state, reads from `localStorage('gore_locale')`, default `en`
- **`ThemeContext`** — Manages dark/light theme, reads from `localStorage('gore_theme')`, default system preference

---

## 12. Admin Dashboard

Accessed at `/admin`. Protected by JWT authentication.

### Tabs
1. **Messages** — View/manage contact form submissions (filter by read/unread, date range, search)
2. **News** — CRUD for news articles (search, status filter)
3. **Announcements** — CRUD for announcements
4. **Projects** — CRUD for projects (status filter: planned/ongoing/completed)
5. **Departments** — CRUD for departments
6. **Investments** — CRUD for investment opportunities (category filter)
7. **Admins** — Manage admin users (create, toggle active, delete)
8. **Hero Slides** — Manage homepage carousel images
9. **Settings** — Key-value site settings (bulk save)

### Key Architecture

- **`admin-context.tsx`** — Central state management via React Context. Holds all data, form states, filter states, and CRUD handlers.
- Each tab has its own component in `client/src/app/admin/components/`.
- All CRUD operations go through the typed API functions in `client/src/lib/api.ts`.
- Forms support trilingual editing via a language tab switcher (`formLang` state).

---

## 13. Deployment

### Production URLs
- **Frontend:** `https://gore-municipality.vercel.app` (Vercel)
- **Backend:** Self-hosted or cloud VM (configured via `PORT` env var)

### CORS Configuration
```typescript
// server/src/main.ts
app.enableCors({
  origin: [
    'http://localhost:3000',
    'https://gore-municipality.vercel.app',
    /\.vercel\.app$/,  // Allows any Vercel preview URL
  ],
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
});
```

### Deployment Checklist
1. Set all environment variables on your hosting platform
2. Ensure PostgreSQL is accessible (with SSL — `rejectUnauthorized: false`)
3. Run `npm run build` in both `server/` and `client/`
4. Start backend: `node dist/main`
5. Start frontend: `npm run start` or deploy to Vercel
6. Seed database: `node seed.js` (first time only)

### TypeORM Sync
⚠️ **`synchronize: true`** is enabled — TypeORM will auto-create/update tables on startup. For production, consider switching to migrations:
```bash
# Generate migration
npx typeorm migration:generate -d src/data-source.ts src/migrations/MigrationName

# Run migrations
npx typeorm migration:run -d src/data-source.ts
```

---

## 14. Testing

### Backend Tests

```bash
cd server

# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# CI mode (with coverage, limited workers)
npm run test:ci

# E2E tests (requires test database)
# First configure .env.test with test DB credentials
npm run test:e2e
```

Test files are co-located with source files (e.g., `news.service.spec.ts` next to `news.service.ts`).

### Frontend

```bash
cd client

# Lint
npm run lint

# Build (catches type errors)
npm run build
```

### i18n Validation
```bash
node scripts/i18n-validate.js
```
Ensures all i18n keys exist in all 3 locales.

---

## 15. Known Issues & Gotchas

### ⚠️ Database Synchronize
- `synchronize: true` in TypeORM means the schema auto-updates on every startup. This is convenient for development but risky in production — it can cause data loss if entity changes conflict with existing data.

### ⚠️ SSL Database Connection
- The PostgreSQL connection uses `ssl: { rejectUnauthorized: false }`. This is fine for development/cloud DBs but should be reviewed for security in production.

### ⚠️ Hardcoded CORS Origins
- The CORS config in `main.ts` has specific origins. If you change deployment URLs, update this array.

### ⚠️ Static File Serving
- `app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads/' })` — legacy file serving is still configured even though uploads now go to Cloudinary. The `uploads/` directory references can be cleaned up.

### ⚠️ Seed Script
- `seed.js` uses raw `pg` client (not TypeORM) and clears/recreates data. It will DELETE all existing data in the listed tables.

### ⚠️ No Rate Limiting
- Public endpoints (contact form, login) have no rate limiting. Consider adding throttling for production.

### ⚠️ Client-Side i18n
- Translations are loaded as a single large object. For a larger app, consider lazy-loading locale bundles.

---

## 16. Useful Commands Reference

```bash
# --- Backend ---
cd server
npm run start:dev          # Dev server with hot reload
npm run build              # Build for production
npm run start:prod         # Run production build
npm test                   # Run unit tests
node seed.js               # Seed database

# --- Frontend ---
cd client
npm run dev                # Dev server on port 3000
npm run build              # Build for production
npm run start              # Start production server
npm run lint               # ESLint

# --- Database ---
# Connect to PostgreSQL
psql -h $DB_HOST -U $DB_USER -d $DB_NAME

# --- i18n ---
node scripts/i18n-validate.js   # Check i18n key coverage
```

---

## Quick Reference: Key File Locations

| What | Where |
|------|-------|
| Backend entry point | `server/src/main.ts` |
| Root module | `server/src/app.module.ts` |
| JWT strategy | `server/src/auth/strategies/jwt.strategy.ts` |
| JWT guard | `server/src/auth/guards/jwt-auth.guard.ts` |
| Cloudinary service | `server/src/upload/cloudinary.service.ts` |
| All entities | `server/src/*/entities/*.entity.ts` |
| All DTOs | `server/src/*/dto/*.dto.ts` |
| Frontend API client | `client/src/lib/api.ts` |
| Admin dashboard state | `client/src/app/admin/components/admin-context.tsx` |
| i18n translations | `client/src/i18n/messages.ts` |
| Locale context | `client/src/context/LocaleContext.tsx` |
| Theme context | `client/src/context/ThemeContext.tsx` |
| File upload component | `client/src/component/FileUpload.tsx` |
| Swagger docs | `http://localhost:3001/api` (when running) |

---

*Document prepared for developer handoff. For questions, refer to the inline code comments or the Swagger API docs at `/api`.*
