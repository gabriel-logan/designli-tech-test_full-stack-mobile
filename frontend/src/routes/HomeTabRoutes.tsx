import MaterialDesignIcon from "@react-native-vector-icons/material-design-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { ComponentProps } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "../hooks/useAppTheme";
import Alerts from "../pages/Alerts";
import Home from "../pages/Home";
import Settings from "../pages/Settings";
import Stocks from "../pages/Stocks";
import type { AppTheme } from "../styles/theme";
import type { HomeTabParamList } from "../types/navigation";

const Tab = createBottomTabNavigator<HomeTabParamList>();

interface TabIconProps {
  color: string;
  focused: boolean;
  icon: ComponentProps<typeof MaterialDesignIcon>["name"];
  size: number;
}

interface TabLabelProps {
  children: string;
  color: string;
  focused: boolean;
}

function TabIcon({ color, focused, icon, size }: TabIconProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={[styles.iconFrame, focused && styles.activeIconFrame]}>
      <MaterialDesignIcon color={color} name={icon} size={size} />
    </View>
  );
}

function TabLabel({ children, color, focused }: TabLabelProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Text
      adjustsFontSizeToFit
      minimumFontScale={0.8}
      numberOfLines={1}
      style={[styles.label, { color }, focused && styles.activeLabel]}
    >
      {children}
    </Text>
  );
}

function renderTabLabel(props: TabLabelProps) {
  return <TabLabel {...props} />;
}

function DashboardTabIcon({
  color,
  focused,
  size,
}: Omit<TabIconProps, "icon">) {
  return (
    <TabIcon
      color={color}
      focused={focused}
      icon="view-dashboard-outline"
      size={size}
    />
  );
}

function StocksTabIcon({ color, focused, size }: Omit<TabIconProps, "icon">) {
  return (
    <TabIcon color={color} focused={focused} icon="chart-line" size={size} />
  );
}

function AlertsTabIcon({ color, focused, size }: Omit<TabIconProps, "icon">) {
  return (
    <TabIcon color={color} focused={focused} icon="bell-outline" size={size} />
  );
}

function SettingsTabIcon({ color, focused, size }: Omit<TabIconProps, "icon">) {
  return (
    <TabIcon color={color} focused={focused} icon="cog-outline" size={size} />
  );
}

function HomeTabRoutes() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const bottomInset = Math.max(insets.bottom, 10);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShadowVisible: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mutedText,
        tabBarItemStyle: styles.item,
        tabBarLabel: renderTabLabel,
        tabBarLabelPosition: "below-icon",
        tabBarStyle: {
          ...styles.bar,
          backgroundColor: theme.colors.card,
          height: 70 + bottomInset,
          paddingBottom: bottomInset,
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

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    activeIconFrame: {
      backgroundColor: theme.colors.primarySoft,
      borderColor: theme.colors.primary,
    },
    activeLabel: {
      fontWeight: "800",
    },
    bar: {
      borderTopColor: "transparent",
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      elevation: 16,
      paddingHorizontal: 12,
      paddingTop: 10,
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        height: Platform.OS === "ios" ? -4 : 0,
        width: 0,
      },
      shadowOpacity: theme.dark ? 0.32 : 0.12,
      shadowRadius: 18,
    },
    iconFrame: {
      alignItems: "center",
      borderColor: "transparent",
      borderRadius: 18,
      borderWidth: 1,
      height: 34,
      justifyContent: "center",
      width: 48,
    },
    item: {
      borderRadius: 18,
      paddingVertical: 2,
    },
    label: {
      fontSize: 11,
      fontWeight: "700",
      lineHeight: 14,
      marginTop: 2,
      maxWidth: 76,
      textAlign: "center",
    },
  });

export default HomeTabRoutes;
