# Payment Dashboard App

A full-stack, mobile-first Payment Management Dashboard built with **React Native (Expo)** and **NestJS**.

---

## Features

### Backend (NestJS + Prisma + PostgreSQL)
- JWT Authentication (admin/viewer roles)
- Payments: CRUD, filtering, pagination, stats, CSV export
- User Management: Admins can add/view users
- WebSocket real-time updates
- CSV export (web & mobile)
- Basic tests (Jest + Supertest)

### Frontend (React Native/Expo)
- Secure login (JWT, error handling, polished UI)
- Dashboard: metrics, revenue chart, real-time updates, admin-only user management
- Transactions: paginated, filterable, real-time, exportable, empty state, polished cards
- Transaction details: color-coded, card layout
- Add payment: form with validation, modern design
- User management: admins can add/view users
- Navigation between all screens
- Secure JWT storage (web/native)
- Responsive & accessible

---

## Tech Stack
- **Frontend:** React Native (Expo), react-navigation, axios, react-native-chart-kit, socket.io-client, expo-secure-store, @react-native-picker/picker, expo-file-system, expo-sharing
- **Backend:** NestJS, Prisma, PostgreSQL, @nestjs/jwt, @nestjs/websockets, bcryptjs
- **Testing:** Jest, Supertest

---

## Folder Structure

```
client/           # React Native (Expo) frontend
  assets/         # App icons and images
  src/            # Source code
    screens/      # App screens (UI)
    services/     # API and service logic
    utils/        # Utility functions (e.g., auth)
  App.tsx         # App entry point
  index.ts        # Expo entry
  app.json        # Expo config

server/           # NestJS backend
  src/            # Backend source code
    auth/         # Auth logic (JWT, guards)
    payments/     # Payments module (CRUD, stats, gateway)
    users/        # User management
    app.module.ts # Main app module
    main.ts       # App bootstrap
  prisma/         # Prisma ORM setup
    schema.prisma # DB schema
    seed.ts       # Seed script
    migrations/   # DB migrations
  docker-compose.yml # Docker config for DB
```

---

## Setup Instructions

### Prerequisites
- Node.js (v16+ recommended)
- PostgreSQL database (or use Docker)

### Docker Setup (Database Only)

> **Warning:** Make sure port **5432** (PostgreSQL) is free before starting the Docker container. Stop any local PostgreSQL or other services using this port.

You can run the **database only** using Docker:

1. **Navigate to the server directory:**
   ```sh
   cd server
   ```
2. **Start the PostgreSQL container:**
   ```sh
   docker-compose up -d
   ```
   This will start the PostgreSQL database.

- The database will be available at `localhost:5432`  
  (user: `postgres`, password: `password`, database: `db_payment`).


### Backend Setup
1. **Install dependencies:**
   ```sh
   cd server
   npm install
   ```
2. **Configure environment:**
   - Copy `.env.example` to `.env` and set your `DATABASE_URL`.
3. **Prisma setup:**
   ```sh
   npx prisma migrate dev --name init
   npx prisma generate
   npx prisma db seed
   ```
4. **Start the server:**
   ```sh
   npm run start:dev
   ```

### Frontend Setup
1. **Install dependencies:**
   ```sh
   cd client
   npm install
   npx expo install
   ```
2. **Configure API base URL:**
   - In `src/services/api.ts`, set your backend IP address (for mobile, use your local network IP).
3. **Start the app:**
   ```sh
   npx expo start
   ```
   - Scan the QR code with Expo Go, or run on web/emulator.

---

## Sample Credentials
- **Admin:**  
  Username: `admin`  
  Password: `admin123`

- **Database:**  
  User: `postgres`  
  Password: `password`  
  Database: `db_payment`  
  Port: `5432`

---

## API Endpoints
- `POST /auth/login` — Login, returns JWT and user info
- `GET /payments` — List payments (filters, pagination)
- `POST /payments` — Add payment
- `GET /payments/stats` — Dashboard metrics
- `GET /payments/export` — Export CSV (filters supported)
- `GET /users` — List users (admin only)
- `POST /users` — Add user (admin only)

---

## Real-Time & Export
- **WebSocket:** Real-time updates for new payments (dashboard, list)
- **CSV Export:** Works on both web and mobile (with JWT)

---

## Postman Collection

You can find the Postman collection for API testing here: [Payment Dashboard App Postman Collection](https://documenter.getpostman.com/view/37136017/2sB34bL3sd)

---

## Screenshots / Demo

Below are screenshots of each main screen (see the `screenshots/` folder for full-size images):

- **Login Screen**
  
  <img src="screenshots/login-screen.jpg" alt="Login Screen" width="150" />

- **Dashboard Screen**
  
  <img src="screenshots/dashboard.jpg" alt="Dashboard Screen" width="150" />

- **Transaction List Screen**
  
  <img src="screenshots/transaction-list.jpg" alt="Transaction List Screen" width="150" />

- **Transaction Details Screen**
  
  <img src="screenshots/transaction-deatils.jpg" alt="Transaction Details Screen" width="150" />

- **Add Payment Screen**
  
  <img src="screenshots/add-payment.jpg" alt="Add Payment Screen" width="150" />

- **User Management Screen**
  
  <img src="screenshots/user-management.jpg" alt="User Management Screen" width="150" />

---

## License
MIT

---

## Notes
- For production, restrict CORS and secure JWT secrets.
- For mobile, ensure your backend is accessible via your local network IP.
- All icons/images should be placed in `client/assets/`. 