import MaterialDesignIcon from "@react-native-vector-icons/material-design-icons";
import type { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../../hooks/useAppTheme";
import type { AppTheme } from "../../styles/theme";

interface EmptyStateProps {
  icon?: ComponentProps<typeof MaterialDesignIcon>["name"];
  message: string;
  title: string;
}

function EmptyState({
  icon = "database-off-outline",
  message,
  title,
}: EmptyStateProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View accessibilityRole="summary" style={styles.container}>
      <MaterialDesignIcon
        accessibilityElementsHidden
        color={theme.colors.primary}
        importantForAccessibility="no-hide-descendants"
        name={icon}
        size={28}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: 8,
      borderWidth: 1,
      gap: 8,
      padding: 22,
    },
    message: {
      color: theme.colors.mutedText,
      fontSize: 14,
      lineHeight: 20,
      textAlign: "center",
    },
    title: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "800",
      textAlign: "center",
    },
  });

export default EmptyState;
