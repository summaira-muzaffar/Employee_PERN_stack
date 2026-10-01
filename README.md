# Employee Management System (PERN Stack)

A full-stack CRUD application for managing employee records, built with **PostgreSQL, Express, React, and Node.js**.

## Features

- Create, view, update, and delete employee records
- Search employees
- Fields tracked: name, email, age, role (Developer / Manager / Sales / Admin / Intern), and salary
- RESTful API backend with a React + Tailwind CSS frontend

## Tech Stack

**Backend**
- Node.js + Express 5
- Prisma ORM (PostgreSQL)
- dotenv, cors, body-parser

**Frontend**
- React 19 + Vite
- Tailwind CSS
- TanStack Query
- React Hot Toast, React Icons

**Infrastructure**
- Docker + Docker Compose (multi-stage builds, healthchecks)
- Nginx (serves the frontend build, reverse-proxies `/api/` to the backend)

## Project Structure

```
employee-pern-stack/
├── backend/
│   ├── controllers/       # Request handlers
│   ├── models/            # Data models
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic / DB queries
│   ├── prisma/
│   │   └── schema.prisma   # Database schema
│   ├── utils/
│   │   └── prismaClient.js # DB connection helper
│   ├── Dockerfile           # Multi-stage build (deps → build → production)
│   ├── entrypoint.sh        # Runs Prisma migrations, then starts the server
│   └── server.js           # App entry point
├── frontend/
│   ├── src/
│   │   ├── Components/
│   │   ├── App.jsx
│   │   └── main.jsx         # App entry point
│   ├── Dockerfile           # Builds static assets, serves via Nginx
│   ├── nginx.conf           # Reverse proxy config for /api/
│   └── vite.config.js
├── docker-compose.yml       # Production-style container orchestration
├── docker-compose.dev.yml   # Dev-oriented compose overrides
└── .env.example             # Template for Docker environment variables
```

## Prerequisites

Choose one setup path:

- **Docker**: Docker + Docker Compose — no local Node.js or Postgres needed
- **Manual**: Node.js (v18+ recommended), PostgreSQL installed and running, npm

## Getting Started

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd employee-pern-stack
```

### Option A: Run with Docker (recommended)

Copy the example env file and fill in your own values:
```bash
cp .env.example .env
```
```
POSTGRES_USER=your_postgres_username
POSTGRES_PASSWORD=your_postgres_password
POSTGRES_DB=your_database_name
```

Build and start all three services (postgres, backend, frontend):
```bash
docker compose up --build
```

- Frontend: `http://localhost:5173`
- Backend API: proxied through the frontend at `http://localhost:5173/api/employee` (not exposed on its own host port)
- Postgres migrations run automatically on backend startup via `entrypoint.sh`

To stop everything:
```bash
docker compose down
```
Add `-v` to also wipe the Postgres data volume (`docker compose down -v`).

### Option B: Run manually (without Docker)

#### Backend setup
```bash
cd backend
npm install
```

Create a `.env` file in `backend/` with:
```
PG_USER=your_postgres_username
PG_HOST=localhost
PG_DATABASE=your_database_name
PG_PORT=5432
PG_PASSWORD=your_postgres_password
DATABASE_URL=postgresql://user:password@localhost:5432/your_database_name
```

Run database migrations:
```bash
npx prisma migrate dev
```

Start the backend server:
```bash
npm run server   # runs with nodemon (auto-restart on changes)
# or
npm start        # runs with node
```
The API will be available at `http://localhost:4000`.

#### Frontend setup
```bash
cd frontend
npm install
npm run dev
```
The app will be available at `http://localhost:5173`.

## API Endpoints

Base URL: `/api/employee`

| Method | Endpoint         | Description              |
|--------|------------------|---------------------------|
| GET    | `/`              | Get all employees         |
| GET    | `/search?q=`     | Search employees          |
| GET    | `/:id`           | Get a single employee     |
| POST   | `/`              | Create a new employee     |
| PUT    | `/:id`           | Update an employee        |
| DELETE | `/:id`           | Delete an employee        |

## Database Schema

`employee_details` table:
- `id` — auto-incrementing primary key
- `name` — string (max 50 chars)
- `email` — unique string (max 50 chars)
- `age` — small integer
- `role` — enum: `Developer`, `Manager`, `Sales`, `Admin`, `Intern`
- `salary` — decimal(8,2)

## License

ISC