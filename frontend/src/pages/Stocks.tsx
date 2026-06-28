import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Button, ScrollView, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../hooks/useAppTheme";
import { useStocksSocket } from "../hooks/useStocksSocket";
import { getStocks } from "../services/queries/stocks";
import type { AppTheme } from "../styles/theme";
import type { HomeTabScreenProps } from "../types/navigation";

type Props = HomeTabScreenProps<"Stocks">;

function Stocks({ navigation }: Props) {
  const { t } = useTranslation();

  const theme = useAppTheme();
  const styles = createStyles(theme);

  const stockListParams = useMemo(
    () => ({
      limit: 5,
      query: "apple",
    }),
    [],
  );

  const stockSymbols = useMemo(() => ["AAPL", "MSFT", "GOOGL"], []);

  const stocksQuery = useQuery({
    queryKey: ["stocks", "list", stockListParams],
    queryFn: () => getStocks(stockListParams),
  });

  const stocksSocket = useStocksSocket(stockSymbols);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.section}>
        <Text style={styles.title}>{t("stocks.title")}</Text>
        <Button
          title={t("stocks.openSymbol", { symbol: "AAPL" })}
          onPress={() =>
            navigation.navigate("StockDetails", { symbol: "AAPL" })
          }
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("stocks.queryExample")}</Text>
        {stocksQuery.isLoading && (
          <Text style={styles.text}>{t("common.loading")}</Text>
        )}
        {stocksQuery.isError && (
          <Text style={styles.error}>{t("common.requestError")}</Text>
        )}
        {stocksQuery.data?.map(stock => (
          <Text key={stock.symbol} style={styles.text}>
            {stock.displaySymbol} - {stock.description}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t("stocks.socketExample")}</Text>
        <Text style={styles.text}>
          {t(
            stocksSocket.isConnected
              ? "stocks.socketConnected"
              : "stocks.socketDisconnected",
          )}
        </Text>
        {stocksSocket.quotes.map(quote => (
          <Text key={quote.symbol} style={styles.text}>
            {quote.symbol}: ${quote.current}
          </Text>
        ))}
      </View>

      <Button
        title={t("stocks.refresh")}
        onPress={() => stocksQuery.refetch()}
      />
    </ScrollView>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      gap: 16,
      padding: 24,
      backgroundColor: theme.colors.background,
    },
    error: {
      color: theme.colors.notification,
      fontSize: 16,
    },
    section: {
      gap: 8,
    },
    sectionTitle: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "700",
    },
    text: {
      color: theme.colors.mutedText,
      fontSize: 16,
    },
    title: {
      color: theme.colors.text,
      fontSize: 24,
      fontWeight: "700",
    },
  });

export default Stocks;
