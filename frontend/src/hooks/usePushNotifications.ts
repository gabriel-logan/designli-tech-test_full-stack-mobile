import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  onTokenRefresh,
  registerDeviceForRemoteMessages,
} from "@react-native-firebase/messaging";
import { useEffect, useRef } from "react";
import { PermissionsAndroid, Platform } from "react-native";

import {
  displayStockAlertNotification,
  ensureStockAlertNotificationChannel,
  playStockAlertAudio,
} from "../lib/pushNotifications";
import { registerDevice } from "../services/mutations/devices";
import { useAuthStore } from "../stores/authStore";

async function requestAndroidPermission() {
  if (Platform.OS !== "android" || Number(Platform.Version) < 33) {
    return true;
  }

  const result = await PermissionsAndroid.request(
    PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
  );

  return result === PermissionsAndroid.RESULTS.GRANTED;
}

async function getFcmToken() {
  await ensureStockAlertNotificationChannel();

  const androidAllowed = await requestAndroidPermission();

  if (!androidAllowed) {
    return null;
  }

  const messagingInstance = getMessaging(getApp());

  if (Platform.OS === "ios") {
    await registerDeviceForRemoteMessages(messagingInstance);
  }

  return await getToken(messagingInstance);
}

export function usePushNotifications() {
  const accessToken = useAuthStore(state => state.accessToken);
  const registeredSessionRef = useRef<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const messagingInstance = getMessaging(getApp());

    const unsubscribeForegroundMessages = onMessage(
      messagingInstance,
      async message => {
        playStockAlertAudio();
        await displayStockAlertNotification(message);
      },
    );

    async function registerCurrentDevice(fcmToken?: string) {
      if (!accessToken) {
        return;
      }

      try {
        const currentToken = fcmToken ?? (await getFcmToken());
        const registrationKey = `${accessToken}:${currentToken}`;

        if (
          !mounted ||
          !currentToken ||
          registeredSessionRef.current === registrationKey
        ) {
          return;
        }

        await registerDevice({
          fcmToken: currentToken,
          platform: Platform.OS,
        });

        registeredSessionRef.current = registrationKey;
      } catch (error) {
        console.warn("Could not register push notifications", error);
      }
    }

    const unsubscribeTokenRefresh = onTokenRefresh(
      messagingInstance,
      refreshedToken => {
        registerCurrentDevice(refreshedToken);
      },
    );

    registerCurrentDevice();

    return () => {
      mounted = false;
      unsubscribeForegroundMessages();
      unsubscribeTokenRefresh();
    };
  }, [accessToken]);
}
