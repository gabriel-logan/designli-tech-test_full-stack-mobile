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

The `.env` file contains secrets and must stay local. It is ignored by Git.

Do not use `frontend/android/app/google-services.json` for the backend. That file
is Android client configuration. For push notifications from the backend, create
a Firebase Admin SDK private key in Firebase Console > Project settings >
Service accounts > Generate new private key.

Store the Firebase Admin SDK private key JSON in `FIREBASE_SERVICE_ACCOUNT_JSON`.
For local use, generate the single-line value from the downloaded JSON file:

```bash
node -e "console.log(JSON.stringify(require('/absolute/path/to/firebase-service-account.json')))"
```

Use the command output as the `.env` value. If `FIREBASE_SERVICE_ACCOUNT_JSON`
is empty, push notifications are disabled and the rest of the API still runs.

## Dependencies

Install the backend dependencies once before using the local API run option:

```bash
pnpm install
```

## Database

Use these commands to start PostgreSQL and apply the schema for the local API
run. These commands prepare the database only; they do not start the NestJS
development server.

Atlas is configured in schema-based mode: the desired state lives in
`schema.sql`, and no migration files are required.

```bash
pnpm db:up
pnpm db:schema:apply
```

Useful inspection command:

```bash
pnpm db:schema:inspect
```

## Local API Run

Use this command to start only the NestJS API in development mode after the
database setup above is complete.

```bash
pnpm dev
```

The API runs at `http://localhost:3000/api`. Swagger is available at
`http://localhost:3000/api/docs`.

## Docker Run

This is an optional path. Docker Compose starts PostgreSQL, applies `schema.sql`, and then
starts the NestJS API container.

Note: Do not run `pnpm db:up`,
`pnpm db:schema:apply`, or `pnpm dev` separately when using this option.

```bash
docker compose up --build
```

Inside Docker, the API uses the Compose service name `postgres` as the database
host. The `schema` service applies `schema.sql` before the API starts.

For Firebase push notifications in Docker, keep the same single-line JSON value
in `.env`:

```bash
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

Variables set in the .env file will override the variables defined in Docker Compose.

## Validation

```bash
pnpm lint:fix
pnpm format
```
