import { StyleSheet, Text, TextInput, View } from "react-native";

import { useAppTheme } from "../../hooks/useAppTheme";
import type { AppTheme } from "../../styles/theme";

type AppTextInputProps = React.ComponentProps<typeof TextInput> & {
  error?: string;
  label: string;
};

function AppTextInput({ error, label, style, ...props }: AppTextInputProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        accessibilityHint={error ?? props.accessibilityHint}
        accessibilityLabel={props.accessibilityLabel ?? label}
        accessibilityState={{
          disabled: props.editable === false,
        }}
        autoCapitalize="none"
        placeholderTextColor={theme.colors.mutedText}
        selectionColor={theme.colors.primary}
        style={[styles.input, error ? styles.inputError : null, style]}
        {...props}
      />
      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      gap: 7,
    },
    error: {
      color: theme.colors.danger,
      fontSize: 13,
    },
    input: {
      backgroundColor: theme.colors.field,
      borderColor: theme.colors.border,
      borderRadius: 8,
      borderWidth: 1,
      color: theme.colors.text,
      fontSize: 16,
      minHeight: 48,
      paddingHorizontal: 14,
    },
    inputError: {
      borderColor: theme.colors.danger,
    },
    label: {
      color: theme.colors.text,
      fontSize: 14,
      fontWeight: "700",
    },
  });

export default AppTextInput;
