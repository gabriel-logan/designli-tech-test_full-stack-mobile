import { Module } from "@nestjs/common";
import { AuthModule } from "src/auth/auth.module";

import { StocksController } from "./stocks.controller";
import { StocksGateway } from "./stocks.gateway";
import { StocksService } from "./stocks.service";

@Module({
  imports: [AuthModule],
  controllers: [StocksController],
  providers: [StocksService, StocksGateway],
  exports: [StocksService],
})
export class StocksModule {}
