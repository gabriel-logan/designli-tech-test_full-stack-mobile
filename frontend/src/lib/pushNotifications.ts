import notifee, {
  AndroidCategory,
  AndroidImportance,
  AndroidVisibility,
} from "@notifee/react-native";
import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  type RemoteMessage,
} from "@react-native-firebase/messaging";

export const stockAlertChannelId = "stock_alerts";

function getNotificationContent(message: RemoteMessage) {
  const symbol = message.data?.symbol;
  const title =
    message.notification?.title ??
    (symbol ? `${String(symbol)} price alert` : "Stock price alert");
  const body =
    message.notification?.body ??
    (symbol
      ? `${String(symbol)} reached your alert target.`
      : "A stock reached your alert target.");

  return { body, title };
}

export async function ensureStockAlertNotificationChannel() {
  await notifee.createChannel({
    id: stockAlertChannelId,
    name: "Stock price alerts",
    importance: AndroidImportance.HIGH,
    sound: "default",
    vibration: true,
  });
}

export async function displayStockAlertNotification(message: RemoteMessage) {
  const { body, title } = getNotificationContent(message);

  await ensureStockAlertNotificationChannel();

  await notifee.displayNotification({
    title,
    body,
    data: message.data,
    android: {
      channelId: stockAlertChannelId,
      category: AndroidCategory.ALARM,
      importance: AndroidImportance.HIGH,
      pressAction: {
        id: "default",
      },
      sound: "default",
      visibility: AndroidVisibility.PUBLIC,
    },
    ios: {
      sound: "default",
      foregroundPresentationOptions: {
        alert: true,
        badge: true,
        sound: true,
      },
    },
  });
}

export async function handleBackgroundStockAlert(message: RemoteMessage) {
  await ensureStockAlertNotificationChannel();

  if (!message.notification) {
    await displayStockAlertNotification(message);
  }
}

export function registerBackgroundPushHandler() {
  const messagingInstance = getMessaging(getApp());

  messagingInstance.setBackgroundMessageHandler(handleBackgroundStockAlert);
}
