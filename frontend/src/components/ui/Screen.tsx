import type { ReactNode } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { useAppTheme } from "../../hooks/useAppTheme";
import type { AppTheme } from "../../styles/theme";

interface ScreenProps {
  children: ReactNode;
  scroll?: boolean;
}

function Screen({ children, scroll = true }: ScreenProps) {
  const insets = useSafeAreaInsets();
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const contentStyle = [
    styles.content,
    {
      paddingBottom: Math.max(insets.bottom, 18) + 18,
      paddingTop: 18,
    },
  ];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      {scroll ? (
        <ScrollView
          contentContainerStyle={contentStyle}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={contentStyle}>{children}</View>
      )}
    </KeyboardAvoidingView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
    content: {
      gap: 18,
      paddingHorizontal: 18,
    },
  });

export default Screen;
