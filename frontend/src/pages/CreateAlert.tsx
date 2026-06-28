import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../hooks/useAppTheme";
import type { AppTheme } from "../styles/theme";
import type { RootStackScreenProps } from "../types/navigation";

type Props = RootStackScreenProps<"CreateAlert">;

function CreateAlert({ route }: Props) {
  const { t } = useTranslation();

  const theme = useAppTheme();
  const styles = createStyles(theme);

  const { symbol } = route.params ?? {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("alerts.create")}</Text>
      <Text style={styles.symbol}>{symbol ?? t("stocks.selectStock")}</Text>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: 24,
      backgroundColor: theme.colors.background,
    },
    symbol: {
      color: theme.colors.mutedText,
      fontSize: 16,
    },
    title: {
      color: theme.colors.text,
      fontSize: 24,
      fontWeight: "700",
    },
  });

export default CreateAlert;
