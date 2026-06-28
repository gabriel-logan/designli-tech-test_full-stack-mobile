import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../hooks/useAppTheme";
import type { AppTheme } from "../styles/theme";

function Auth() {
  const { t } = useTranslation();

  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("auth.login")}</Text>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      padding: 24,
      backgroundColor: theme.colors.background,
    },
    title: {
      color: theme.colors.text,
      fontSize: 24,
      fontWeight: "700",
    },
  });

export default Auth;
