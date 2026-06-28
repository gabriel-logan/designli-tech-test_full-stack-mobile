import { NavigationContainer } from "@react-navigation/native";

import RootStackRoutes from "./RootStackRoutes";

function Routes() {
  return (
    <NavigationContainer>
      <RootStackRoutes />
    </NavigationContainer>
  );
}

export default Routes;
