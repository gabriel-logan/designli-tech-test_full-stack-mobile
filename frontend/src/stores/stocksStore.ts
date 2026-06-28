import { create } from "zustand";

import type { StockQuote } from "../types/api";

interface StocksStore {
  isConnected: boolean;
  quotesBySymbol: Record<string, StockQuote>;

  setIsConnected: (isConnected: boolean) => void;
  upsertQuotes: (quotes: StockQuote[]) => void;
}

export const useStocksStore = create<StocksStore>()(set => ({
  isConnected: false,
  quotesBySymbol: {},

  setIsConnected: isConnected =>
    set(() => ({
      isConnected,
    })),

  upsertQuotes: quotes =>
    set(state => {
      const nextQuotes = { ...state.quotesBySymbol };

      quotes.forEach(quote => {
        nextQuotes[quote.symbol] = quote;
      });

      return {
        quotesBySymbol: nextQuotes,
      };
    }),
}));
