import MaterialDesignIcon from "@react-native-vector-icons/material-design-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import AppButton from "../components/ui/AppButton";
import Screen from "../components/ui/Screen";
import { useAppTheme } from "../hooks/useAppTheme";
import type { AppTheme } from "../styles/theme";
import type { RootStackScreenProps } from "../types/navigation";

type Props = RootStackScreenProps<"NotFound">;

function NotFound({ navigation }: Props) {
  const { t } = useTranslation();

  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Screen scroll={false}>
      <View style={styles.container}>
        <View style={styles.iconBox}>
          <MaterialDesignIcon
            color={theme.colors.primary}
            name="map-marker-question-outline"
            size={34}
          />
        </View>
        <Text style={styles.title}>{t("notFound.title")}</Text>
        <Text style={styles.message}>{t("notFound.message")}</Text>
        <AppButton
          icon={
            <MaterialDesignIcon color="#ffffff" name="home-outline" size={18} />
          }
          onPress={() => navigation.navigate("Home", { screen: "Dashboard" })}
          title={t("notFound.goHome")}
        />
      </View>
    </Screen>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      flex: 1,
      gap: 14,
      justifyContent: "center",
    },
    iconBox: {
      alignItems: "center",
      backgroundColor: theme.colors.primarySoft,
      borderRadius: 8,
      height: 64,
      justifyContent: "center",
      width: 64,
    },
    message: {
      color: theme.colors.mutedText,
      fontSize: 15,
      lineHeight: 22,
      textAlign: "center",
    },
    title: {
      color: theme.colors.text,
      fontSize: 26,
      fontWeight: "900",
      textAlign: "center",
    },
  });

export default NotFound;
