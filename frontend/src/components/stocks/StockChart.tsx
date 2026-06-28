import { useTranslation } from "react-i18next";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

import { useAppTheme } from "../../hooks/useAppTheme";
import type { AppTheme } from "../../styles/theme";
import type { StockCandle } from "../../types/api";
import { formatCurrency } from "../../utils/formatters";
import EmptyState from "../ui/EmptyState";

interface StockChartProps {
  candles: StockCandle[];
  title?: string;
}

function StockChart({ candles, title }: StockChartProps) {
  const { t } = useTranslation();

  const theme = useAppTheme();
  const styles = createStyles(theme);

  const { width } = useWindowDimensions();

  const chartWidth = Math.min(width - 72, 520);

  const visibleCandles = candles.slice(-24);

  const chartData = visibleCandles.map(candle => ({
    value: candle.close,
  }));

  const latestClose = visibleCandles.at(-1)?.close;

  if (chartData.length < 2) {
    return (
      <EmptyState
        icon="chart-line"
        message={t("stocks.chartUnavailableMessage")}
        title={t("stocks.chartUnavailable")}
      />
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title ?? t("stocks.priceChart")}</Text>
        <Text style={styles.latest}>{formatCurrency(latestClose)}</Text>
      </View>
      <LineChart
        adjustToWidth
        areaChart
        color={theme.colors.primary}
        curved
        data={chartData}
        dataPointsColor={theme.colors.primary}
        endFillColor={theme.colors.primary}
        endOpacity={0.02}
        height={178}
        hideDataPoints
        hideRules
        initialSpacing={0}
        noOfSections={4}
        rulesColor={theme.colors.border}
        spacing={chartWidth / Math.max(chartData.length - 1, 1)}
        startFillColor={theme.colors.primary}
        startOpacity={0.18}
        thickness={3}
        width={chartWidth}
        xAxisColor={theme.colors.border}
        yAxisColor="transparent"
        yAxisTextStyle={styles.axisText}
      />
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    axisText: {
      color: theme.colors.mutedText,
      fontSize: 10,
    },
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: 8,
      borderWidth: 1,
      gap: 16,
      overflow: "hidden",
      padding: 16,
    },
    header: {
      alignItems: "center",
      flexDirection: "row",
      gap: 12,
      justifyContent: "space-between",
    },
    latest: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "900",
    },
    title: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "800",
    },
  });

export default StockChart;
