export interface ApiErrorResponse {
  statusCode: number;
  error: string;
  message?: string | string[];
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}

export interface StockSymbol {
  symbol: string;
  description: string;
  displaySymbol: string;
  type: string;
  currency?: string;
}

export interface StockQuote {
  symbol: string;
  current: number;
  change: number;
  percentChange: number;
  high: number;
  low: number;
  open: number;
  previousClose: number;
  timestamp: number;
}

export interface StockCandle {
  close: number;
  high: number;
  low: number;
  open: number;
  timestamp: number;
  volume: number;
}

export interface StockChartItem {
  symbol: string;
  quote: StockQuote;
  candles: StockCandle[];
}

export interface ListStocksQuery {
  exchange?: string;
  query?: string;
  limit?: number;
}

export interface StocksChartQuery {
  symbols: string;
}

export type StockCandleResolution =
  "1" | "5" | "15" | "30" | "60" | "D" | "W" | "M";

export interface StockCandlesQuery {
  resolution?: StockCandleResolution;
  from?: number;
  to?: number;
}

export interface StockAlert {
  id: string;
  userId: string;
  symbol: string;
  targetPrice: number;
  active: boolean;
  triggeredAt: string | null;
  lastTriggeredPrice: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAlertRequest {
  symbol: string;
  targetPrice: number;
}

export interface UpdateAlertRequest {
  targetPrice?: number;
  active?: boolean;
}

export interface UserDevice {
  id: string;
  userId: string;
  fcmToken: string;
  platform: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterDeviceRequest {
  fcmToken: string;
  platform?: string;
}

export type HealthResponse = string;
