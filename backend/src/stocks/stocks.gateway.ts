import { Logger } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import type { Server, Socket } from "socket.io";

import { StocksService } from "./stocks.service";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "stocks",
})
export class StocksGateway implements OnGatewayDisconnect {
  private readonly logger = new Logger(StocksGateway.name);
  private readonly clientSymbols = new Map<string, Set<string>>();

  @WebSocketServer()
  private readonly server!: Server;

  constructor(private readonly stocksService: StocksService) {}

  handleDisconnect(client: Socket): void {
    this.clientSymbols.delete(client.id);
  }

  @SubscribeMessage("subscribe")
  subscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { readonly symbols?: string[] },
  ): { readonly symbols: string[] } {
    const symbols = (payload.symbols ?? this.stocksService.getDefaultSymbols())
      .map((symbol) => this.stocksService.normalizeSymbol(symbol))
      .filter(Boolean);

    this.clientSymbols.set(client.id, new Set(symbols));

    return { symbols };
  }

  @Interval(30000)
  async publishQuotes(): Promise<void> {
    const symbols = new Set<string>();

    for (const subscribedSymbols of this.clientSymbols.values()) {
      subscribedSymbols.forEach((symbol) => symbols.add(symbol));
    }

    if (symbols.size === 0) {
      return;
    }

    try {
      const quotes = await Promise.all(
        [...symbols].map((symbol) => this.stocksService.getQuote(symbol)),
      );

      this.server.emit("quotes", quotes);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.warn(`Failed to publish stock quotes: ${message}`);
    }
  }
}
