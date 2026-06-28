# Gore Municipality — Backend API

NestJS backend for the Gore Woreda municipal administration portal.

## Tech Stack

- **Framework:** NestJS 11
- **Database:** MySQL 8 with TypeORM
- **Auth:** JWT (passport-jwt) + bcrypt
- **Email:** Resend
- **File Upload:** Multer (disk storage to `./uploads/`)
- **Testing:** Jest + Supertest

## Getting Started

```bash
# Install dependencies
npm install

# Create environment file
cp .env.test.example .env
# Then edit .env with your actual database credentials and secrets

# Start development server
npm run start:dev
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DB_HOST` | MySQL host |
| `DB_PORT` | MySQL port |
| `DB_USER` | MySQL user |
| `DB_PASSWORD` | MySQL password |
| `DB_NAME` | MySQL database name |
| `JWT_SECRET` | JWT signing secret |
| `JWT_EXPIRES_IN` | Token expiry (e.g. `1h`, `7d`) |
| `RESEND_API_KEY` | Resend email API key |
| `RESEND_FROM_EMAIL` | Sender email address |
| `CONTACT_NOTIFICATION_EMAIL` | Inbox for contact form submissions |
| `FRONTEND_URL` | Allowed CORS origin (default: `http://localhost:3001`) |
| `PORT` | Server port (default: `3000`) |

## API Endpoints

### Public
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Health check |
| GET | `/news` | List news articles |
| GET | `/news/:id` | Get news article |
| GET | `/announcements` | List announcements |
| GET | `/announcements/:id` | Get announcement |
| GET | `/projects` | List projects |
| GET | `/projects/:id` | Get project |
| GET | `/departments` | List departments |
| GET | `/departments/:id` | Get department |
| GET | `/documents` | List documents |
| GET | `/documents/:id` | Get document |
| POST | `/contact` | Submit contact form |
| POST | `/auth/login` | Admin login |

### Authenticated (JWT required)
| Method | Path | Description |
|--------|------|-------------|
| POST | `/admin` | Create admin |
| GET | `/admin` | List admins |
| GET | `/admin/:id` | Get admin |
| PATCH | `/admin/:id` | Update admin |
| DELETE | `/admin/:id` | Delete admin |
| POST | `/news` | Create news |
| PATCH | `/news/:id` | Update news |
| DELETE | `/news/:id` | Delete news |
| POST | `/announcements` | Create announcement |
| PATCH | `/announcements/:id` | Update announcement |
| DELETE | `/announcements/:id` | Delete announcement |
| POST | `/projects` | Create project |
| PATCH | `/projects/:id` | Update project |
| DELETE | `/projects/:id` | Delete project |
| POST | `/departments` | Create department |
| PATCH | `/departments/:id` | Update department |
| DELETE | `/departments/:id` | Delete department |
| POST | `/documents` | Create document |
| PATCH | `/documents/:id` | Update document |
| DELETE | `/documents/:id` | Delete document |
| GET | `/contact` | List contact messages |
| GET | `/contact/:id` | Get contact message |
| PATCH | `/contact/:id` | Mark message as read |
| DELETE | `/contact/:id` | Delete message |
| POST | `/upload` | Upload file |
| DELETE | `/upload/:filename` | Delete uploaded file |

## Testing

```bash
# Unit tests
npm test

# E2E / integration tests (requires MySQL test database)
npm run test:e2e

# CI mode (with coverage)
npm run test:ci
```

For E2E tests, copy `.env.test.example` to `.env.test` and configure your test database credentials. The test database `gore_municipality_test` must exist.
