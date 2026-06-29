import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import Auth from "../pages/Auth";
import CreateAlert from "../pages/CreateAlert";
import StockDetails from "../pages/StockDetails";
import { useAuthStore } from "../stores/authStore";
import type { RootStackParamList } from "../types/navigation";
import HomeTabRoutes from "./HomeTabRoutes";

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStackRoutes() {
  const { t } = useTranslation();

  const accessToken = useAuthStore(state => state.accessToken);
  const hasHydrated = useAuthStore(state => state.hasHydrated);

  if (!hasHydrated) {
    return (
      <View accessibilityLiveRegion="polite" style={styles.loading}>
        <ActivityIndicator
          accessibilityLabel={t("common.loading")}
          accessibilityRole="progressbar"
          size="large"
        />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {accessToken ? (
        <>
          <Stack.Screen
            name="Home"
            component={HomeTabRoutes}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="StockDetails"
            component={StockDetails}
            options={({ route }) => ({ title: route.params.symbol })}
          />
          <Stack.Screen
            name="CreateAlert"
            component={CreateAlert}
            options={{ title: t("alerts.create") }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Auth"
          component={Auth}
          options={{ headerShown: false, title: t("auth.login") }}
        />
      )}
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  loading: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});

export default RootStackRoutes;
