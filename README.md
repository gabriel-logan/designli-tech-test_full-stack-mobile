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
schema.sql PostgreSQL desired schema used by Atlas
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

Update `frontend/src/constants.ts` so `localBackendUrl` points to the machine
running the backend from the emulator/device network.

```bash
cd frontend
npm install
npm start
npm run android
```

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
