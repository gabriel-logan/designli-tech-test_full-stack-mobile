import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Interval } from "@nestjs/schedule";
import { PostgresService } from "src/database/postgres.service";
import { NotificationsService } from "src/notifications/notifications.service";
import { StocksService } from "src/stocks/stocks.service";

import type { AlertRecord, StockAlert } from "./alert.types";

@Injectable()
export class AlertsService {
  private readonly logger = new Logger(AlertsService.name);

  constructor(
    private readonly postgresService: PostgresService,
    private readonly stocksService: StocksService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async create(params: {
    readonly userId: string;
    readonly symbol: string;
    readonly targetPrice: number;
  }): Promise<StockAlert> {
    const result = await this.postgresService.insert<AlertRecord>(
      `
        INSERT INTO stock_alerts (user_id, symbol, target_price)
        VALUES ($1, $2, $3)
        RETURNING *
      `,
      [
        params.userId,
        this.stocksService.normalizeSymbol(params.symbol),
        params.targetPrice,
      ],
    );

    return this.mapAlert(result.rows[0]);
  }

  async listByUser(userId: string): Promise<StockAlert[]> {
    const rows = await this.postgresService.select<AlertRecord>(
      `
        SELECT *
        FROM stock_alerts
        WHERE user_id = $1
        ORDER BY created_at DESC
      `,
      [userId],
    );

    return rows.map((row) => this.mapAlert(row));
  }

  async update(
    id: string,
    params: {
      readonly userId: string;
      readonly targetPrice?: number;
      readonly active?: boolean;
    },
  ): Promise<StockAlert> {
    const result = await this.postgresService.update<AlertRecord>(
      `
        UPDATE stock_alerts
        SET
          target_price = COALESCE($3, target_price),
          active = COALESCE($4, active),
          triggered_at = CASE WHEN $4 = true THEN NULL ELSE triggered_at END,
          last_triggered_price = CASE WHEN $4 = true THEN NULL ELSE last_triggered_price END,
          updated_at = now()
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `,
      [id, params.userId, params.targetPrice, params.active],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException("Alert not found");
    }

    return this.mapAlert(result.rows[0]);
  }

  async delete(id: string, userId: string): Promise<void> {
    const result = await this.postgresService.delete(
      `
        DELETE FROM stock_alerts
        WHERE id = $1 AND user_id = $2
      `,
      [id, userId],
    );

    if (result.rowCount === 0) {
      throw new NotFoundException("Alert not found");
    }
  }

  @Interval(30000)
  async processActiveAlerts(): Promise<void> {
    const rows = await this.postgresService.select<AlertRecord>(
      `
        SELECT *
        FROM stock_alerts
        WHERE active = true
        ORDER BY created_at ASC
      `,
    );

    if (rows.length === 0) {
      return;
    }

    const quotesBySymbol = new Map<string, number>();

    for (const alert of rows) {
      try {
        const currentPrice =
          quotesBySymbol.get(alert.symbol) ??
          (await this.stocksService.getQuote(alert.symbol)).current;

        quotesBySymbol.set(alert.symbol, currentPrice);

        if (currentPrice >= Number(alert.target_price)) {
          await this.triggerAlert(alert, currentPrice);
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);

        this.logger.warn(`Failed to process alert ${alert.id}: ${message}`);
      }
    }
  }

  private async triggerAlert(
    alert: AlertRecord,
    currentPrice: number,
  ): Promise<void> {
    await this.postgresService.update(
      `
        UPDATE stock_alerts
        SET active = false,
            triggered_at = now(),
            last_triggered_price = $2,
            updated_at = now()
        WHERE id = $1
      `,
      [alert.id, currentPrice],
    );

    await this.notificationsService.sendStockAlert({
      userId: alert.user_id,
      symbol: alert.symbol,
      targetPrice: Number(alert.target_price),
      currentPrice,
    });
  }

  private mapAlert(alert: AlertRecord): StockAlert {
    return {
      id: alert.id,
      userId: alert.user_id,
      symbol: alert.symbol,
      targetPrice: Number(alert.target_price),
      active: alert.active,
      triggeredAt: alert.triggered_at?.toISOString() ?? null,
      lastTriggeredPrice: alert.last_triggered_price
        ? Number(alert.last_triggered_price)
        : null,
      createdAt: alert.created_at.toISOString(),
      updatedAt: alert.updated_at.toISOString(),
    };
  }
}
