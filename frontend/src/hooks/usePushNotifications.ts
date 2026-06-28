import messaging from "@react-native-firebase/messaging";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { PermissionsAndroid, Platform } from "react-native";

import { registerDevice } from "../services/mutations/devices";
import { useUserStore } from "../stores/userStore";

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

  const permission = await messaging().requestPermission();
  const isAllowed =
    permission === messaging.AuthorizationStatus.AUTHORIZED ||
    permission === messaging.AuthorizationStatus.PROVISIONAL;

  if (!isAllowed) {
    return null;
  }

  return await messaging().getToken();
}

export function usePushNotifications() {
  const accessToken = useUserStore(state => state.accessToken);

  const registerDeviceMutation = useMutation({
    mutationFn: registerDevice,
  });

  useEffect(() => {
    let mounted = true;

    async function registerCurrentDevice() {
      if (!accessToken) {
        return;
      }

      try {
        const fcmToken = await getFcmToken();

        if (mounted && fcmToken) {
          registerDeviceMutation.mutate({
            fcmToken,
            platform: Platform.OS,
          });
        }
      } catch (error) {
        console.warn("Could not register push notifications", error);
      }
    }

    registerCurrentDevice();

    return () => {
      mounted = false;
    };
  }, [accessToken, registerDeviceMutation]);
}
