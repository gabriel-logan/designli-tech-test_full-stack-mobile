import MaterialDesignIcon from "@react-native-vector-icons/material-design-icons";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import StockChart from "../components/stocks/StockChart";
import StockQuoteCard from "../components/stocks/StockQuoteCard";
import AppButton from "../components/ui/AppButton";
import ErrorState from "../components/ui/ErrorState";
import Screen from "../components/ui/Screen";
import SectionHeader from "../components/ui/SectionHeader";
import { useAppTheme } from "../hooks/useAppTheme";
import { useStocksSocket } from "../hooks/useStocksSocket";
import { getStockCandles, getStockQuote } from "../services/queries/stocks";
import type { AppTheme } from "../styles/theme";
import type { RootStackScreenProps } from "../types/navigation";
import { formatCompactNumber, formatCurrency } from "../utils/formatters";

type Props = RootStackScreenProps<"StockDetails">;

function StockDetails({ navigation, route }: Props) {
  const { t } = useTranslation();

  const theme = useAppTheme();
  const styles = createStyles(theme);
  const { symbol } = route.params;

  const quoteQuery = useQuery({
    queryKey: ["stocks", "quote", symbol],
    queryFn: () => getStockQuote(symbol),
  });

  const candlesQuery = useQuery({
    queryKey: ["stocks", "candles", symbol],
    queryFn: () => getStockCandles(symbol, { resolution: "D" }),
  });

  const stocksSocket = useStocksSocket([symbol]);
  const liveQuote = stocksSocket.quotes.find(quote => quote.symbol === symbol);
  const quote = liveQuote ?? quoteQuery.data;
  const latestCandle = candlesQuery.data?.at(-1);

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{symbol}</Text>
          <Text style={styles.subtitle}>{t("stocks.detailsSubtitle")}</Text>
        </View>
        <AppButton
          icon={
            <MaterialDesignIcon
              color="#ffffff"
              name="bell-plus-outline"
              size={18}
            />
          }
          onPress={() => navigation.navigate("CreateAlert", { symbol })}
          size="small"
          title={t("alerts.create")}
        />
      </View>

      {quoteQuery.isLoading && !quote && (
        <View style={styles.loading}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.loadingText}>{t("common.loading")}</Text>
        </View>
      )}

      {quoteQuery.isError && !quote && (
        <ErrorState
          message={t("common.requestError")}
          onRetry={() => quoteQuery.refetch()}
          retryLabel={t("common.retry")}
          title={t("stocks.quoteError")}
        />
      )}

      {quote && <StockQuoteCard quote={quote} />}

      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>{t("stocks.open")}</Text>
          <Text
            adjustsFontSizeToFit
            minimumFontScale={0.75}
            numberOfLines={1}
            style={styles.metricValue}
          >
            {formatCurrency(quote?.open)}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>{t("stocks.previousClose")}</Text>
          <Text
            adjustsFontSizeToFit
            minimumFontScale={0.75}
            numberOfLines={1}
            style={styles.metricValue}
          >
            {formatCurrency(quote?.previousClose)}
          </Text>
        </View>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>{t("stocks.volume")}</Text>
          <Text
            adjustsFontSizeToFit
            minimumFontScale={0.75}
            numberOfLines={1}
            style={styles.metricValue}
          >
            {formatCompactNumber(latestCandle?.volume)}
          </Text>
        </View>
      </View>

      <SectionHeader
        subtitle={t("stocks.chartSubtitle")}
        title={t("stocks.priceChart")}
      />

      {candlesQuery.isLoading && (
        <View style={styles.loading}>
          <ActivityIndicator color={theme.colors.primary} />
          <Text style={styles.loadingText}>{t("common.loading")}</Text>
        </View>
      )}

      {candlesQuery.isError && (
        <ErrorState
          message={t("common.requestError")}
          onRetry={() => candlesQuery.refetch()}
          retryLabel={t("common.retry")}
          title={t("stocks.chartError")}
        />
      )}

      {!!candlesQuery.data && <StockChart candles={candlesQuery.data} />}
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
    metricCard: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: 8,
      borderWidth: 1,
      flex: 1,
      gap: 8,
      minWidth: 104,
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
      fontSize: 18,
      fontWeight: "900",
    },
    metricsGrid: {
      flexDirection: "row",
      flexWrap: "wrap",
      gap: 10,
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

export default StockDetails;
