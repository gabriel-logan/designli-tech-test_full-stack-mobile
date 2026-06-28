import { Button, StyleSheet, Text, View } from "react-native";

import type { HomeTabScreenProps } from "../types/navigation";

type Props = HomeTabScreenProps<"Stocks">;

function Stocks({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stocks</Text>
      <Button
        title="Open AAPL"
        onPress={() => navigation.navigate("StockDetails", { symbol: "AAPL" })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "700",
  },
});

export default Stocks;
