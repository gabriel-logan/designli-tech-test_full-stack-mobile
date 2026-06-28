import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

import type { StockChartItem } from "../../types/api";
import StockChart from "./StockChart";
import StockQuoteCard from "./StockQuoteCard";

interface SummaryStockCardProps {
  item: StockChartItem;
  onPress?: () => void;
}

function SummaryStockCard({ item, onPress }: SummaryStockCardProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.container}>
      <StockQuoteCard onPress={onPress} quote={item.quote} />
      <StockChart
        candles={item.candles}
        title={t("stocks.symbolTrend", { symbol: item.symbol })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
});

export default SummaryStockCard;
