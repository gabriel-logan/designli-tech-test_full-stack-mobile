# Designli Stock Alerts

Full-stack React Native + Node application for the Designli developer test. The
app lets users register/login, browse stock symbols, see live quote updates,
inspect stock charts, create price alerts, and receive Firebase Cloud Messaging
push notifications when an alert target is reached.

## Stack

- Backend: NestJS, PostgreSQL, Socket.IO, Finnhub API, Firebase Admin SDK.
- Mobile app: React Native, React Navigation, React Query, Socket.IO client,
  Firebase Messaging.
- Deployment support: Docker Compose for PostgreSQL and backend API.

## Project Structure

```text
backend/   NestJS API, websocket gateway, alert processor, database schema
frontend/  React Native mobile application
```

## Documentation

Use the local READMEs for complete setup and run instructions:

- [Backend README](backend/README.md): environment variables, database setup,
  local API run with `pnpm dev`, optional Docker run, endpoints, and real-time
  quote behavior.
- [Frontend README](frontend/README.md): backend URL setup, mobile app run
  commands, Firebase client configuration, and mobile real-time quote behavior.

The PostgreSQL desired schema used by Atlas and Docker Compose is located at
[backend/schema.sql](backend/schema.sql).
