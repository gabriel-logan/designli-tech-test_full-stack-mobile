import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "src/auth/auth.module";
import envFinnhub from "src/configs/env.finnhub";

import { StocksController } from "./stocks.controller";
import { StocksGateway } from "./stocks.gateway";
import { StocksService } from "./stocks.service";

@Module({
  imports: [
    ConfigModule.forFeature(envFinnhub),
    HttpModule.register({
      maxRedirects: 3,
      timeout: 10000,
    }),
    AuthModule,
  ],
  controllers: [StocksController],
  providers: [StocksService, StocksGateway],
  exports: [StocksService],
})
export class StocksModule {}
