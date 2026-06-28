import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsOptional, Min } from "class-validator";

export class UpdateAlertDto {
  @ApiPropertyOptional({ example: 225 })
  @IsOptional()
  @IsNumber()
  @Min(0.01)
  public targetPrice?: number;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  public active?: boolean;
}
