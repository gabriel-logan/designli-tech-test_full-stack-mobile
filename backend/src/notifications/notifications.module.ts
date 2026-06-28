import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import envFirebase from "src/configs/env.firebase";
import { DevicesModule } from "src/devices/devices.module";

import { NotificationsService } from "./notifications.service";

@Module({
  imports: [ConfigModule.forFeature(envFirebase), DevicesModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
