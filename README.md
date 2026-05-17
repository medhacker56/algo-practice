# Algo Practice

Algo Practice is a simple full-stack application to create and manage algorithm practice tasks. It includes user authentication, task CRUD (create/read/update/delete), a dashboard, and a responsive UI built with Tailwind CSS.

Tech
- Next.js (Pages router)
- React
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Docker (optional for local DB)

Features
- User registration and login (email + password)
- Create, edit, delete tasks (per-user)
- Dashboard listing user's tasks
- Responsive layout
- Prisma schema + seed with demo user

Quick start (local)
1. Clone repository:
   git clone <repo-url>
   cd algo-practice

2. Install dependencies:
   npm ci

3. Create environment:
   cp .env.example .env
   Update env values as needed

4. If using Docker:
   docker-compose up --build
   Then, when DB is ready:
     npx prisma generate
     npx prisma migrate dev --name init
     node prisma/seed.js

5. If running without Docker:
   Ensure DATABASE_URL points to a running Postgres, then:
     npx prisma generate
     npx prisma migrate dev --name init
     node prisma/seed.js
     npm run dev

Demo credentials (created by prisma/seed.js)
- email: demo@algo.app
- password: password123

Prisma
- Schema: prisma/schema.prisma
- Models: User, Task

Notes
- Cookies are HttpOnly but NOT Secure by default to allow local development. Set Secure in production.
- Consider enabling email verification, password reset, tests and CI for production.

License
MIT
