import { ApiProperty } from "@nestjs/swagger";
import { IsString } from "class-validator";

export class StocksChartQueryDto {
  @ApiProperty({ example: "AAPL,MSFT,GOOGL" })
  @IsString()
  public symbols!: string;
}
