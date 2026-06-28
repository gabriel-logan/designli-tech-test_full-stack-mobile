import { StyleSheet, Text, View } from "react-native";

function Auth() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    color: "#111827",
    fontSize: 24,
    fontWeight: "700",
  },
});

export default Auth;
