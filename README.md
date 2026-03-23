# Happora

Happora is an Event Booking Platform built with a React + TypeScript frontend and a Node.js + Express + TypeScript backend.

It supports:
- JWT authentication
- user and admin roles
- service management
- date-based slot availability
- bookings for users
- booking visibility for admins on their own services

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- Axios
- React Router

### Backend
- Node.js
- Express
- TypeScript
- MongoDB
- Mongoose
- Inversify
- JWT

## Project Structure

```text
Happora/
├── backend/
└── frontend/
```

## Features

### Authentication
- Register
- Login
- JWT-based route protection

### User Features
- View all services
- View service details
- Check date-based availability before booking
- Book a service
- View personal bookings

### Admin Features
- Create, edit, and delete services
- View all bookings related to services created by that admin

## Date-Based Booking Logic

Slots are managed per day, not globally.

When a user selects a date range:
- the backend finds overlapping bookings for that service
- availability is checked day by day
- booking is rejected if any day in the selected range has reached `totalSlots`

This prevents overbooking while still allowing bookings on other dates.

## Backend API

Base URL:

```text
http://localhost:5000/api
```

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Services
- `GET /api/services`
- `GET /api/services/:id`
- `POST /api/services`
- `PUT /api/services/:id`
- `DELETE /api/services/:id`

### Bookings
- `GET /api/bookings/availability`
- `POST /api/bookings`
- `GET /api/bookings/my-bookings`
- `GET /api/bookings/admin`

## Frontend Routes

### Protected User Routes
- `/`
- `/services/:id`
- `/booking/:id`
- `/my-bookings`

### Protected Admin Routes
- `/admin/services`
- `/admin/services/add`
- `/admin/services/edit/:id`
- `/admin/bookings`

### Public Route
- `/login`

## Setup

### 1. Clone the repository

```bash
git clone <your-repository-url>
cd Happora
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in `backend/` using this template:

```env
PORT=5000
DEV_CLIENT_URL=http://localhost:5173
MONGODB_URI=mongodb://localhost:27017/happora
NODE_ENV=development
JWT_SECRET=replace-with-a-strong-secret
JWT_EXPIRES_IN=7d
```

Start the backend:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd frontend
npm install
```

Optional `.env` for frontend:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

## Sample Admin Bookings Response

```json
{
  "message": "Admin bookings fetched successfully.",
  "bookings": [
    {
      "bookingId": "67df0b7a2b5a6d0012345678",
      "serviceTitle": "Wedding Photography",
      "serviceCategory": "photography",
      "user": {
        "id": "67df0b7a2b5a6d0099999999",
        "name": "Ava Johnson",
        "email": "ava@example.com"
      },
      "startDate": "2026-04-10T00:00:00.000Z",
      "endDate": "2026-04-12T00:00:00.000Z",
      "totalPrice": 30000,
      "status": "CONFIRMED"
    }
  ]
}
```

## Development Notes

- Admin routes are protected on both frontend and backend.
- User routes require authentication.
- Availability is checked from the booking page after selecting dates.
- `GET /api/bookings/admin` only returns bookings for services created by the logged-in admin.

## Verification

Useful checks:

```bash
cd backend
npx tsc --noEmit
```

```bash
cd frontend
npx tsc -b
```

## Current Limitation

In this environment, `npm run build` for the frontend may fail because Vite/Tailwind native dependencies can hit a local Windows sandbox issue. Development mode and TypeScript verification still work.
