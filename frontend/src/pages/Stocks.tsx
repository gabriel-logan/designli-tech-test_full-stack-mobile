import MaterialDesignIcon from "@react-native-vector-icons/material-design-icons";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import StockListItem from "../components/stocks/StockListItem";
import StockQuoteCard from "../components/stocks/StockQuoteCard";
import AppButton from "../components/ui/AppButton";
import AppTextInput from "../components/ui/AppTextInput";
import EmptyState from "../components/ui/EmptyState";
import ErrorState from "../components/ui/ErrorState";
import Screen from "../components/ui/Screen";
import SectionHeader from "../components/ui/SectionHeader";
import { defaultStockSymbols } from "../constants";
import { useAppTheme } from "../hooks/useAppTheme";
import { useStocksSocket } from "../hooks/useStocksSocket";
import { getStocks } from "../services/queries/stocks";
import type { AppTheme } from "../styles/theme";
import type { StockSymbol } from "../types/api";
import type { HomeTabScreenProps } from "../types/navigation";

type Props = HomeTabScreenProps<"Stocks">;

function getUniqueStocks(stocks: StockSymbol[] = []) {
  const symbols = new Set<string>();

  return stocks.filter(stock => {
    const symbol = stock.symbol.trim().toUpperCase();

    if (!symbol || symbols.has(symbol)) {
      return false;
    }

    symbols.add(symbol);

    return true;
  });
}

function Stocks({ navigation }: Props) {
  const { t } = useTranslation();

  const theme = useAppTheme();
  const styles = createStyles(theme);

  const [query, setQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const normalizedQuery = submittedQuery?.trim() ?? "";
  const hasSubmittedQuery = normalizedQuery.length > 0;

  const stocksQuery = useQuery({
    enabled: hasSubmittedQuery,
    queryKey: ["stocks", "search", normalizedQuery],
    queryFn: () =>
      getStocks({
        limit: 25,
        query: normalizedQuery,
      }),
  });

  const stocksSocket = useStocksSocket(defaultStockSymbols);
  const stockResults = getUniqueStocks(stocksQuery.data);

  function refreshResults() {
    if (!hasSubmittedQuery || isRefreshing) {
      return;
    }

    setIsRefreshing(true);
    stocksQuery.refetch();
  }

  function submitSearch() {
    const nextQuery = query.trim();

    if (nextQuery.length === 0) {
      setSubmittedQuery(null);
      return;
    }

    if (nextQuery === normalizedQuery) {
      stocksQuery.refetch();
      return;
    }

    setSubmittedQuery(nextQuery);
  }

  useEffect(() => {
    if (!isRefreshing || stocksQuery.isFetching) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsRefreshing(false);
    }, 350);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isRefreshing, stocksQuery.isFetching]);

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{t("stocks.title")}</Text>
          <Text style={styles.subtitle}>{t("stocks.subtitle")}</Text>
        </View>
        <AppButton
          icon={
            <MaterialDesignIcon
              accessibilityElementsHidden
              color={theme.colors.primary}
              importantForAccessibility="no-hide-descendants"
              name="refresh"
              size={17}
            />
          }
          disabled={!hasSubmittedQuery}
          loading={isRefreshing}
          onPress={refreshResults}
          size="small"
          title={t("stocks.refresh")}
          variant="secondary"
        />
      </View>

      <SectionHeader
        subtitle={t("stocks.liveSubtitle")}
        title={t("stocks.liveQuotes")}
      />

      <View style={styles.liveGrid}>
        {stocksSocket.quotes.length === 0 ? (
          <View style={styles.loading}>
            <ActivityIndicator
              accessibilityLabel={
                stocksSocket.isConnected
                  ? t("stocks.waitingQuotes")
                  : t("stocks.socketDisconnected")
              }
              accessibilityRole="progressbar"
              color={theme.colors.primary}
            />
            <Text style={styles.loadingText}>
              {stocksSocket.isConnected
                ? t("stocks.waitingQuotes")
                : t("stocks.socketDisconnected")}
            </Text>
          </View>
        ) : (
          stocksSocket.quotes.map(quote => (
            <StockQuoteCard
              key={quote.symbol}
              onPress={() =>
                navigation.navigate("StockDetails", { symbol: quote.symbol })
              }
              quote={quote}
            />
          ))
        )}
      </View>

      <View style={styles.searchCard}>
        <AppTextInput
          label={t("stocks.searchLabel")}
          onChangeText={setQuery}
          onSubmitEditing={submitSearch}
          placeholder={t("stocks.searchPlaceholder")}
          returnKeyType="search"
          value={query}
        />
        <AppButton
          icon={
            <MaterialDesignIcon
              accessibilityElementsHidden
              color="#ffffff"
              importantForAccessibility="no-hide-descendants"
              name="magnify"
              size={18}
            />
          }
          loading={stocksQuery.isFetching}
          onPress={submitSearch}
          title={t("stocks.search")}
        />
      </View>

      <SectionHeader
        subtitle={t("stocks.resultsSubtitle")}
        title={t("stocks.resultsTitle")}
      />

      {!hasSubmittedQuery && (
        <EmptyState
          icon="magnify"
          message={t("stocks.searchStartMessage")}
          title={t("stocks.searchStartTitle")}
        />
      )}

      {stocksQuery.isLoading && (
        <View accessibilityLiveRegion="polite" style={styles.loading}>
          <ActivityIndicator
            accessibilityLabel={t("common.loading")}
            accessibilityRole="progressbar"
            color={theme.colors.primary}
          />
          <Text style={styles.loadingText}>{t("common.loading")}</Text>
        </View>
      )}

      {hasSubmittedQuery && stocksQuery.isError && (
        <ErrorState
          message={t("common.requestError")}
          onRetry={() => stocksQuery.refetch()}
          retryLabel={t("common.retry")}
          title={t("stocks.resultsError")}
        />
      )}

      {hasSubmittedQuery && stockResults.length === 0 && (
        <EmptyState
          icon="magnify-close"
          message={t("stocks.emptyMessage")}
          title={t("stocks.emptyTitle")}
        />
      )}

      {hasSubmittedQuery &&
        stockResults.map(stock => (
          <StockListItem
            key={stock.symbol.trim().toUpperCase()}
            onPress={() =>
              navigation.navigate("StockDetails", { symbol: stock.symbol })
            }
            stock={stock}
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
    liveGrid: {
      gap: 12,
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
    searchCard: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: 8,
      borderWidth: 1,
      gap: 14,
      padding: 16,
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

export default Stocks;
