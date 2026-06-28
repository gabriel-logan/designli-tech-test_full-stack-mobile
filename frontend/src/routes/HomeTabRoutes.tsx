import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";

import Alerts from "../pages/Alerts";
import Home from "../pages/Home";
import Stocks from "../pages/Stocks";
import type { HomeTabParamList } from "../types/navigation";

const Tab = createBottomTabNavigator<HomeTabParamList>();

function HomeTabRoutes() {
  const { t } = useTranslation();

  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Dashboard"
        component={Home}
        options={{ title: t("tabs.home") }}
      />
      <Tab.Screen
        name="Stocks"
        component={Stocks}
        options={{ title: t("tabs.stocks") }}
      />
      <Tab.Screen
        name="Alerts"
        component={Alerts}
        options={{ title: t("tabs.alerts") }}
      />
    </Tab.Navigator>
  );
}

export default HomeTabRoutes;
