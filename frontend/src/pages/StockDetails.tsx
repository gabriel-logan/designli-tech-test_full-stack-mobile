import { useTranslation } from "react-i18next";
import { Button, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../hooks/useAppTheme";
import type { AppTheme } from "../styles/theme";
import type { RootStackScreenProps } from "../types/navigation";

type Props = RootStackScreenProps<"StockDetails">;

function StockDetails({ navigation, route }: Props) {
  const { t } = useTranslation();

  const theme = useAppTheme();
  const styles = createStyles(theme);

  const { symbol } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{symbol}</Text>
      <Button
        title={t("alerts.create")}
        onPress={() => navigation.navigate("CreateAlert", { symbol })}
      />
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      padding: 24,
      backgroundColor: theme.colors.background,
    },
    title: {
      color: theme.colors.text,
      fontSize: 24,
      fontWeight: "700",
    },
  });

export default StockDetails;
