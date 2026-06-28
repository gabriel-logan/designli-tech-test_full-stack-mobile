import apiInstance from "../../lib/api";
import type {
  ListStocksQuery,
  StockCandle,
  StockCandlesQuery,
  StockChartItem,
  StockQuote,
  StocksChartQuery,
  StockSymbol,
} from "../../types/api";

export async function getStocks(params?: ListStocksQuery) {
  const { data } = await apiInstance.get<StockSymbol[]>("/stocks", {
    params,
  });

  return data;
}

export async function getStocksSummary() {
  const { data } = await apiInstance.get<StockChartItem[]>("/stocks/summary");

  return data;
}

export async function getStocksChart(params: StocksChartQuery) {
  const { data } = await apiInstance.get<StockChartItem[]>("/stocks/chart", {
    params,
  });

  return data;
}

export async function getStockQuote(symbol: string) {
  const { data } = await apiInstance.get<StockQuote>(`/stocks/${symbol}/quote`);

  return data;
}

export async function getStockCandles(
  symbol: string,
  params?: StockCandlesQuery,
) {
  const { data } = await apiInstance.get<StockCandle[]>(
    `/stocks/${symbol}/candles`,
    {
      params,
    },
  );

  return data;
}
