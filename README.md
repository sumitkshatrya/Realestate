# Realestate

A real-estate platform with a React client, an administration dashboard, and an Express API.

## Project structure

- `frontend/` - public-facing React application (Vite, port `5173`)
- `admin/` - administration dashboard (Vite, port `5174`)
- `backend/` - Express API and MongoDB integration (port `8080`)

## Requirements

- Node.js 18 or newer
- MongoDB

## Setup

Install dependencies in each application:

```bash
cd frontend
npm install

cd ../admin
npm install

cd ../backend
npm install
```

Create `backend/.env` with the values required by the API, including:

```env
MONGODB_URI=your-mongodb-connection-string
PORT=8080
FRONTEND_URI=http://localhost:5173
```

Keep secrets such as authentication, SMTP, and Twilio credentials out of source control.

## Run locally

Start each application in a separate terminal:

```bash
# Terminal 1
cd backend
npm run dev

# Terminal 2
cd frontend
npm run dev

# Terminal 3
cd admin
npm run dev
```

The public application is available at `http://localhost:5173`, the admin dashboard at `http://localhost:5174`, and the API at `http://localhost:8080`.

## Build and lint

Run these commands from `frontend/` or `admin/`:

```bash
npm run lint
npm run build
```
