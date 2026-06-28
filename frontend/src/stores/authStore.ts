import * as Keychain from "react-native-keychain";
import { create } from "zustand";

import type { AuthResponse, AuthUser } from "../types/api";

const authTokenService = "designli-stock-alerts.auth-token";

interface AuthStore {
  accessToken: string | null;
  authUser: AuthUser | null;
  hasHydrated: boolean;

  hydrate: () => Promise<void>;
  logout: () => Promise<void>;
  setAuth: (auth: AuthResponse) => Promise<void>;
}

function parseStoredUser(value: string): AuthUser | null {
  try {
    return JSON.parse(value) as AuthUser;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthStore>()(set => ({
  accessToken: null,
  authUser: null,
  hasHydrated: false,

  hydrate: async () => {
    try {
      const credentials = await Keychain.getGenericPassword({
        service: authTokenService,
      });

      if (!credentials) {
        set({
          accessToken: null,
          authUser: null,
          hasHydrated: true,
        });

        return;
      }

      set({
        accessToken: credentials.password,
        authUser: parseStoredUser(credentials.username),
        hasHydrated: true,
      });
    } catch (error) {
      console.warn("Could not hydrate auth session", error);

      set({
        accessToken: null,
        authUser: null,
        hasHydrated: true,
      });
    }
  },

  logout: async () => {
    await Keychain.resetGenericPassword({
      service: authTokenService,
    });

    set({
      accessToken: null,
      authUser: null,
    });
  },

  setAuth: async auth => {
    await Keychain.setGenericPassword(
      JSON.stringify(auth.user),
      auth.accessToken,
      {
        accessible: Keychain.ACCESSIBLE.AFTER_FIRST_UNLOCK_THIS_DEVICE_ONLY,
        securityLevel: Keychain.SECURITY_LEVEL.SECURE_SOFTWARE,
        service: authTokenService,
      },
    );

    set({
      accessToken: auth.accessToken,
      authUser: auth.user,
    });
  },
}));
