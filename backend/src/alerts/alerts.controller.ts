import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { CurrentUser } from "src/auth/current-user.decorator";
import type { AuthenticatedUser } from "src/auth/jwt-auth.guard";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

import type { StockAlert } from "./alert.types";
import { AlertsService } from "./alerts.service";
import { CreateAlertDto } from "./dto/create-alert.dto";
import { UpdateAlertDto } from "./dto/update-alert.dto";

@ApiTags("alerts")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("alerts")
export class AlertsController {
  constructor(private readonly alertsService: AlertsService) {}

  @Get()
  async list(@CurrentUser() user: AuthenticatedUser): Promise<StockAlert[]> {
    return await this.alertsService.listByUser(user.sub);
  }

  @Post()
  async create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateAlertDto,
  ): Promise<StockAlert> {
    return await this.alertsService.create({
      userId: user.sub,
      symbol: dto.symbol,
      targetPrice: dto.targetPrice,
    });
  }

  @Patch(":id")
  async update(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
    @Body() dto: UpdateAlertDto,
  ): Promise<StockAlert> {
    return await this.alertsService.update(id, {
      userId: user.sub,
      targetPrice: dto.targetPrice,
      active: dto.active,
    });
  }

  @Delete(":id")
  async delete(
    @CurrentUser() user: AuthenticatedUser,
    @Param("id") id: string,
  ): Promise<void> {
    await this.alertsService.delete(id, user.sub);
  }
}
