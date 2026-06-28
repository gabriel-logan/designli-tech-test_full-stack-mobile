export interface EnvFinnhubConfig {
  readonly finnhub: {
    readonly apiKey: string;
    readonly defaultSymbols: string[];
    readonly pricePollIntervalMs: number;
    readonly quoteRefreshIntervalMs: number;
  };
}

function parsePositiveInteger(value: string, fallback: number): number {
  const parsed = Number.parseInt(value, 10);

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export default function envFinnhub(): EnvFinnhubConfig {
  const apiKey = process.env.FINNHUB_API_KEY;
  const defaultSymbolsRaw =
    process.env.FINNHUB_DEFAULT_SYMBOLS ?? "AAPL,MSFT,GOOGL,AMZN,TSLA";
  const pricePollIntervalMs =
    process.env.STOCK_PRICE_POLL_INTERVAL_MS ?? "5000";
  const quoteRefreshIntervalMs =
    process.env.FINNHUB_QUOTE_REFRESH_INTERVAL_MS ?? "60000";

  if (!apiKey) {
    throw new Error("Missing required environment variable: FINNHUB_API_KEY");
  }

  return {
    finnhub: {
      apiKey,
      defaultSymbols: defaultSymbolsRaw
        .split(",")
        .map((symbol) => symbol.trim().toUpperCase())
        .filter(Boolean),
      pricePollIntervalMs: parsePositiveInteger(pricePollIntervalMs, 5000),
      quoteRefreshIntervalMs: parsePositiveInteger(
        quoteRefreshIntervalMs,
        60000,
      ),
    },
  };
}
