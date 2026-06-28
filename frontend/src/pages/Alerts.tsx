import MaterialDesignIcon from "@react-native-vector-icons/material-design-icons";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import AlertCard from "../components/stocks/AlertCard";
import AppButton from "../components/ui/AppButton";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Screen from "../components/ui/Screen";
import { useAppTheme } from "../hooks/useAppTheme";
import { deleteAlert, updateAlert } from "../services/mutations/alerts";
import { getAlerts } from "../services/queries/alerts";
import type { AppTheme } from "../styles/theme";
import type { HomeTabScreenProps } from "../types/navigation";

type Props = HomeTabScreenProps<"Alerts">;

function Alerts({ navigation }: Props) {
  const { t } = useTranslation();

  const theme = useAppTheme();
  const styles = createStyles(theme);
  const queryClient = useQueryClient();

  const alertsQuery = useQuery({
    queryKey: ["alerts"],
    queryFn: getAlerts,
    refetchInterval: 5000,
  });

  const updateAlertMutation = useMutation({
    mutationFn: updateAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  const deleteAlertMutation = useMutation({
    mutationFn: deleteAlert,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["alerts"] });
    },
  });

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{t("alerts.title")}</Text>
          <Text style={styles.subtitle}>{t("alerts.subtitle")}</Text>
        </View>
        <AppButton
          icon={
            <MaterialDesignIcon
              color="#ffffff"
              name="bell-plus-outline"
              size={18}
            />
          }
          onPress={() => navigation.navigate("CreateAlert")}
          size="small"
          title={t("alerts.create")}
        />
      </View>

      {alertsQuery.isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.loadingText}>{t("common.loading")}</Text>
        </View>
      )}

      {alertsQuery.isError && (
        <ErrorState
          message={t("common.requestError")}
          onRetry={() => alertsQuery.refetch()}
          retryLabel={t("common.retry")}
          title={t("alerts.listError")}
        />
      )}

      {alertsQuery.data?.length === 0 && (
        <EmptyState
          icon="bell-sleep-outline"
          message={t("alerts.emptyMessage")}
          title={t("alerts.emptyTitle")}
        />
      )}

      {alertsQuery.data?.map(alert => (
        <AlertCard
          alert={alert}
          isDeleting={
            deleteAlertMutation.isPending &&
            deleteAlertMutation.variables === alert.id
          }
          isUpdating={
            updateAlertMutation.isPending &&
            updateAlertMutation.variables?.id === alert.id
          }
          key={alert.id}
          onDelete={() => deleteAlertMutation.mutate(alert.id)}
          onToggle={() =>
            updateAlertMutation.mutate({
              id: alert.id,
              active: !alert.active,
            })
          }
        />
      ))}
    </Screen>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    header: {
      alignItems: "flex-start",
      flexDirection: "row",
      gap: 12,
      justifyContent: "space-between",
      paddingTop: 10,
    },
    headerCopy: {
      flex: 1,
      gap: 5,
    },
    loading: {
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: 8,
      borderWidth: 1,
      gap: 8,
      padding: 22,
    },
    loadingText: {
      color: theme.colors.mutedText,
      fontSize: 14,
      textAlign: "center",
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

export default Alerts;
