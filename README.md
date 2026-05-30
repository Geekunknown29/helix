# Healix

Live site: https://healix-ud39.vercel.app/

Healix is a local health social platform for public users, doctors, and vendors. The UI remains the existing HTML/CSS experience, now served by a Node backend with persistent JSON storage for authentication and app state.

## Stack

- Frontend: HTML, CSS, and vanilla JavaScript modules
- Backend: Node.js HTTP server with REST-style API routes
- Database: JSON file persistence at `server/data/db.json`
- Storage model: browser `localStorage` remains as an offline fallback/cache, while backend state is used when the app runs through `localhost`

## Run Locally

```powershell
npm start
```

Open:

```text
http://localhost:3000
```

## Demo Accounts

```text
public@healthsocial.demo / Public@123
doctor role: doctor@healthsocial.demo / Doctor@123
vendor@healthsocial.demo / Vendor@123
```

## Backend APIs

- `GET /api/health` checks server health
- `POST /api/auth/login` validates role-based login
- `POST /api/auth/signup` creates a prototype user
- `GET /api/state` loads persisted app state
- `PUT /api/state/:key` persists app state such as services, ratings, profiles, feed stats, and history

## Persisted Product Data

The backend persists the core product data that used to live only in the browser:

- doctor/vendor services
- service history
- doctor/vendor ratings
- profile and bio data
- feed likes, dislikes, shares, saves, and doctor green flags

This keeps the current UI intact while giving the product a real local backend foundation that can later be moved to MongoDB, PostgreSQL, Firebase, or a hosted API.

