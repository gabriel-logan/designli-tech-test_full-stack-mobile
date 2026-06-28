import MaterialDesignIcon from "@react-native-vector-icons/material-design-icons";
import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../../hooks/useAppTheme";
import type { AppTheme } from "../../styles/theme";
import AppButton from "./AppButton";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
  title: string;
}

function ErrorState({ message, onRetry, retryLabel, title }: ErrorStateProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <MaterialDesignIcon
        color={theme.colors.danger}
        name="alert-circle-outline"
        size={28}
      />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry && retryLabel ? (
        <AppButton
          onPress={onRetry}
          size="small"
          title={retryLabel}
          variant="secondary"
        />
      ) : null}
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

export default ErrorState;
