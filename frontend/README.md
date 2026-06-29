# Designli Stock Alerts Mobile

React Native app for the Designli stock alerts test. It includes authentication,
dashboard metrics, stock search, quote details with charts, alert creation and
management, theme switching, and Firebase Cloud Messaging device registration.

## Requirements

- Node.js 22.11 or newer
- Android Studio and an Android emulator/device
- Running backend API

## Backend Requirement

Start the backend before running the mobile app. The backend can be running
locally through `pnpm dev` after database setup, or through the optional Docker
Compose flow documented in [`../backend/README.md`](../backend/README.md).

## .env

Copy the example environment file and set the backend URL:

```bash
cp .env.example .env
```

```env
FRONTEND_BACKEND_URL=http://10.0.2.2:3000
```

The app reads this value through `react-native-dotenv` using the `@env` import
module. After changing `.env`, restart Metro with a clean cache:

```bash
npm start -- --reset-cache
```

## Run

```bash
npm install
npm start
npm run android
```

For iOS, install pods first when needed:

```bash
bundle install
bundle exec pod install
npm run ios
```

## Firebase Client Configuration

`android/app/google-services.json` is intentionally committed for this
coding-test repository so reviewers can build the Android app and validate the
Firebase Cloud Messaging client integration without requesting extra Firebase
client configuration files.

This file is Firebase Android client configuration. It identifies the Firebase
project used by the mobile app, but it is not the Firebase Admin SDK private key
used by the backend to send notifications. Server-side push delivery still
requires `FIREBASE_SERVICE_ACCOUNT_JSON` in [`../backend/.env`](../backend/.env), and that private
service-account JSON must not be committed.

For a production repository, the Firebase project should be restricted in the
Firebase/Google Cloud consoles and the client config can be regenerated or
managed through the team's normal secret/configuration process.

## Live Quotes

The app connects to the backend Socket.IO `/stocks` namespace and subscribes to
the tracked symbols. The backend sends an immediate quote payload on subscription
and then streams live quote updates. The alert list also refreshes periodically
so triggered alerts are reflected without manual reload.

## Validation

```bash
npm run lint:fix
npm run format
```
