import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsIn, IsInt, IsOptional } from "class-validator";

const resolutions = ["1", "5", "15", "30", "60", "D", "W", "M"] as const;

export class StockCandlesQueryDto {
  @ApiPropertyOptional({ enum: resolutions, example: "D", type: String })
  @IsOptional()
  @IsIn(resolutions)
  public resolution?: string;

  @ApiPropertyOptional({ example: 1719532800 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  public from?: number;

  @ApiPropertyOptional({ example: 1719964800 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  public to?: number;
}
