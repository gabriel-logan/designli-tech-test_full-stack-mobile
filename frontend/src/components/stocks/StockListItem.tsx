import MaterialDesignIcon from "@react-native-vector-icons/material-design-icons";
import { Pressable, StyleSheet, Text, View } from "react-native";

import { useAppTheme } from "../../hooks/useAppTheme";
import type { AppTheme } from "../../styles/theme";
import type { StockSymbol } from "../../types/api";

interface StockListItemProps {
  onPress: () => void;
  stock: StockSymbol;
}

function StockListItem({ onPress, stock }: StockListItemProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.item, pressed && styles.pressed]}
    >
      <View style={styles.symbolBox}>
        <Text style={styles.symbol}>{stock.displaySymbol.slice(0, 4)}</Text>
      </View>
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.name}>
          {stock.displaySymbol}
        </Text>
        <Text numberOfLines={2} style={styles.description}>
          {stock.description}
        </Text>
      </View>
      <View style={styles.meta}>
        {!!stock.currency && (
          <Text style={styles.currency}>{stock.currency}</Text>
        )}
        <MaterialDesignIcon
          color={theme.colors.mutedText}
          name="chevron-right"
          size={22}
        />
      </View>
    </Pressable>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    copy: {
      flex: 1,
      gap: 3,
    },
    currency: {
      color: theme.colors.mutedText,
      fontSize: 12,
      fontWeight: "800",
    },
    description: {
      color: theme.colors.mutedText,
      fontSize: 13,
      lineHeight: 18,
    },
    item: {
      alignItems: "center",
      backgroundColor: theme.colors.surface,
      borderColor: theme.colors.border,
      borderRadius: 8,
      borderWidth: 1,
      flexDirection: "row",
      gap: 12,
      padding: 14,
    },
    meta: {
      alignItems: "center",
      flexDirection: "row",
      gap: 4,
    },
    name: {
      color: theme.colors.text,
      fontSize: 16,
      fontWeight: "800",
    },
    pressed: {
      opacity: 0.78,
    },
    symbol: {
      color: theme.colors.primary,
      fontSize: 13,
      fontWeight: "900",
    },
    symbolBox: {
      alignItems: "center",
      backgroundColor: theme.colors.primarySoft,
      borderRadius: 8,
      height: 44,
      justifyContent: "center",
      width: 54,
    },
  });

export default StockListItem;
