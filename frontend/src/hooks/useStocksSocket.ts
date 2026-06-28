import { useEffect, useState } from "react";
import { io } from "socket.io-client";

import { socketBaseUrl } from "../constants";
import type { StockQuote, SubscribeStocksResponse } from "../types/api";

const stocksSocket = io(`${socketBaseUrl}/stocks`, {
  autoConnect: false,
  transports: ["websocket"],
});

export function useStocksSocket(symbols?: string[]) {
  const [quotes, setQuotes] = useState<StockQuote[]>([]);
  const [isConnected, setIsConnected] = useState(stocksSocket.connected);

  useEffect(() => {
    function subscribe() {
      setIsConnected(true);

      stocksSocket.emit(
        "subscribe",
        { symbols },
        (_response: SubscribeStocksResponse) => {},
      );
    }

    stocksSocket.on("connect", subscribe);
    stocksSocket.on("disconnect", () => setIsConnected(false));
    stocksSocket.on("quotes", setQuotes);
    stocksSocket.connect();

    if (stocksSocket.connected) {
      subscribe();
    }

    return () => {
      stocksSocket.off("connect", subscribe);
      stocksSocket.off("disconnect");
      stocksSocket.off("quotes", setQuotes);
      stocksSocket.disconnect();
    };
  }, [symbols]);

  return {
    isConnected,
    quotes,
  };
}
