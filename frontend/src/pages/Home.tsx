import MaterialDesignIcon from "@react-native-vector-icons/material-design-icons";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import SummaryStockCard from "../components/stocks/SummaryStockCard";
import AppButton from "../components/ui/AppButton";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Screen from "../components/ui/Screen";
import SectionHeader from "../components/ui/SectionHeader";
import { defaultStockSymbols } from "../constants";
import { useAppTheme } from "../hooks/useAppTheme";
import { useStocksSocket } from "../hooks/useStocksSocket";
import { getStocksSummary } from "../services/queries/stocks";
import { useAuthStore } from "../stores/authStore";
import type { AppTheme } from "../styles/theme";
import type { HomeTabScreenProps } from "../types/navigation";
import {
  formatCurrency,
  formatPercent,
  formatUserDisplayName,
} from "../utils/formatters";

type Props = HomeTabScreenProps<"Dashboard">;

function Home({ navigation }: Props) {
  const { t } = useTranslation();

  const theme = useAppTheme();
  const styles = createStyles(theme);

  const authUser = useAuthStore(state => state.authUser);
  const userName = formatUserDisplayName(authUser) || t("home.defaultUserName");

  const summaryQuery = useQuery({
    queryKey: ["stocks", "summary"],
    queryFn: getStocksSummary,
  });

  const stocksSocket = useStocksSocket(defaultStockSymbols);

  const summaryItems = summaryQuery.data ?? [];
  const socketQuotes = stocksSocket.quotes;
  const quotes =
    socketQuotes.length > 0
      ? socketQuotes
      : summaryItems.map(item => item.quote);
  const averageChange =
    quotes.length > 0
      ? quotes.reduce((total, quote) => total + quote.percentChange, 0) /
        quotes.length
      : 0;
  const topQuote = quotes.reduce(
    (currentTop, quote) =>
      !currentTop || quote.current > currentTop.current ? quote : currentTop,
    undefined as (typeof quotes)[number] | undefined,
  );

  return (
    <Screen>
      <View style={styles.hero}>
        <View style={styles.heroCopy}>
          <Text style={styles.kicker}>
            {t("home.welcome", { name: userName })}
          </Text>
          <Text style={styles.title}>{t("home.title")}</Text>
          <Text style={styles.subtitle}>{t("home.subtitle")}</Text>
        </View>
      </View>

      <View style={styles.statusCard}>
        <View style={styles.statusRow}>
          <View style={styles.statusIcon}>
            <MaterialDesignIcon
              color={
                stocksSocket.isConnected
                  ? theme.colors.positive
                  : theme.colors.warning
              }
              name={
                stocksSocket.isConnected ? "access-point" : "access-point-off"
              }
              size={22}
            />
          </View>
          <View style={styles.statusCopy}>
            <Text style={styles.statusTitle}>
              {stocksSocket.isConnected
                ? t("stocks.socketConnected")
                : t("stocks.socketDisconnected")}
            </Text>
            <Text style={styles.statusText}>{t("home.socketDescription")}</Text>
          </View>
        </View>
      </View>

      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>{t("home.trackedSymbols")}</Text>
          <Text style={styles.metricValue}>{defaultStockSymbols.length}</Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>{t("home.avgChange")}</Text>
          <Text
            adjustsFontSizeToFit
            minimumFontScale={0.75}
            numberOfLines={1}
            style={[
              styles.metricValue,
              averageChange >= 0 ? styles.positive : styles.negative,
            ]}
          >
            {formatPercent(averageChange)}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>{t("home.topPrice")}</Text>
          <Text
            adjustsFontSizeToFit
            minimumFontScale={0.75}
            numberOfLines={1}
            style={styles.metricValue}
          >
            {topQuote ? formatCurrency(topQuote.current) : "--"}
          </Text>
        </View>
      </View>

      <SectionHeader
        action={
          <AppButton
            icon={
              <MaterialDesignIcon
                color={theme.colors.primary}
                name="magnify"
                size={17}
              />
            }
            onPress={() => navigation.navigate("Stocks")}
            size="small"
            title={t("home.viewStocks")}
            variant="secondary"
          />
        }
        subtitle={t("home.marketSubtitle")}
        title={t("home.marketOverview")}
      />

      {summaryQuery.isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.loadingText}>{t("common.loading")}</Text>
        </View>
      )}

      {summaryQuery.isError && (
        <ErrorState
          message={t("common.requestError")}
          onRetry={() => summaryQuery.refetch()}
          retryLabel={t("common.retry")}
          title={t("home.summaryError")}
        />
      )}

      {!summaryQuery.isLoading &&
        !summaryQuery.isError &&
        summaryItems.length === 0 && (
          <EmptyState
            icon="chart-line"
            message={t("home.emptySummaryMessage")}
            title={t("home.emptySummary")}
          />
        )}

      {summaryItems.map(item => (
        <SummaryStockCard
          item={item}
          key={item.symbol}
          onPress={() =>
            navigation.navigate("StockDetails", { symbol: item.symbol })
          }
        />
      ))}
    </Screen>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    hero: {
      alignItems: "flex-start",
      flexDirection: "row",
      gap: 12,
      justifyContent: "space-between",
      paddingTop: 10,
    },
    heroCopy: {
      flex: 1,
      gap: 6,
    },
    kicker: {
      color: theme.colors.primary,
      fontSize: 13,
      fontWeight: "800",
    },
    loading: {
      alignItems: "center",
      gap: 8,
      padding: 24,
    },
    loadingText: {
      color: theme.colors.mutedText,
      fontSize: 14,
    },
    metricCard: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: 8,
      borderWidth: 1,
      flex: 1,
      gap: 8,
      minWidth: 96,
      padding: 14,
    },
    metricLabel: {
      color: theme.colors.mutedText,
      fontSize: 12,
      fontWeight: "800",
      textTransform: "uppercase",
    },
    metricValue: {
      color: theme.colors.text,
      fontSize: 22,
      fontWeight: "900",
    },
    metricsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
    },
    negative: {
      color: theme.colors.negative,
    },
    positive: {
      color: theme.colors.positive,
    },
    statusCard: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: 8,
      borderWidth: 1,
      padding: 14,
    },
    statusCopy: {
      flex: 1,
      gap: 3,
    },
    statusIcon: {
      alignItems: "center",
      backgroundColor: theme.colors.surfaceMuted,
      borderRadius: 8,
      height: 42,
      justifyContent: "center",
      width: 42,
    },
    statusRow: {
      alignItems: "center",
      flexDirection: "row",
      gap: 12,
    },
    statusText: {
      color: theme.colors.mutedText,
      fontSize: 13,
      lineHeight: 18,
    },
    statusTitle: {
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

export default Home;
