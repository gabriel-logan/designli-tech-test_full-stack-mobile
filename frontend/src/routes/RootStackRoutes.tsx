import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Auth from "../pages/Auth";
import CreateAlert from "../pages/CreateAlert";
import NotFound from "../pages/NotFound";
import StockDetails from "../pages/StockDetails";
import type { RootStackParamList } from "../types/navigation";
import HomeTabRoutes from "./HomeTabRoutes";

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootStackRoutes() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeTabRoutes}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="Auth" component={Auth} options={{ title: "Login" }} />
      <Stack.Screen
        name="StockDetails"
        component={StockDetails}
        options={({ route }) => ({ title: route.params.symbol })}
      />
      <Stack.Screen
        name="CreateAlert"
        component={CreateAlert}
        options={{ title: "Create alert" }}
      />
      <Stack.Screen
        name="NotFound"
        component={NotFound}
        options={{ title: "Not found" }}
      />
    </Stack.Navigator>
  );
}

export default RootStackRoutes;
