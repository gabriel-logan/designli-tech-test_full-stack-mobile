import {
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from "@nestjs/websockets";
import type { Server, Socket } from "socket.io";

import type { StockQuote } from "./stock.types";
import { StocksService } from "./stocks.service";

@WebSocketGateway({
  cors: {
    origin: "*",
  },
  namespace: "stocks",
})
export class StocksGateway
  implements OnGatewayDisconnect, OnModuleDestroy, OnModuleInit
{
  private readonly logger = new Logger(StocksGateway.name);
  private readonly clientSymbols = new Map<string, Set<string>>();
  private isPublishingQuotes = false;
  private publishTimer?: NodeJS.Timeout;

  @WebSocketServer()
  private readonly server!: Server;

  constructor(private readonly stocksService: StocksService) {}

  onModuleInit(): void {
    this.publishTimer = setInterval(() => {
      void this.publishQuotes();
    }, this.stocksService.pricePollIntervalMs);
  }

  onModuleDestroy(): void {
    if (this.publishTimer) {
      clearInterval(this.publishTimer);
    }
  }

  handleDisconnect(client: Socket): void {
    this.clientSymbols.delete(client.id);
  }

  @SubscribeMessage("subscribe")
  subscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { readonly symbols?: string[] },
  ): { readonly symbols: string[] } {
    const symbols = (payload.symbols ?? this.stocksService.defaultSymbols)
      .map((symbol) => this.stocksService.normalizeSymbol(symbol))
      .filter(Boolean);

    this.clientSymbols.set(client.id, new Set(symbols));
    void this.publishClientQuotes(client, symbols);

    return { symbols };
  }

  async publishQuotes(): Promise<void> {
    if (this.isPublishingQuotes) {
      return;
    }

    const symbols = new Set<string>();

    for (const subscribedSymbols of this.clientSymbols.values()) {
      subscribedSymbols.forEach((symbol) => symbols.add(symbol));
    }

    if (symbols.size === 0) {
      return;
    }

    this.isPublishingQuotes = true;

    try {
      const quotes = await this.loadQuotes(symbols);

      this.server.emit("quotes", quotes);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.warn(`Failed to publish stock quotes: ${message}`);
    } finally {
      this.isPublishingQuotes = false;
    }
  }

  private async publishClientQuotes(
    client: Socket,
    symbols: string[],
  ): Promise<void> {
    try {
      client.emit("quotes", await this.loadQuotes(symbols));
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);

      this.logger.warn(
        `Failed to publish initial stock quotes for ${client.id}: ${message}`,
      );
    }
  }

  private async loadQuotes(symbols: Iterable<string>): Promise<StockQuote[]> {
    return await Promise.all(
      [...symbols].map((symbol) => this.stocksService.getQuote(symbol)),
    );
  }
}
