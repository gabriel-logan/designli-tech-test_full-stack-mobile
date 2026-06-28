import { Button, StyleSheet, Text, View } from "react-native";

import type { HomeTabScreenProps } from "../types/navigation";

type Props = HomeTabScreenProps<"Dashboard">;

function Home({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stocks dashboard</Text>
      <Button
        title="View stocks"
        onPress={() => navigation.navigate("Stocks")}
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

export default Home;
