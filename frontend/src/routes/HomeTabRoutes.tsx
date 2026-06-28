import MaterialDesignIcon from "@react-native-vector-icons/material-design-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";

import { useAppTheme } from "../hooks/useAppTheme";
import Alerts from "../pages/Alerts";
import Home from "../pages/Home";
import Stocks from "../pages/Stocks";
import type { HomeTabParamList } from "../types/navigation";

const Tab = createBottomTabNavigator<HomeTabParamList>();

interface TabIconProps {
  color: string;
  size: number;
}

function DashboardTabIcon({ color, size }: TabIconProps) {
  return (
    <MaterialDesignIcon
      color={color}
      name="view-dashboard-outline"
      size={size}
    />
  );
}

function StocksTabIcon({ color, size }: TabIconProps) {
  return <MaterialDesignIcon color={color} name="chart-line" size={size} />;
}

function AlertsTabIcon({ color, size }: TabIconProps) {
  return <MaterialDesignIcon color={color} name="bell-outline" size={size} />;
}

function HomeTabRoutes() {
  const { t } = useTranslation();
  const theme = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShadowVisible: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mutedText,
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: theme.colors.border,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={Home}
        options={{
          tabBarIcon: DashboardTabIcon,
          title: t("tabs.home"),
        }}
      />
      <Tab.Screen
        name="Stocks"
        component={Stocks}
        options={{
          tabBarIcon: StocksTabIcon,
          title: t("tabs.stocks"),
        }}
      />
      <Tab.Screen
        name="Alerts"
        component={Alerts}
        options={{
          tabBarIcon: AlertsTabIcon,
          title: t("tabs.alerts"),
        }}
      />
    </Tab.Navigator>
  );
}

export default HomeTabRoutes;
