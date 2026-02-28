# Task 6: Database Integration + User Authentication

This folder is a standalone backend for Task 6. It is intentionally separate from previous tasks.

## 1) Where to add MySQL credentials (placeholders)
Copy `.env.example` to `.env` and update these fields:

```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_NAME=YOUR_DATABASE_NAME
DB_USER=YOUR_MYSQL_USERNAME
DB_PASSWORD=YOUR_MYSQL_PASSWORD
JWT_SECRET=YOUR_SUPER_LONG_RANDOM_SECRET
PORT=4280
```

If your backend uses MySQL root locally, you might set:
- `DB_USER=root`
- `DB_PASSWORD=YOUR_ROOT_PASSWORD`

## 2) Database setup
- Open `task6/schema.sql`
- Replace `YOUR_DATABASE_NAME` with your actual DB name
- Run the SQL in MySQL

## 3) Install dependencies
From repo root:

```bash
npm install express mysql2 bcryptjs jsonwebtoken dotenv
```

## 4) Start Task 6 API
```bash
node task6/server.js
```

## 5) API flow
1. Register user: `POST /api/auth/register`
2. Login user: `POST /api/auth/login` (returns JWT)
3. Use JWT in header:
   - `Authorization: Bearer <token>`
4. Access secured endpoints:
   - `GET /api/submissions`
   - `POST /api/submissions`

## Example payloads
### Register
```json
{ "name": "Alice Doe", "email": "alice@example.com", "password": "StrongPass#2026" }
```

### Login
```json
{ "email": "alice@example.com", "password": "StrongPass#2026" }
```

### Create submission (authenticated)
```json
{ "title": "My Entry", "content": "This is secured user content." }
```
