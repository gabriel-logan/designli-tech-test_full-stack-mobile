import { NavigationContainer } from "@react-navigation/native";

import { useAppTheme } from "../hooks/useAppTheme";
import { getNavigationTheme } from "../styles/theme";
import RootStackRoutes from "./RootStackRoutes";

function Routes() {
  const theme = useAppTheme();

  return (
    <NavigationContainer theme={getNavigationTheme(theme)}>
      <RootStackRoutes />
    </NavigationContainer>
  );
}

export default Routes;
