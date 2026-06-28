import { QueryClientProvider } from "@tanstack/react-query";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { useAppTheme } from "./src/hooks/useAppTheme";
import { usePushNotifications } from "./src/hooks/usePushNotifications";
import { queryClient } from "./src/lib/queryClient";
import Routes from "./src/routes";

function AppContent() {
  usePushNotifications();

  return <Routes />;
}

function App() {
  const theme = useAppTheme();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} />
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}

export default App;
