import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";
import { DatabaseModule } from "src/database/database.module";
import { NotificationsModule } from "src/notifications/notifications.module";
import { StocksModule } from "src/stocks/stocks.module";

import { AlertsController } from "./alerts.controller";
import { AlertsService } from "./alerts.service";

@Module({
  imports: [AuthModule, DatabaseModule, NotificationsModule, StocksModule],
  controllers: [AlertsController],
  providers: [AlertsService],
  exports: [AlertsService],
})
export class AlertsModule {}
