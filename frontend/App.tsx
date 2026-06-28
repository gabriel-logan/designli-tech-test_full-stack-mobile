import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useAppTheme } from "./src/hooks/useAppTheme";
import Routes from "./src/routes";

function App() {
  const theme = useAppTheme();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <Routes />
    </SafeAreaProvider>
  );
}

export default App;
