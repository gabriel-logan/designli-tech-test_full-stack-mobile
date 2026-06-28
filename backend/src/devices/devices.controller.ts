import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CurrentUser } from "src/auth/current-user.decorator";
import type { AuthenticatedUser } from "src/auth/jwt-auth.guard";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

import type { UserDevice } from "./device.types";
import { DevicesService } from "./devices.service";
import { RegisterDeviceDto } from "./dto/register-device.dto";
import { UserDeviceDto } from "./dto/user-device-response.dto";

@ApiTags("devices")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("devices")
export class DevicesController {
  constructor(private readonly devicesService: DevicesService) {}

  @ApiOkResponse({ type: [UserDeviceDto] })
  @Get()
  async list(@CurrentUser() user: AuthenticatedUser): Promise<UserDevice[]> {
    return await this.devicesService.listByUser(user.sub);
  }

  @ApiOkResponse({ type: UserDeviceDto })
  @Post()
  async register(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RegisterDeviceDto,
  ): Promise<UserDevice> {
    return await this.devicesService.register({
      userId: user.sub,
      fcmToken: dto.fcmToken,
      platform: dto.platform,
    });
  }

  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete()
  async delete(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: RegisterDeviceDto,
  ): Promise<void> {
    await this.devicesService.deleteToken(user.sub, dto.fcmToken);
  }
}
