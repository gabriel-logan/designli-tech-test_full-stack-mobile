import MaterialDesignIcon from "@react-native-vector-icons/material-design-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import { useAppTheme } from "../hooks/useAppTheme";
import Alerts from "../pages/Alerts";
import Home from "../pages/Home";
import Settings from "../pages/Settings";
import Stocks from "../pages/Stocks";
import type { HomeTabParamList } from "../types/navigation";

const Tab = createBottomTabNavigator<HomeTabParamList>();

interface TabIconProps {
  color: string;
  focused: boolean;
  size: number;
}

function TabIconContainer({
  children,
  focused,
}: {
  children: ReactNode;
  focused: boolean;
}) {
  const theme = useAppTheme();

  return (
    <View
      style={[
        styles.iconPill,
        focused && { backgroundColor: theme.colors.primarySoft },
      ]}
    >
      {children}
    </View>
  );
}

function DashboardTabIcon({ color, focused, size }: TabIconProps) {
  return (
    <TabIconContainer focused={focused}>
      <MaterialDesignIcon
        color={color}
        name={focused ? "view-dashboard" : "view-dashboard-outline"}
        size={size}
      />
    </TabIconContainer>
  );
}

function StocksTabIcon({ color, focused, size }: TabIconProps) {
  return (
    <TabIconContainer focused={focused}>
      <MaterialDesignIcon color={color} name="chart-line" size={size} />
    </TabIconContainer>
  );
}

function AlertsTabIcon({ color, focused, size }: TabIconProps) {
  return (
    <TabIconContainer focused={focused}>
      <MaterialDesignIcon
        color={color}
        name={focused ? "bell" : "bell-outline"}
        size={size}
      />
    </TabIconContainer>
  );
}

function SettingsTabIcon({ color, focused, size }: TabIconProps) {
  return (
    <TabIconContainer focused={focused}>
      <MaterialDesignIcon
        color={color}
        name={focused ? "cog" : "cog-outline"}
        size={size}
      />
    </TabIconContainer>
  );
}

function HomeTabRoutes() {
  const { t } = useTranslation();
  const theme = useAppTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShadowVisible: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarHideOnKeyboard: true,
        tabBarInactiveTintColor: theme.colors.mutedText,
        tabBarItemStyle: {
          alignItems: "center",
          justifyContent: "center",
          marginHorizontal: 4,
          paddingVertical: 6,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "800",
          lineHeight: 14,
          marginTop: 2,
        },
        tabBarStyle: {
          backgroundColor: theme.colors.card,
          borderTopColor: "transparent",
          elevation: 12,
          height: 70,
          paddingHorizontal: 8,
          paddingTop: 6,
          shadowColor: theme.colors.shadow,
          shadowOffset: { height: -2, width: 0 },
          shadowOpacity: theme.dark ? 0.35 : 0.1,
          shadowRadius: 12,
        },
        tabBarIconStyle: {
          alignItems: "center",
          justifyContent: "center",
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
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{
          tabBarIcon: SettingsTabIcon,
          title: t("tabs.settings"),
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  iconPill: {
    alignItems: "center",
    borderRadius: 999,
    height: 30,
    justifyContent: "center",
    width: 48,
  },
});

export default HomeTabRoutes;
