# Designli Stock Alerts Mobile

React Native app for the Designli stock alerts test. It includes authentication,
dashboard metrics, stock search, quote details with charts, alert creation and
management, theme switching, and Firebase Cloud Messaging device registration.

## Requirements

- Node.js 22.11 or newer
- Android Studio and an Android emulator/device, or a configured iOS environment
- Running backend API

## Backend URL

Copy the example environment file and set the backend URL:

```bash
cp .env.example .env
```

```env
FRONTEND_BACKEND_URL=http://10.0.2.2:3000
```

Use an address reachable from the emulator/device. For Android emulator,
`http://10.0.2.2:3000` points to the host machine. For a physical device, use the
host machine LAN IP, for example `http://192.168.100.3:3000`.

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
