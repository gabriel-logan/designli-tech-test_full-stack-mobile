import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import envDatabase from "../configs/env.database";
import { PostgresService } from "./postgres.service";

@Global()
@Module({
  imports: [ConfigModule.forFeature(envDatabase)],
  providers: [PostgresService],
  exports: [PostgresService],
})
export class DatabaseModule {}
