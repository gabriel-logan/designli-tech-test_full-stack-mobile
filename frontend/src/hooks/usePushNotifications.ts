import { getApp } from "@react-native-firebase/app";
import {
  getMessaging,
  getToken,
  registerDeviceForRemoteMessages,
} from "@react-native-firebase/messaging";
import { useEffect, useRef } from "react";
import { PermissionsAndroid, Platform } from "react-native";

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

    async function registerCurrentDevice() {
      if (!accessToken) {
        return;
      }

      try {
        const fcmToken = await getFcmToken();
        const registrationKey = `${accessToken}:${fcmToken}`;

        if (
          !mounted ||
          !fcmToken ||
          registeredSessionRef.current === registrationKey
        ) {
          return;
        }

        await registerDevice({
          fcmToken,
          platform: Platform.OS,
        });

        registeredSessionRef.current = registrationKey;
      } catch (error) {
        console.warn("Could not register push notifications", error);
      }
    }

    registerCurrentDevice();

    return () => {
      mounted = false;
    };
  }, [accessToken]);
}
