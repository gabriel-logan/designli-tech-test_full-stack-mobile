import { useTranslation } from "react-i18next";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import Svg, {
  Defs,
  G,
  Line,
  LinearGradient,
  Path,
  Rect,
  Stop,
  Text as SvgText,
} from "react-native-svg";

import { useAppTheme } from "../../hooks/useAppTheme";
import type { AppTheme } from "../../styles/theme";
import type { StockCandle, StockQuote } from "../../types/api";
import { formatCurrency, formatPercent } from "../../utils/formatters";
import EmptyState from "../ui/EmptyState";

interface StockChartProps {
  candles: StockCandle[];
  latestQuote?: StockQuote | null;
  title?: string;
}

const chartHeight = 248;
const pricePanelHeight = 186;
const volumePanelTop = 204;
const volumePanelHeight = 34;
const leftInset = 8;
const rightInset = 62;
const topInset = 10;

function applyLatestQuoteToCandles(
  candles: StockCandle[],
  latestQuote?: StockQuote | null,
) {
  if (!latestQuote || candles.length === 0 || latestQuote.current <= 0) {
    return candles;
  }

  const nextCandles = [...candles];
  const lastIndex = nextCandles.length - 1;
  const lastCandle = nextCandles[lastIndex];
  const currentPrice = latestQuote.current;

  nextCandles[lastIndex] = {
    ...lastCandle,
    close: currentPrice,
    high: Math.max(lastCandle.high, latestQuote.high, currentPrice),
    low: Math.min(
      lastCandle.low,
      latestQuote.low || currentPrice,
      currentPrice,
    ),
    timestamp: Math.max(lastCandle.timestamp, latestQuote.timestamp),
  };

  return nextCandles;
}

