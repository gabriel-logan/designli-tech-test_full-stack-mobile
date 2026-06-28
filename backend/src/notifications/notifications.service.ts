import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  cert,
  getApps,
  initializeApp,
  type ServiceAccount,
} from "firebase-admin/app";
import { getMessaging, type Messaging } from "firebase-admin/messaging";
import { readFileSync } from "node:fs";
import type { EnvFirebaseConfig } from "src/configs/env.firebase";
import { DevicesService } from "src/devices/devices.service";

interface StockAlertNotification {
  readonly userId: string;
  readonly symbol: string;
  readonly targetPrice: number;
  readonly currentPrice: number;
}

@Injectable()
export class NotificationsService implements OnModuleInit {
  private readonly logger = new Logger(NotificationsService.name);
  private messaging: Messaging | null = null;

  constructor(
    private readonly configService: ConfigService<EnvFirebaseConfig, true>,
    private readonly devicesService: DevicesService,
  ) {}

  onModuleInit(): void {
    const serviceAccountPath = this.configService.get(
      "firebase.serviceAccountPath",
      { infer: true },
    );

    if (!serviceAccountPath) {
      this.logger.warn("Firebase credentials not configured. Push disabled.");

      return;
    }

    const serviceAccount = JSON.parse(
      readFileSync(serviceAccountPath, "utf8"),
    ) as ServiceAccount;
    const app =
      getApps()[0] ?? initializeApp({ credential: cert(serviceAccount) });

    this.messaging = getMessaging(app);
  }

  async sendStockAlert(params: StockAlertNotification): Promise<void> {
    const tokens = await this.devicesService.listTokensByUser(params.userId);

    if (tokens.length === 0) {
      return;
    }

    if (!this.messaging) {
      this.logger.warn(
        `Skipped push for ${params.symbol}; Firebase is not configured`,
      );

      return;
    }

    await this.messaging.sendEachForMulticast({
      tokens,
      notification: {
        title: `${params.symbol} price alert`,
        body: `${params.symbol} reached ${params.currentPrice.toFixed(2)} (target ${params.targetPrice.toFixed(2)})`,
      },
      data: {
        type: "stock_alert",
        symbol: params.symbol,
        targetPrice: String(params.targetPrice),
        currentPrice: String(params.currentPrice),
      },
    });
  }
}
