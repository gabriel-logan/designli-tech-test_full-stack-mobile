import { Injectable, ServiceUnavailableException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import type { EnvFinnhubConfig } from "src/configs/env.finnhub";

import type {
  StockCandle,
  StockChartItem,
  StockQuote,
  StockSymbol,
} from "./stock.types";

interface FinnhubSymbolResponse {
  readonly currency?: string;
  readonly description?: string;
  readonly displaySymbol?: string;
  readonly symbol?: string;
  readonly type?: string;
}

interface FinnhubSearchResponse {
  readonly result?: FinnhubSymbolResponse[];
}

interface FinnhubQuoteResponse {
  readonly c?: number;
  readonly d?: number;
  readonly dp?: number;
  readonly h?: number;
  readonly l?: number;
  readonly o?: number;
  readonly pc?: number;
  readonly t?: number;
}

interface FinnhubCandleResponse {
  readonly c?: number[];
  readonly h?: number[];
  readonly l?: number[];
  readonly o?: number[];
  readonly s?: string;
  readonly t?: number[];
  readonly v?: number[];
}

@Injectable()
export class StocksService {
  private readonly baseUrl = "https://finnhub.io/api/v1";

  constructor(
    private readonly configService: ConfigService<EnvFinnhubConfig, true>,
  ) {}

  async list(params: {
    readonly exchange?: string;
    readonly query?: string;
    readonly limit?: number;
  }): Promise<StockSymbol[]> {
    if (params.query) {
      const data = await this.request<FinnhubSearchResponse>("search", {
        q: params.query,
      });

      return (data.result ?? [])
        .map((item) => this.mapSymbol(item))
        .filter((item): item is StockSymbol => item !== null)
        .slice(0, params.limit ?? 50);
    }

    const data = await this.request<FinnhubSymbolResponse[]>("stock/symbol", {
      exchange: params.exchange ?? "US",
    });

    return data
      .map((item) => this.mapSymbol(item))
      .filter((item): item is StockSymbol => item !== null)
      .slice(0, params.limit ?? 50);
  }

  async getQuote(symbol: string): Promise<StockQuote> {
    const normalizedSymbol = this.normalizeSymbol(symbol);
    const data = await this.request<FinnhubQuoteResponse>("quote", {
      symbol: normalizedSymbol,
    });

    return {
      symbol: normalizedSymbol,
      current: data.c ?? 0,
      change: data.d ?? 0,
      percentChange: data.dp ?? 0,
      high: data.h ?? 0,
      low: data.l ?? 0,
      open: data.o ?? 0,
      previousClose: data.pc ?? 0,
      timestamp: data.t ?? Math.floor(Date.now() / 1000),
    };
  }

  async getCandles(params: {
    readonly symbol: string;
    readonly resolution?: string;
    readonly from?: number;
    readonly to?: number;
  }): Promise<StockCandle[]> {
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysAgo = now - 30 * 24 * 60 * 60;
    const data = await this.request<FinnhubCandleResponse>("stock/candle", {
      symbol: this.normalizeSymbol(params.symbol),
      resolution: params.resolution ?? "D",
      from: String(params.from ?? thirtyDaysAgo),
      to: String(params.to ?? now),
    });

    if (data.s !== "ok") {
      return [];
    }

    return (data.t ?? []).map((timestamp, index) => ({
      timestamp,
      close: data.c?.[index] ?? 0,
      high: data.h?.[index] ?? 0,
      low: data.l?.[index] ?? 0,
      open: data.o?.[index] ?? 0,
      volume: data.v?.[index] ?? 0,
    }));
  }

  async getChart(symbols: string[]): Promise<StockChartItem[]> {
    const normalizedSymbols = symbols.map((symbol) =>
      this.normalizeSymbol(symbol),
    );

    return await Promise.all(
      normalizedSymbols.map(async (symbol) => ({
        symbol,
        quote: await this.getQuote(symbol),
        candles: await this.getCandles({ symbol }),
      })),
    );
  }

  getDefaultSymbols(): string[] {
    const finnhub = this.configService.get("finnhub", { infer: true });

    return finnhub.defaultSymbols;
  }

  getPollIntervalMs(): number {
    const finnhub = this.configService.get("finnhub", { infer: true });

    return finnhub.pricePollIntervalMs;
  }

  normalizeSymbol(symbol: string): string {
    return symbol.trim().toUpperCase();
  }

  private mapSymbol(item: FinnhubSymbolResponse): StockSymbol | null {
    if (!item.symbol) {
      return null;
    }

    return {
      symbol: item.symbol,
      description: item.description ?? item.symbol,
      displaySymbol: item.displaySymbol ?? item.symbol,
      type: item.type ?? "Common Stock",
      currency: item.currency,
    };
  }

  private async request<T>(
    path: string,
    query: Record<string, string | undefined>,
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}/${path}`);
    const finnhub = this.configService.get("finnhub", { infer: true });

    Object.entries({ ...query, token: finnhub.apiKey }).forEach(
      ([key, value]) => {
        if (value) {
          url.searchParams.set(key, value);
        }
      },
    );

    const response = await fetch(url);

    if (!response.ok) {
      throw new ServiceUnavailableException("Finnhub request failed");
    }

    return (await response.json()) as T;
  }
}
