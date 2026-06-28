import { StyleSheet, Text, View } from "react-native";

import type { RootStackScreenProps } from "../types/navigation";

type Props = RootStackScreenProps<"CreateAlert">;

function CreateAlert({ route }: Props) {
  const { symbol } = route.params ?? {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Create alert</Text>
      <Text style={styles.symbol}>{symbol ?? "Select a stock"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 24,
    backgroundColor: "#fff",
  },
  symbol: {
    color: "#4b5563",
    fontSize: 16,
  },
  title: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "700",
  },
});

export default CreateAlert;
