import { Picker } from "@react-native-picker/picker";
import MaterialDesignIcon from "@react-native-vector-icons/material-design-icons";
import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { StyleSheet, Switch, Text, View } from "react-native";

import AppButton from "../components/ui/AppButton";
import Screen from "../components/ui/Screen";
import SectionHeader from "../components/ui/SectionHeader";
import SegmentedControl from "../components/ui/SegmentedControl";
import { resources } from "../constants";
import { useAppTheme } from "../hooks/useAppTheme";
import { useAuthStore } from "../stores/authStore";
import { useUserStore } from "../stores/userStore";
import type { AppTheme } from "../styles/theme";
import type { Locale } from "../types/locale";
import { formatUserDisplayName } from "../utils/formatters";

const availableLocales = Object.keys(resources) as Locale[];

function Settings() {
  const { t } = useTranslation();

  const theme = useAppTheme();
  const styles = createStyles(theme);

  const queryClient = useQueryClient();

  const authUser = useAuthStore(state => state.authUser);
  const logout = useAuthStore(state => state.logout);
  const locale = useUserStore(state => state.locale);
  const setLocale = useUserStore(state => state.setLocale);
  const stockAlertSoundEnabled = useUserStore(
    state => state.stockAlertSoundEnabled,
  );
  const setStockAlertSoundEnabled = useUserStore(
    state => state.setStockAlertSoundEnabled,
  );
  const themeMode = useUserStore(state => state.themeMode);
  const setThemeMode = useUserStore(state => state.setThemeMode);
  const userName = formatUserDisplayName(authUser) || t("home.defaultUserName");

  async function signOut() {
    await logout();
    queryClient.clear();
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>{t("settings.title")}</Text>
        <Text style={styles.subtitle}>{t("settings.subtitle")}</Text>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <MaterialDesignIcon
            color={theme.colors.primary}
            name="account-outline"
            size={26}
          />
        </View>
        <View style={styles.profileCopy}>
          <Text style={styles.profileName}>{userName}</Text>
          <Text style={styles.profileEmail}>{authUser?.email}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          subtitle={t("settings.themeSubtitle")}
          title={t("settings.theme")}
        />
        <SegmentedControl
          onChange={setThemeMode}
          segments={[
            { label: t("settings.systemTheme"), value: "system" },
            { label: t("settings.lightTheme"), value: "light" },
            { label: t("settings.darkTheme"), value: "dark" },
          ]}
          value={themeMode}
        />
      </View>

      <View style={styles.section}>
        <SectionHeader
          subtitle={t("settings.languageSubtitle")}
          title={t("settings.language")}
        />
        <View style={styles.pickerContainer}>
          <Picker
            dropdownIconColor={theme.colors.text}
            onValueChange={value => setLocale(value as Locale)}
            selectedValue={locale}
            style={styles.picker}
          >
            {availableLocales.map(availableLocale => (
              <Picker.Item
                key={availableLocale}
                label={t(`settings.locales.${availableLocale}`)}
                value={availableLocale}
              />
            ))}
          </Picker>
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          subtitle={t("settings.notificationsSubtitle")}
          title={t("settings.notifications")}
        />
        <View style={styles.settingRow}>
          <View style={styles.settingCopy}>
            <Text style={styles.settingTitle}>
              {t("settings.stockAlertSound")}
            </Text>
            <Text style={styles.settingDescription}>
              {t("settings.stockAlertSoundDescription")}
            </Text>
          </View>
          <Switch
            onValueChange={setStockAlertSoundEnabled}
            thumbColor={
              stockAlertSoundEnabled ? theme.colors.primary : "#f4f4f5"
            }
            trackColor={{
              false: theme.colors.border,
              true: theme.colors.primarySoft,
            }}
            value={stockAlertSoundEnabled}
          />
        </View>
      </View>

      <View style={styles.section}>
        <SectionHeader
          subtitle={t("settings.accountSubtitle")}
          title={t("settings.account")}
        />
        <AppButton
          icon={<MaterialDesignIcon color="#ffffff" name="logout" size={18} />}
          onPress={signOut}
          title={t("auth.logout")}
          variant="danger"
        />
      </View>
    </Screen>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    avatar: {
      alignItems: "center",
      backgroundColor: theme.colors.primarySoft,
      borderRadius: 8,
      height: 48,
      justifyContent: "center",
      width: 48,
    },
    header: {
      gap: 6,
      paddingTop: 10,
    },
    picker: {
      color: theme.colors.text,
    },
    pickerContainer: {
      backgroundColor: theme.colors.field,
      borderColor: theme.colors.border,
      borderRadius: 8,
      borderWidth: 1,
      justifyContent: "center",
      minHeight: 48,
      overflow: "hidden",
    },
    profileCard: {
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      gap: 12,
      padding: 16,
    },
    profileCopy: {
      flex: 1,
      gap: 3,
    },
    profileEmail: {
      color: theme.colors.mutedText,
      fontSize: 14,
    },
    profileName: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "900",
    },
    section: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: 8,
      borderWidth: 1,
      gap: 14,
      padding: 16,
    },
    settingCopy: {
      flex: 1,
      gap: 3,
    },
    settingDescription: {
      color: theme.colors.mutedText,
      fontSize: 13,
      lineHeight: 18,
    },
    settingRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: 14,
      justifyContent: "space-between",
    },
    settingTitle: {
      color: theme.colors.text,
      fontSize: 15,
      fontWeight: "800",
    },
    subtitle: {
      color: theme.colors.mutedText,
      fontSize: 15,
      lineHeight: 22,
    },
    title: {
      color: theme.colors.text,
      fontSize: 30,
      fontWeight: "900",
      lineHeight: 36,
    },
  });

export default Settings;
