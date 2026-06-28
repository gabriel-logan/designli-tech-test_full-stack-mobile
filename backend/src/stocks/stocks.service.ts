import { HttpService } from "@nestjs/axios";
import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AxiosError } from "axios";
import { firstValueFrom } from "rxjs";
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

interface LiveQuoteState {
  anchor: StockQuote;
  current: number;
  lastGeneratedAt: number;
  lastFetchedAt: number;
  phase: number;
  secondaryPhase: number;
  stepPercentPerSecond: number;
  volatility: number;
}

@Injectable()
export class StocksService {
  private readonly logger = new Logger(StocksService.name);
  public readonly defaultSymbols: string[];
  public readonly pricePollIntervalMs: number;

  private readonly apiKey: string;
  private readonly baseUrl = "https://finnhub.io/api/v1";
  private readonly quoteStates = new Map<string, LiveQuoteState>();
  private readonly quoteRequests = new Map<string, Promise<StockQuote>>();
  private readonly quoteRefreshIntervalMs: number;

  constructor(
    configService: ConfigService<EnvFinnhubConfig, true>,
    private readonly httpService: HttpService,
  ) {
    const finnhub = configService.get("finnhub", { infer: true });

    this.apiKey = finnhub.apiKey;
    this.defaultSymbols = finnhub.defaultSymbols;
    this.pricePollIntervalMs = finnhub.pricePollIntervalMs;
    this.quoteRefreshIntervalMs = finnhub.quoteRefreshIntervalMs;
  }

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
    const now = Date.now();
    const cachedState = this.quoteStates.get(normalizedSymbol);
    const shouldRefresh =
      !cachedState ||
      now - cachedState.lastFetchedAt >= this.quoteRefreshIntervalMs;

    if (shouldRefresh) {
      try {
        const quote = await this.fetchQuote(normalizedSymbol);

        this.quoteStates.set(
          normalizedSymbol,
          this.createLiveQuoteState(quote, cachedState, now),
        );
      } catch (error) {
        if (!cachedState) {
          throw error;
        }

        this.logger.warn(
          `Using cached live quote for ${normalizedSymbol}: ${this.getErrorMessage(error)}`,
        );
      }
    }

    const state = this.quoteStates.get(normalizedSymbol);

    if (!state) {
      throw new ServiceUnavailableException("Stock quote unavailable");
    }

    return this.generateLiveQuote(state, now);
  }

  async fetchQuote(symbol: string): Promise<StockQuote> {
    const normalizedSymbol = this.normalizeSymbol(symbol);
    const existingRequest = this.quoteRequests.get(normalizedSymbol);

    if (existingRequest) {
      return await existingRequest;
    }

    const request = this.fetchFinnhubQuote(normalizedSymbol).finally(() => {
      this.quoteRequests.delete(normalizedSymbol);
    });

    this.quoteRequests.set(normalizedSymbol, request);

    return await request;
  }

  private async fetchFinnhubQuote(symbol: string): Promise<StockQuote> {
    const data = await this.request<FinnhubQuoteResponse>("quote", {
      symbol,
    });

    return {
      symbol,
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
    const symbol = this.normalizeSymbol(params.symbol);

    let data: FinnhubCandleResponse;

    try {
      data = await this.request<FinnhubCandleResponse>("stock/candle", {
        symbol,
        resolution: params.resolution ?? "D",
        from: String(params.from ?? thirtyDaysAgo),
        to: String(params.to ?? now),
      });
    } catch (error) {
      this.logger.warn(
        `Failed to load candles for ${symbol}: ${this.getErrorMessage(error)}`,
      );

      return [];
    }

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
    const chartItems = await Promise.all(
      normalizedSymbols.map((symbol) => this.getChartItem(symbol)),
    );

    return chartItems.filter((item): item is StockChartItem => item !== null);
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

  private async getChartItem(symbol: string): Promise<StockChartItem | null> {
    try {
      return {
        symbol,
        quote: await this.getQuote(symbol),
        candles: await this.getCandles({ symbol }),
      };
    } catch (error) {
      this.logger.warn(
        `Failed to load quote for ${symbol}: ${this.getErrorMessage(error)}`,
      );

      return null;
    }
  }

  private getErrorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }

  private createLiveQuoteState(
    quote: StockQuote,
    currentState: LiveQuoteState | undefined,
    now: number,
  ): LiveQuoteState {
    const seed = this.getSymbolSeed(quote.symbol);
    const basePrice =
      quote.current > 0 ? quote.current : (currentState?.current ?? 1);

    return {
      anchor: {
        ...quote,
        current: basePrice,
        previousClose:
          quote.previousClose > 0 ? quote.previousClose : basePrice,
        open: quote.open > 0 ? quote.open : basePrice,
        high: Math.max(quote.high, basePrice),
        low: quote.low > 0 ? Math.min(quote.low, basePrice) : basePrice,
      },
      current: currentState?.current ?? basePrice,
      lastGeneratedAt: currentState?.lastGeneratedAt ?? now,
      lastFetchedAt: now,
      phase: (seed % 6283) / 1000,
      secondaryPhase: ((seed * 17) % 6283) / 1000,
      stepPercentPerSecond: 0.0008 + (seed % 5) * 0.00012,
      volatility: 0.006 + (seed % 9) * 0.001,
    };
  }

  private generateLiveQuote(state: LiveQuoteState, now: number): StockQuote {
    const elapsedSeconds = Math.max((now - state.lastGeneratedAt) / 1000, 0);
    const anchorPrice = Math.max(state.anchor.current, 1);
    const wave =
      Math.sin(now / 3500 + state.phase) * state.volatility +
      Math.sin(now / 9100 + state.secondaryPhase) * state.volatility * 0.45;
    const targetPrice = anchorPrice * (1 + wave);
    const maxStep = Math.max(
      anchorPrice * state.stepPercentPerSecond * elapsedSeconds,
      0.01,
    );

    state.current = this.moveToward(state.current, targetPrice, maxStep);
    state.lastGeneratedAt = now;

    const current = this.roundPrice(state.current);
    const previousClose =
      state.anchor.previousClose > 0 ? state.anchor.previousClose : anchorPrice;
    const change = this.roundPrice(current - previousClose);
    const percentChange =
      previousClose > 0 ? this.roundPrice((change / previousClose) * 100) : 0;

    return {
      ...state.anchor,
      current,
      change,
      percentChange,
      high: this.roundPrice(Math.max(state.anchor.high, current)),
      low: this.roundPrice(Math.min(state.anchor.low, current)),
      timestamp: Math.floor(now / 1000),
    };
  }

  private moveToward(current: number, target: number, maxStep: number): number {
    const distance = target - current;

    if (Math.abs(distance) <= maxStep) {
      return target;
    }

    return current + Math.sign(distance) * maxStep;
  }

  private roundPrice(value: number): number {
    return Number(value.toFixed(2));
  }

  private getSymbolSeed(symbol: string): number {
    return [...symbol].reduce(
      (total, character) => total + character.charCodeAt(0),
      0,
    );
  }

  private async request<T>(
    path: string,
    query: Record<string, string | undefined>,
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}/${path}`);

    Object.entries({ ...query, token: this.apiKey }).forEach(([key, value]) => {
      if (value) {
        url.searchParams.set(key, value);
      }
    });

    try {
      const response = await firstValueFrom(this.httpService.get<T>(url.href));

      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        this.logger.warn(
          `Finnhub ${path} request failed with status ${error.response?.status ?? "unknown"}`,
        );
      }

      throw new ServiceUnavailableException("Finnhub request failed");
    }
  }
}
