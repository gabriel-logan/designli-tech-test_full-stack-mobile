import "./src/utils/i18n";

import { AppRegistry } from "react-native";

import App from "./App";
import { name as appName } from "./app.json";
import { registerBackgroundPushHandler } from "./src/lib/pushNotifications";

registerBackgroundPushHandler();
AppRegistry.registerComponent(appName, () => App);
