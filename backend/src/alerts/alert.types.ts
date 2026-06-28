export interface AlertRecord {
  readonly id: string;
  readonly user_id: string;
  readonly symbol: string;
  readonly target_price: string;
  readonly active: boolean;
  readonly triggered_at: Date | null;
  readonly last_triggered_price: string | null;
  readonly created_at: Date;
  readonly updated_at: Date;
}

export interface StockAlert {
  readonly id: string;
  readonly userId: string;
  readonly symbol: string;
  readonly targetPrice: number;
  readonly active: boolean;
  readonly triggeredAt: string | null;
  readonly lastTriggeredPrice: number | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}
