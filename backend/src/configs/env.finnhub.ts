export interface EnvFinnhubConfig {
  readonly finnhub: {
    readonly apiKey: string;
    readonly defaultSymbols: string[];
    readonly pricePollIntervalMs: number;
  };
}

export default function envFinnhub(): EnvFinnhubConfig {
  const apiKey = process.env.FINNHUB_API_KEY;
  const defaultSymbolsRaw =
    process.env.FINNHUB_DEFAULT_SYMBOLS ?? "AAPL,MSFT,GOOGL,AMZN,TSLA";
  const pricePollIntervalMs =
    process.env.STOCK_PRICE_POLL_INTERVAL_MS ?? "30000";

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
      pricePollIntervalMs: Number.parseInt(pricePollIntervalMs, 10),
    },
  };
}
