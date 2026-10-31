# 🏏 Criico-Grassroots Cricket Manager

A full-stack cricket management application built with Next.js, TypeScript, PostgreSQL, and Drizzle ORM.

Developed as part of the **Criico Full Stack Developer Technical Assessment**.

## Tech Stack

- **Framework:** Next.js (App Router), React, TypeScript
- **Styling:** Tailwind CSS, shadcn/ui
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Authentication:** Auth.js (JWT Strategy)
- **Validation:** Zod
- **Testing:** Vitest
- **Code Quality:** Oxlint, Oxfmt, Husky

## Technology Choices & Justification

### PostgreSQL + Drizzle ORM

PostgreSQL was chosen for its relational structure, data integrity, and reliable transactions, making it suitable for managing teams, players, and matches. Drizzle ORM provides lightweight, type-safe SQL queries and schema migrations with seamless TypeScript integration.

### Authentication — Auth.js

Auth.js provides secure credentials-based authentication with Next.js App Router. Passwords are verified using bcryptjs, while sessions use encrypted JWTs stored in secure, HTTP-only cookies with a 7 expiration.

## Implemented Features

- User registration and login
- JWT-based session management
- Protected dashboard routes
- User role support (Admin/User)
- Logout functionality
- Responsive authentication UI using shadcn/ui
- PostgreSQL integration with Drizzle ORM

## Upcoming Features

- Player and team management
- Match recording and player statistics
- Custom Cricket Impact Score
- Player leaderboard
- Unit tests for scoring logic

## Getting Started

**1. Clone the repository**

```bash
git clone <repository-url>
cd <project-directory>
pnpm install
```

**2. Configure environment variables**
Create a `.env` file from `.env.example`:

**3. Docker Setup**

```bash
docker compose up -d
```

**3. Run database migrations**

```bash
pnpm db:migrate
Or
pnpm db:push
```

**4. Start the development server**

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Project Status

🚧 In active development — authentication and database setup completed; cricket management features are next.

## Author

Developed for the **Criico Full Stack Developer Assessment (2026)**.
