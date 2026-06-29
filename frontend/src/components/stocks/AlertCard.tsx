import MaterialDesignIcon from "@react-native-vector-icons/material-design-icons";
import { useTranslation } from "react-i18next";
import { StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../../hooks/useAppTheme";
import type { AppTheme } from "../../styles/theme";
import type { StockAlert } from "../../types/api";
import { formatCurrency, formatDateTime } from "../../utils/formatters";
import AppButton from "../ui/AppButton";

interface AlertCardProps {
  alert: StockAlert;
  isDeleting?: boolean;
  isUpdating?: boolean;
  onDelete: () => void;
  onToggle: () => void;
}

function AlertCard({
  alert,
  isDeleting = false,
  isUpdating = false,
  onDelete,
  onToggle,
}: AlertCardProps) {
  const { t } = useTranslation();

  const theme = useAppTheme();
  const styles = createStyles(theme);

  const statusStyle = alert.active
    ? styles.activeStatus
    : styles.inactiveStatus;

  return (
    <View
      accessibilityLabel={`${alert.symbol}. ${
        alert.active ? t("alerts.active") : t("alerts.inactive")
      }. ${t("alerts.target")}: ${formatCurrency(alert.targetPrice)}. ${t(
        "alerts.lastTriggered",
      )}: ${formatCurrency(alert.lastTriggeredPrice)}.`}
      accessibilityRole="summary"
      style={styles.card}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.symbol}>{alert.symbol}</Text>
          <Text style={styles.meta}>
            {alert.active ? t("alerts.watching") : t("alerts.paused")}
          </Text>
        </View>
        <View style={[styles.status, statusStyle]}>
          <MaterialDesignIcon
            accessibilityElementsHidden
            color={
              alert.active ? theme.colors.positive : theme.colors.mutedText
            }
            importantForAccessibility="no-hide-descendants"
            name={alert.active ? "bell-ring-outline" : "bell-off-outline"}
            size={15}
          />
          <Text
            style={[
              styles.statusLabel,
              alert.active
                ? styles.activeStatusLabel
                : styles.inactiveStatusLabel,
            ]}
          >
            {alert.active ? t("alerts.active") : t("alerts.inactive")}
          </Text>
        </View>
      </View>

      <View style={styles.metrics}>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>{t("alerts.target")}</Text>
          <Text style={styles.metricValue}>
            {formatCurrency(alert.targetPrice)}
          </Text>
        </View>
        <View style={styles.metric}>
          <Text style={styles.metricLabel}>{t("alerts.lastTriggered")}</Text>
          <Text style={styles.metricValue}>
            {formatCurrency(alert.lastTriggeredPrice)}
          </Text>
        </View>
      </View>

      <Text style={styles.updated}>
        {t("alerts.updated", { value: formatDateTime(alert.updatedAt) })}
      </Text>

      <View style={styles.actions}>
        <AppButton
          loading={isUpdating}
          onPress={onToggle}
          size="small"
          title={alert.active ? t("alerts.pause") : t("alerts.resume")}
          variant="secondary"
        />
        <AppButton
          loading={isDeleting}
          onPress={onDelete}
          size="small"
          title={t("common.delete")}
          variant="ghost"
        />
      </View>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    actions: {
      flexDirection: "row",
      gap: 10,
    },
    activeStatus: {
      backgroundColor: theme.dark ? "#14351f" : "#e8f7ee",
    },
    activeStatusLabel: {
      color: theme.colors.positive,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: 8,
      borderWidth: 1,
      gap: 14,
      padding: 16,
    },
    header: {
      alignItems: "flex-start",
      flexDirection: "row",
      gap: 12,
      justifyContent: "space-between",
    },
    inactiveStatus: {
      backgroundColor: theme.colors.surfaceMuted,
    },
    inactiveStatusLabel: {
      color: theme.colors.mutedText,
    },
    meta: {
      color: theme.colors.mutedText,
      fontSize: 13,
      marginTop: 3,
    },
    metric: {
      flex: 1,
      gap: 4,
    },
    metricLabel: {
      color: theme.colors.mutedText,
      fontSize: 12,
      fontWeight: "700",
      textTransform: "uppercase",
    },
    metricValue: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "800",
    },
    metrics: {
      flexDirection: "row",
      gap: 12,
    },
    status: {
      alignItems: "center",
      borderRadius: 999,
      flexDirection: "row",
      gap: 5,
      paddingHorizontal: 9,
      paddingVertical: 6,
    },
    statusLabel: {
      fontSize: 12,
      fontWeight: "800",
    },
    symbol: {
      color: theme.colors.text,
      fontSize: 20,
      fontWeight: "900",
    },
    updated: {
      color: theme.colors.mutedText,
      fontSize: 13,
    },
  });

export default AlertCard;
