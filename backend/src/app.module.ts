import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";

import { AlertsModule } from "./alerts/alerts.module";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import envAuth from "./configs/env.auth";
import envDatabase from "./configs/env.database";
import envFinnhub from "./configs/env.finnhub";
import envFirebase from "./configs/env.firebase";
import envGlobal from "./configs/env.global";
import { DatabaseModule } from "./database/database.module";
import { DevicesModule } from "./devices/devices.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { StocksModule } from "./stocks/stocks.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [envGlobal, envDatabase, envAuth, envFinnhub, envFirebase],
    }),
    ScheduleModule.forRoot(),
    DatabaseModule,
    AuthModule,
    UsersModule,
    StocksModule,
    AlertsModule,
    DevicesModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
