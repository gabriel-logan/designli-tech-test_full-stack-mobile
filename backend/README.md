# Designli Stock Alerts Backend

Backend NestJS for the React Native + Node developer test. It supports user
authentication, stock search/quotes/charts through Finnhub, stock price alerts,
Firebase Cloud Messaging device registration, and real-time quote updates over
Socket.IO.

## Requirements

- Node.js with `pnpm`
- Docker
- Atlas CLI
- Finnhub API key
- Firebase Admin service account JSON if push notifications should be sent

## Environment

Copy `.env.example` to `.env` and fill the external credentials:

```bash
cp .env.example .env
```

Required values:

- `JWT_SECRET`: secret used to sign API tokens.
- `FINNHUB_API_KEY`: Finnhub API token.
- `STOCK_PRICE_POLL_INTERVAL_MS`: websocket quote push and alert processing interval. Defaults to `5000`.
- `FINNHUB_QUOTE_REFRESH_INTERVAL_MS`: Finnhub quote refresh interval used as the live quote anchor. Defaults to `60000`.
- `FIREBASE_SERVICE_ACCOUNT_PATH`: optional path to the Firebase Admin service account JSON file.

Do not use `frontend/android/app/google-services.json` for the backend. That file
is Android client configuration. For push notifications from the backend, create
a Firebase Admin SDK private key in Firebase Console > Project settings >
Service accounts > Generate new private key, then set:

```bash
FIREBASE_SERVICE_ACCOUNT_PATH=/absolute/path/to/firebase-service-account.json
```

## Docker

The backend can run fully in Docker with PostgreSQL, schema application, and the
NestJS API container.

```bash
cp .env.example .env
# fill FINNHUB_API_KEY and JWT_SECRET
docker compose up --build
```

The API runs at `http://localhost:3000/api`. Swagger is available at
`http://localhost:3000/api/docs`.

Inside Docker, the API uses the Compose service name `postgres` as the database
host. The `schema` service applies `schema.sql` before the API starts.

For Firebase push notifications in Docker, mount your Admin SDK JSON and set
`DOCKER_FIREBASE_SERVICE_ACCOUNT_PATH` to the container path you mounted. If it
is not set, push notifications are disabled and the rest of the API still runs.

## Database

The database is PostgreSQL in Docker. Atlas is configured in schema-based mode:
the desired state lives in `schema.sql`, and no migration files are required.

```bash
pnpm db:up
pnpm db:schema:apply
```

Useful inspection command:

```bash
pnpm db:schema:inspect
```

## Run

```bash
pnpm dev
```

The API runs at `http://localhost:3000/api`. Swagger is available at
`http://localhost:3000/api/docs`.

## Main Endpoints

- `POST /api/auth/register`: create a user and return a bearer token.
- `POST /api/auth/login`: authenticate and return a bearer token.
- `GET /api/stocks`: list stocks by exchange or search query.
- `GET /api/stocks/summary`: quotes and candles for default symbols.
- `GET /api/stocks/chart?symbols=AAPL,MSFT`: quotes and candles for symbols.
- `GET /api/stocks/:symbol/quote`: current live quote backed by Finnhub.
- `GET /api/stocks/:symbol/candles`: candle series for charting.
- `GET /api/alerts`: list authenticated user's alerts.
- `POST /api/alerts`: create an alert with `{ "symbol": "AAPL", "targetPrice": 220 }`.
- `PATCH /api/alerts/:id`: update target price or active flag.
- `DELETE /api/alerts/:id`: remove an alert.
- `GET /api/devices`: list registered FCM devices.
- `POST /api/devices`: register/update an FCM token.
- `DELETE /api/devices`: remove an FCM token.

All endpoints except `auth` require `Authorization: Bearer <token>`.

## Real-time Quotes

Socket.IO namespace: `/stocks`.

The gateway sends an initial `quotes` event immediately after subscription and
then publishes updates every `STOCK_PRICE_POLL_INTERVAL_MS`. Finnhub remains the
source quote provider, but the backend keeps a bounded in-memory live quote state
between Finnhub refreshes so prices continue moving during demos and alert
testing.

Client event:

```json
{
  "event": "subscribe",
  "data": { "symbols": ["AAPL", "MSFT"] }
}
```

Server event:

```json
{
  "event": "quotes",
  "data": [
    {
      "symbol": "AAPL",
      "current": 220.1,
      "change": 1.2,
      "percentChange": 0.55
    }
  ]
}
```

## Validation

```bash
pnpm lint:fix
pnpm format
```
