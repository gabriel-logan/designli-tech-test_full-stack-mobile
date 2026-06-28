import { NavigationContainer } from "@react-navigation/native";
import { useEffect } from "react";

import { useAppTheme } from "../hooks/useAppTheme";
import { usePushNotifications } from "../hooks/usePushNotifications";
import { useAuthStore } from "../stores/authStore";
import { getNavigationTheme } from "../styles/theme";
import RootStackRoutes from "./RootStackRoutes";

function Routes() {
  const theme = useAppTheme();

  const hydrate = useAuthStore(state => state.hydrate);

  usePushNotifications();

  useEffect(() => {
    async function hydrateAuth() {
      await hydrate();
    }

    hydrateAuth().catch(error => {
      console.warn("Could not start auth hydration", error);
    });
  }, [hydrate]);

  return (
    <NavigationContainer theme={getNavigationTheme(theme)}>
      <RootStackRoutes />
    </NavigationContainer>
  );
}

export default Routes;
