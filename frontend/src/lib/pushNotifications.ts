import notifee, {
  AndroidCategory,
  AndroidImportance,
  AndroidVisibility,
} from "@notifee/react-native";
import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  type RemoteMessage,
  setBackgroundMessageHandler,
} from "@react-native-firebase/messaging";
import Sound from "react-native-sound";

export const stockAlertChannelId = "stock_alerts";
const stockAlertAudioFile = "notify.mp3";

let notificationSound: Sound | null = null;
let notificationSoundLoadFailed = false;

Sound.setCategory("Playback");

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

export function playStockAlertAudio() {
  if (notificationSoundLoadFailed) {
    return;
  }

  if (!notificationSound) {
    notificationSound = new Sound(
      stockAlertAudioFile,
      Sound.MAIN_BUNDLE,
      error => {
        if (error) {
          notificationSoundLoadFailed = true;
          console.warn("Could not load stock alert audio", error);

          return;
        }

        playStockAlertAudio();
      },
    );

    return;
  }

  if (!notificationSound.isLoaded()) {
    return;
  }

  notificationSound.stop(() => {
    notificationSound?.play(success => {
      if (!success) {
        console.warn("Could not play stock alert audio");
      }
    });
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

  setBackgroundMessageHandler(messagingInstance, handleBackgroundStockAlert);
}
