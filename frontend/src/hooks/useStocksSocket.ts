import { useEffect, useMemo, useRef } from "react";
import { io } from "socket.io-client";

import { defaultStockSymbols, socketBaseUrl } from "../constants";
import { useStocksStore } from "../stores/stocksStore";
import type { StockQuote, SubscribeStocksResponse } from "../types/api";

const stocksSocket = io(`${socketBaseUrl}/stocks`, {
  autoConnect: false,
  transports: ["websocket"],
});
const activeSubscriptions = new Map<number, string[]>();

let nextSubscriptionId = 0;
let socketListenersRegistered = false;

function normalizeSymbols(symbols: string[]) {
  return symbols
    .map(symbol => symbol.trim().toUpperCase())
    .filter((symbol, index, normalizedSymbols) => {
      return !!symbol && normalizedSymbols.indexOf(symbol) === index;
    });
}

function getSubscribedSymbols() {
  return normalizeSymbols([...activeSubscriptions.values()].flat());
}

function emitSubscription() {
  const subscribedSymbols = getSubscribedSymbols();

  if (subscribedSymbols.length === 0) {
    stocksSocket.disconnect();

    return;
  }

  stocksSocket.connect();

  if (stocksSocket.connected) {
    stocksSocket.emit(
      "subscribe",
      { symbols: subscribedSymbols },
      (_response: SubscribeStocksResponse) => {},
    );
  }
}

function registerSocketListeners() {
  if (socketListenersRegistered) {
    return;
  }

  stocksSocket.on("connect", () => {
    useStocksStore.getState().setIsConnected(true);
    emitSubscription();
  });
  stocksSocket.on("disconnect", () => {
    useStocksStore.getState().setIsConnected(false);
  });
  stocksSocket.on("quotes", (quotes: StockQuote[]) => {
    useStocksStore.getState().upsertQuotes(quotes);
  });

  socketListenersRegistered = true;
}

export function useStocksSocket(symbols?: string[]) {
  const subscriptionId = useRef<number | null>(null);
  const symbolsKey = (symbols ?? defaultStockSymbols).join(",");
  const requestedSymbols = useMemo(
    () => normalizeSymbols(symbolsKey.split(",")),
    [symbolsKey],
  );
  const quotesBySymbol = useStocksStore(state => state.quotesBySymbol);
  const isConnected = useStocksStore(state => state.isConnected);

  useEffect(() => {
    registerSocketListeners();

    if (subscriptionId.current === null) {
      subscriptionId.current = nextSubscriptionId;
      nextSubscriptionId += 1;
    }

    activeSubscriptions.set(subscriptionId.current, requestedSymbols);
    emitSubscription();

    return () => {
      if (subscriptionId.current !== null) {
        activeSubscriptions.delete(subscriptionId.current);
      }

      emitSubscription();
    };
  }, [requestedSymbols, symbolsKey]);

  return {
    isConnected,
    quotes: requestedSymbols
      .map(symbol => quotesBySymbol[symbol])
      .filter((quote): quote is StockQuote => !!quote),
  };
}
