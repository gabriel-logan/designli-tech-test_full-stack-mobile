import MaterialDesignIcon from "@react-native-vector-icons/material-design-icons";
import { useTranslation } from "react-i18next";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../../hooks/useAppTheme";
import type { AppTheme } from "../../styles/theme";
import type { StockQuote } from "../../types/api";
import { formatCurrency, formatPercent } from "../../utils/formatters";

interface StockQuoteCardProps {
  onPress?: () => void;
  quote: StockQuote;
}

function StockQuoteCard({ onPress, quote }: StockQuoteCardProps) {
  const { t } = useTranslation();

  const theme = useAppTheme();
  const styles = createStyles(theme);

  const isPositive = quote.change >= 0;

  const trendColor = isPositive ? theme.colors.positive : theme.colors.negative;

  return (
    <Pressable
      accessibilityRole={onPress ? "button" : undefined}
      disabled={!onPress}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.symbol}>{quote.symbol}</Text>
          <Text style={styles.meta}>{t("stocks.liveQuote")}</Text>
        </View>
        <View style={styles.trend}>
          <MaterialDesignIcon
            color={trendColor}
            name={isPositive ? "trending-up" : "trending-down"}
            size={18}
          />
          <Text style={[styles.trendText, { color: trendColor }]}>
            {formatPercent(quote.percentChange)}
          </Text>
        </View>
      </View>

      <Text style={styles.price}>{formatCurrency(quote.current)}</Text>

      <View style={styles.range}>
        <Text style={styles.rangeText}>
          {t("stocks.low", { value: formatCurrency(quote.low) })}
        </Text>
        <Text style={styles.rangeText}>
          {t("stocks.high", { value: formatCurrency(quote.high) })}
        </Text>
      </View>
    </Pressable>
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
      padding: 16,
    },
    header: {
      alignItems: "center",
      flexDirection: "row",
      gap: 12,
      justifyContent: "space-between",
    },
    meta: {
      color: theme.colors.mutedText,
      fontSize: 13,
      marginTop: 3,
    },
    pressed: {
      opacity: 0.78,
    },
    price: {
      color: theme.colors.text,
      fontSize: 26,
      fontWeight: "900",
    },
    range: {
      flexDirection: "row",
      gap: 12,
      justifyContent: "space-between",
    },
    rangeText: {
      color: theme.colors.mutedText,
      fontSize: 13,
      fontWeight: "600",
    },
    symbol: {
      color: theme.colors.text,
      fontSize: 18,
      fontWeight: "900",
    },
    trend: {
      alignItems: "center",
      flexDirection: "row",
      gap: 5,
    },
    trendText: {
      fontSize: 14,
      fontWeight: "900",
    },
  });

export default StockQuoteCard;