function StockChart({ candles, latestQuote, title }: StockChartProps) {
  const { t } = useTranslation();

  const theme = useAppTheme();
  const styles = createStyles(theme);

  const { width } = useWindowDimensions();
  const chartWidth = Math.max(Math.min(width - 72, 560), 284);
  const plotWidth = chartWidth - leftInset - rightInset;
  const liveCandles = applyLatestQuoteToCandles(candles, latestQuote);
  const visibleCandles = liveCandles.slice(-32);

  if (visibleCandles.length < 2) {
    return (
      <EmptyState
        icon="chart-line"
        message={t("stocks.chartUnavailableMessage")}
        title={t("stocks.chartUnavailable")}
      />
    );
  }

  const high = Math.max(...visibleCandles.map(candle => candle.high));
  const low = Math.min(...visibleCandles.map(candle => candle.low));
  const maxVolume = Math.max(...visibleCandles.map(candle => candle.volume), 1);
  const rawRange = high - low;
  const range = rawRange > 0 ? rawRange : Math.max(high * 0.02, 1);
  const paddedHigh = high + range * 0.14;
  const paddedLow = Math.max(low - range * 0.14, 0);
  const paddedRange = Math.max(paddedHigh - paddedLow, 1);
  const slotWidth = plotWidth / visibleCandles.length;
  const candleBodyWidth = Math.min(Math.max(slotWidth * 0.56, 4), 11);
  const firstClose = visibleCandles[0].close;
  const latest = visibleCandles.at(-1);
  const latestClose = latest?.close ?? 0;
  const latestOpen = latest?.open ?? latestClose;
  const totalMovePercent =
    firstClose > 0 ? ((latestClose - firstClose) / firstClose) * 100 : 0;
  const isLatestPositive = latestClose >= latestOpen;
  const latestColor = isLatestPositive
    ? theme.colors.positive
    : theme.colors.negative;

  function getX(index: number) {
    return leftInset + slotWidth * index + slotWidth / 2;
  }

  function getPriceY(value: number) {
    return topInset + ((paddedHigh - value) / paddedRange) * pricePanelHeight;
  }

  function getVolumeHeight(volume: number) {
    return Math.max((volume / maxVolume) * volumePanelHeight, 2);
  }

  const closePath = visibleCandles
    .map((candle, index) => {
      const command = index === 0 ? "M" : "L";

      return `${command}${getX(index).toFixed(1)},${getPriceY(candle.close).toFixed(1)}`;
    })
    .join(" ");
  const axisValues = [paddedHigh, paddedLow + paddedRange / 2, paddedLow];

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.headerCopy}>
          <Text style={styles.title}>{title ?? t("stocks.priceChart")}</Text>
          <Text style={styles.rangeText}>
            {formatCurrency(low)} - {formatCurrency(high)}
          </Text>
        </View>
        <View style={styles.latestBlock}>
          <Text style={[styles.latest, { color: latestColor }]}>
            {formatCurrency(latestClose)}
          </Text>
          <Text style={[styles.change, { color: latestColor }]}>
            {formatPercent(totalMovePercent)}
          </Text>
        </View>
      </View>

      <Svg height={chartHeight} width={chartWidth}>
        <Defs>
          <LinearGradient id="closeFill" x1="0" x2="0" y1="0" y2="1">
            <Stop
              offset="0"
              stopColor={theme.colors.primary}
              stopOpacity="0.2"
            />
            <Stop offset="1" stopColor={theme.colors.primary} stopOpacity="0" />
          </LinearGradient>
        </Defs>

        <Rect
          fill={theme.colors.surfaceMuted}
          height={chartHeight}
          opacity={theme.dark ? 0.28 : 0.5}
          rx={8}
          width={chartWidth}
          x={0}
          y={0}
        />

        {[0, 1, 2].map(section => {
          const y = topInset + (pricePanelHeight / 2) * section;

          return (
            <G key={section}>
              <Line
                stroke={theme.colors.border}
                strokeDasharray="5 6"
                strokeOpacity={0.85}
                strokeWidth={1}
                x1={leftInset}
                x2={chartWidth - rightInset + 6}
                y1={y}
                y2={y}
              />
              <SvgText
                fill={theme.colors.mutedText}
                fontSize={10}
                fontWeight="700"
                textAnchor="start"
                x={chartWidth - rightInset + 12}
                y={y + 4}
              >
                {formatCurrency(axisValues[section])}
              </SvgText>
            </G>
          );
        })}

        <Line
          stroke={theme.colors.border}
          strokeOpacity={0.9}
          strokeWidth={1}
          x1={leftInset}
          x2={chartWidth - rightInset + 6}
          y1={volumePanelTop - 10}
          y2={volumePanelTop - 10}
        />

        {visibleCandles.map((candle, index) => {
          const positive = candle.close >= candle.open;
          const color = positive
            ? theme.colors.positive
            : theme.colors.negative;
          const bodyFill = positive
            ? theme.colors.positiveSoft
            : theme.colors.negativeSoft;
          const x = getX(index);
          const wickTop = getPriceY(candle.high);
          const wickBottom = getPriceY(candle.low);
          const bodyTop = getPriceY(Math.max(candle.open, candle.close));
          const bodyBottom = getPriceY(Math.min(candle.open, candle.close));
          const bodyHeight = Math.max(bodyBottom - bodyTop, 3);
          const volumeHeight = getVolumeHeight(candle.volume);

          return (
            <G key={candle.timestamp}>
              <Rect
                fill={color}
                height={volumeHeight}
                opacity={positive ? 0.34 : 0.3}
                rx={1.5}
                width={Math.max(candleBodyWidth * 0.72, 2)}
                x={x - candleBodyWidth * 0.36}
                y={volumePanelTop + volumePanelHeight - volumeHeight}
              />
              <Line
                stroke={color}
                strokeLinecap="round"
                strokeWidth={1.4}
                x1={x}
                x2={x}
                y1={wickTop}
                y2={wickBottom}
              />
              <Rect
                fill={bodyFill}
                height={bodyHeight}
                rx={2.5}
                stroke={color}
                strokeWidth={1.4}
                width={candleBodyWidth}
                x={x - candleBodyWidth / 2}
                y={bodyTop}
              />
            </G>
          );
        })}

        <Path
          d={`${closePath} L${getX(visibleCandles.length - 1).toFixed(1)},${volumePanelTop - 10} L${getX(0).toFixed(1)},${volumePanelTop - 10} Z`}
          fill="url(#closeFill)"
        />
        <Path
          d={closePath}
          fill="none"
          stroke={theme.colors.primary}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.2}
        />
        <Line
          stroke={latestColor}
          strokeDasharray="4 5"
          strokeOpacity={0.78}
          strokeWidth={1}
          x1={leftInset}
          x2={chartWidth - rightInset + 6}
          y1={getPriceY(latestClose)}
          y2={getPriceY(latestClose)}
        />
      </Svg>
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    card: {
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: 8,
      borderWidth: 1,
      gap: 14,
      overflow: "hidden",
      padding: 16,
    },
    change: {
      fontSize: 12,
      fontWeight: "900",
      textAlign: "right",
    },
    header: {
      alignItems: "flex-start",
      flexDirection: "row",
      gap: 12,
      justifyContent: "space-between",
    },
    headerCopy: {
      flex: 1,
      gap: 4,
    },
    latest: {
      fontSize: 18,
      fontWeight: "900",
      textAlign: "right",
    },
    latestBlock: {
      alignItems: "flex-end",
      gap: 3,
    },
    rangeText: {
      color: theme.colors.mutedText,
      fontSize: 12,
      fontWeight: "700",
    },
    title: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "800",
    },
  });

export default StockChart;
