import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsOptional, IsString, Max, Min } from "class-validator";

export class ListStocksQueryDto {
  @ApiPropertyOptional({ example: "US" })
  @IsOptional()
  @IsString()
  public exchange?: string;

  @ApiPropertyOptional({ example: "apple" })
  @IsOptional()
  @IsString()
  public query?: string;

  @ApiPropertyOptional({ example: 50 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  public limit?: number;
}
