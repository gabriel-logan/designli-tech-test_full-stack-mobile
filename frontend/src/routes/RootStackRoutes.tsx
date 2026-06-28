import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, View } from "react-native";

import Auth from "../pages/Auth";
import CreateAlert from "../pages/CreateAlert";
import NotFound from "../pages/NotFound";
import StockDetails from "../pages/StockDetails";
import { useUserStore } from "../stores/userStore";
import type { RootStackParamList } from "../types/navigation";
import HomeTabRoutes from "./HomeTabRoutes";

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStackRoutes() {
  const { t } = useTranslation();
  const accessToken = useUserStore(state => state.accessToken);
  const hasHydrated = useUserStore(state => state.hasHydrated);

  if (!hasHydrated) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator />
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
          <Stack.Screen
            name="NotFound"
            component={NotFound}
            options={{ title: t("notFound.headerTitle") }}
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
