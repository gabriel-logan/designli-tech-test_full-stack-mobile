import { Module } from "@nestjs/common";
import { DevicesModule } from "src/devices/devices.module";

import { NotificationsService } from "./notifications.service";

@Module({
  imports: [DevicesModule],
  providers: [NotificationsService],
  exports: [NotificationsService],
})
export class NotificationsModule {}
