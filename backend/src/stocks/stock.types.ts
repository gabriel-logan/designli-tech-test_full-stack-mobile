export interface StockSymbol {
  readonly symbol: string;
  readonly description: string;
  readonly displaySymbol: string;
  readonly type: string;
  readonly currency?: string;
}

export interface StockQuote {
  readonly symbol: string;
  readonly current: number;
  readonly change: number;
  readonly percentChange: number;
  readonly high: number;
  readonly low: number;
  readonly open: number;
  readonly previousClose: number;
  readonly timestamp: number;
}

export interface StockCandle {
  readonly close: number;
  readonly high: number;
  readonly low: number;
  readonly open: number;
  readonly timestamp: number;
  readonly volume: number;
}

export interface StockChartItem {
  readonly symbol: string;
  readonly quote: StockQuote;
  readonly candles: StockCandle[];
}
