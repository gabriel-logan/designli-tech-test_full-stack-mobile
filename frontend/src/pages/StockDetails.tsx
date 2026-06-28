import { Button, StyleSheet, Text, View } from "react-native";

import type { RootStackScreenProps } from "../types/navigation";

type Props = RootStackScreenProps<"StockDetails">;

function StockDetails({ navigation, route }: Props) {
  const { symbol } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{symbol}</Text>
      <Button
        title="Create alert"
        onPress={() => navigation.navigate("CreateAlert", { symbol })}
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

export default StockDetails;
