import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type {
  CompositeScreenProps,
  NavigatorScreenParams,
} from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

export type RootStackParamList = {
  Auth: undefined;
  Home: NavigatorScreenParams<HomeTabParamList>;
  StockDetails: { symbol: string };
  CreateAlert: { symbol?: string } | undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> =
  NativeStackScreenProps<RootStackParamList, T>;

export type HomeTabParamList = {
  Dashboard: undefined;
  Stocks: undefined;
  Alerts: undefined;
  Settings: undefined;
};

export type HomeTabScreenProps<T extends keyof HomeTabParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<HomeTabParamList, T>,
    RootStackScreenProps<"Home">
  >;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
