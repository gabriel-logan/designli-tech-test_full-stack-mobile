import { Button, StyleSheet, Text, View } from "react-native";

import type { RootStackScreenProps } from "../types/navigation";

type Props = RootStackScreenProps<"NotFound">;

function NotFound({ navigation }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Screen not found</Text>
      <Button
        title="Go home"
        onPress={() => navigation.navigate("Home", { screen: "Dashboard" })}
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

export default NotFound;
