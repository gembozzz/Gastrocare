# GastroCare Backend API

REST API backend for the GastroCare GERD (Gastroesophageal Reflux Disease) risk assessment application.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js 5
- **Database**: SQLite (development) / PostgreSQL (production)
- **ORM**: Prisma
- **Auth**: JWT + bcrypt
- **Validation**: express-validator
- **Security**: helmet, cors, express-rate-limit

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- Tidak perlu install database — SQLite sudah include lewat Prisma

## Getting Started

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and update the values:

```bash
cp .env.example .env
```

**Required variables:**
| Variable | Description | Default |
|---|---|---|
| `DATABASE_URL` | SQLite file path | `file:./dev.db` |
| `JWT_SECRET` | Secret key for JWT tokens (min 32 chars) | *(harus diisi)* |

> **Note:** Database file `dev.db` akan otomatis dibuat oleh Prisma saat migrate. Tidak perlu membuat database secara manual.

### 3. Run Prisma Migrations

Generate the Prisma client and apply migrations:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

### 4. Seed the Database

Populate the database with initial questions and an admin user:

```bash
npm run seed
```

**Default admin credentials:**
- Email: `admin@gastrocare.com`
- Password: `Admin@12345`

### 5. Start the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

The server will start at `http://localhost:3001`.

## API Endpoints

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |

### Auth (`/api/auth`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/login` | ❌ | Login with email & password |
| POST | `/api/auth/logout` | ✅ | Logout (invalidate token) |
| GET | `/api/auth/me` | ✅ | Get current user profile |

### Questions (`/api/questions`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/questions` | ❌ | Get all active questions (public) |
| GET | `/api/questions/all` | ✅ Admin | Get all questions including inactive |
| POST | `/api/questions` | ✅ Admin | Create a new question |
| PUT | `/api/questions/:id` | ✅ Admin | Update a question |
| DELETE | `/api/questions/:id` | ✅ Admin | Soft-delete a question |

### Assessments (`/api/assessments`)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/assessments` | ❌ | Submit assessment (public) |
| GET | `/api/assessments` | ✅ Admin | List assessments (paginated) |
| GET | `/api/assessments/:id` | ✅ Admin | Get assessment detail |

**Query Parameters for GET /api/assessments:**
- `page` — Page number (default: 1)
- `limit` — Items per page (default: 10, max: 100)
- `riskLevel` — Filter: `LOW`, `MODERATE`, `HIGH`
- `startDate` / `endDate` — Date range filter (ISO 8601)
- `search` — Search by email or name

### Analytics (`/api/analytics`) — All Admin Only
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/analytics/summary` | Overall statistics |
| GET | `/api/analytics/trend` | Assessment trends over time |
| GET | `/api/analytics/questions` | Answer distribution per question |

**Query Parameters for GET /api/analytics/trend:**
- `period` — `daily`, `weekly`, or `monthly` (default: `daily`)
- `startDate` / `endDate` — Date range filter

## Rate Limiting

| Scope | Limit |
|-------|-------|
| Global | 100 requests / 15 minutes per IP |
| Assessment Submit | 10 requests / 1 hour per IP |

## Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.js              # Seed data script
├── src/
│   ├── config/
│   │   ├── database.js      # Prisma client singleton
│   │   └── env.js           # Environment validation
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── assessmentController.js
│   │   ├── authController.js
│   │   └── questionController.js
│   ├── middleware/
│   │   ├── auth.js          # JWT authentication & role authorization
│   │   ├── errorHandler.js  # Global error handler
│   │   └── validate.js      # Request validation
│   ├── routes/
│   │   ├── analytics.js
│   │   ├── assessments.js
│   │   ├── auth.js
│   │   └── questions.js
│   ├── services/
│   │   ├── emailService.js  # Optional email notifications
│   │   └── riskCalculator.js # GERD risk scoring logic
│   └── app.js               # Express app setup
├── .env.example
├── package.json
├── README.md
└── server.js                # Entry point
```

## Prisma Commands

```bash
# Generate client after schema changes
npx prisma generate

# Create and apply a new migration
npx prisma migrate dev --name <migration_name>

# Open Prisma Studio (visual DB editor)
npx prisma studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## Migrasi ke PostgreSQL (Production)

Untuk production, disarankan beralih ke PostgreSQL:

1. Ubah provider di `prisma/schema.prisma`:
   ```diff
   datasource db {
   -  provider = "sqlite"
   +  provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Ubah `DATABASE_URL` di `.env`:
   ```diff
   - DATABASE_URL="file:./dev.db"
   + DATABASE_URL="postgresql://user:password@localhost:5432/gastrocare_db"
   ```

3. Jalankan ulang migration:
   ```bash
   npx prisma migrate dev --name switch_to_pg
   npm run seed
   ```

## Frontend Integration

Frontend sudah terintegrasi melalui API service layer di `frontend/src/lib/api.js`. Semua fetch logic terpusat di satu file — halaman hanya memanggil fungsi seperti `getQuestions()` dan `submitAssessment()`.
