# Designli Stock Alerts

Full-stack React Native + Node application for the Designli developer test. The
app lets users register/login, browse stock symbols, see live quote updates,
inspect stock charts, create price alerts, and receive Firebase Cloud Messaging
push notifications when an alert target is reached.

## Stack

- Backend: NestJS, PostgreSQL, Socket.IO, Finnhub API, Firebase Admin SDK.
- Mobile app: React Native, React Navigation, React Query, Socket.IO client,
  Firebase Messaging.
- Deployment support: Docker Compose for PostgreSQL and Atlas schema apply.

## Project Structure

```text
backend/   NestJS API, websocket gateway, alert processor, database schema
frontend/  React Native mobile application
backend/schema.sql PostgreSQL desired schema used by Atlas and Docker Compose
```

## Backend Setup

```bash
cd backend
cp .env.example .env
pnpm install
pnpm db:up
pnpm db:schema:apply
pnpm dev
```

Required backend values include:

- `FINNHUB_API_KEY`: API key used to load symbols, quotes, and candles.
- `JWT_SECRET`: secret used to sign auth tokens.
- `FIREBASE_SERVICE_ACCOUNT_JSON`: optional Firebase Admin service account JSON
  as a single-line string for push notifications.
- `STOCK_PRICE_POLL_INTERVAL_MS`: websocket and alert processing interval.
- `FINNHUB_QUOTE_REFRESH_INTERVAL_MS`: interval used to refresh the real
  Finnhub quote backing the live quote stream.

The backend API runs at `http://localhost:3000/api`, with Swagger docs at
`http://localhost:3000/api/docs`.

## Frontend Setup

Copy `frontend/.env.example` to `frontend/.env` and set
`FRONTEND_BACKEND_URL` to an address reachable from the emulator or device.
For the Android emulator, `http://10.0.2.2:3000` points to the host machine.

```bash
cd frontend
npm install
npm start
npm run android
```

## Firebase Client Configuration

`frontend/android/app/google-services.json` is intentionally committed for this
coding-test repository so reviewers can build the Android app and validate the
Firebase Cloud Messaging integration without requesting extra client
configuration files.

This file is Firebase Android client configuration. It identifies the Firebase
project used by the mobile app, but it is not the Firebase Admin SDK private key
used by the backend to send notifications. Server-side push delivery still
requires `FIREBASE_SERVICE_ACCOUNT_JSON` in `backend/.env`, and that private
service-account JSON must not be committed.

For a production repository, the Firebase project should be restricted in the
Firebase/Google Cloud consoles and the client config can be regenerated or
managed through the team's normal secret/configuration process.

## Live Quotes And Alerts

The backend uses Finnhub as the source of truth, then keeps an in-memory live
quote state per symbol. Finnhub quotes are refreshed on
`FINNHUB_QUOTE_REFRESH_INTERVAL_MS`, while the app receives smoother quote ticks
on `STOCK_PRICE_POLL_INTERVAL_MS`. This makes the demo usable even outside
market hours or when Finnhub returns unchanged prices.

Alerts use the same live quote stream. Active alerts are evaluated on the same
poll interval, deactivated atomically when triggered, and then sent through FCM
if the user has registered device tokens.

## Validation Commands

The project currently does not rely on tests for validation. Use the linters and
formatters:

```bash
cd backend
pnpm lint:fix
pnpm format

cd ../frontend
npm run lint:fix
npm run format
```
