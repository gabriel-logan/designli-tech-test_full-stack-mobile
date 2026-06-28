import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Alerts from "../pages/Alerts";
import Home from "../pages/Home";
import Stocks from "../pages/Stocks";
import type { HomeTabParamList } from "../types/navigation";

const Tab = createBottomTabNavigator<HomeTabParamList>();

function HomeTabRoutes() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Dashboard"
        component={Home}
        options={{ title: "Home" }}
      />
      <Tab.Screen name="Stocks" component={Stocks} />
      <Tab.Screen name="Alerts" component={Alerts} />
    </Tab.Navigator>
  );
}

export default HomeTabRoutes;
