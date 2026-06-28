import { useTranslation } from "react-i18next";
import { Button, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../hooks/useAppTheme";
import type { AppTheme } from "../styles/theme";
import type { HomeTabScreenProps } from "../types/navigation";

type Props = HomeTabScreenProps<"Dashboard">;

function Home({ navigation }: Props) {
  const { t } = useTranslation();

  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t("home.title")}</Text>
      <Button
        title={t("home.viewStocks")}
        onPress={() => navigation.navigate("Stocks")}
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

export default Home;
