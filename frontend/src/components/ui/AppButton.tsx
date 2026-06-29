import type { ReactNode } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type ViewStyle,
} from "react-native";

import { useAppTheme } from "../../hooks/useAppTheme";
import type { AppTheme } from "../../styles/theme";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "regular" | "small";

interface AppButtonProps {
  accessibilityHint?: string;
  accessibilityLabel?: string;
  title: string;
  onPress: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  loading?: boolean;
  size?: ButtonSize;
  style?: ViewStyle;
  variant?: ButtonVariant;
}

function AppButton({
  accessibilityHint,
  accessibilityLabel,
  title,
  onPress,
  disabled = false,
  icon,
  loading = false,
  size = "regular",
  style,
  variant = "primary",
}: AppButtonProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Pressable
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel ?? title}
      accessibilityRole="button"
      accessibilityState={{ busy: loading, disabled: disabled || loading }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        styles[size],
        pressed && styles.pressed,
        (disabled || loading) && styles.disabled,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          accessibilityElementsHidden
          color={getLoaderColor(theme, variant)}
          importantForAccessibility="no-hide-descendants"
        />
      ) : (
        icon
      )}
      <Text style={[styles.label, styles[`${variant}Label`]]}>{title}</Text>
    </Pressable>
  );
}

function getLoaderColor(theme: AppTheme, variant: ButtonVariant) {
  return variant === "primary" || variant === "danger"
    ? "#ffffff"
    : theme.colors.primary;
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    button: {
      alignItems: "center",
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      gap: 8,
      justifyContent: "center",
    },
    danger: {
      backgroundColor: theme.colors.danger,
      borderColor: theme.colors.danger,
    },
    dangerLabel: {
      color: "#ffffff",
    },
    disabled: {
      opacity: 0.55,
    },
    ghost: {
      backgroundColor: "transparent",
      borderColor: "transparent",
    },
    ghostLabel: {
      color: theme.colors.primary,
    },
    label: {
      fontSize: 15,
      fontWeight: "700",
    },
    pressed: {
      opacity: 0.78,
    },
    primary: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    primaryLabel: {
      color: "#ffffff",
    },
    regular: {
      minHeight: 48,
      paddingHorizontal: 18,
    },
    secondary: {
      backgroundColor: theme.colors.primarySoft,
      borderColor: theme.colors.primarySoft,
    },
    secondaryLabel: {
      color: theme.colors.primary,
    },
    small: {
      minHeight: 36,
      paddingHorizontal: 12,
    },
  });

export default AppButton;
