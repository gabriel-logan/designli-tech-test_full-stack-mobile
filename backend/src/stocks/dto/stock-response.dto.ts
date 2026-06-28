import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class StockSymbolDto {
  @ApiProperty({ example: "AAPL" })
  public symbol!: string;

  @ApiProperty({ example: "Apple Inc" })
  public description!: string;

  @ApiProperty({ example: "AAPL" })
  public displaySymbol!: string;

  @ApiProperty({ example: "Common Stock" })
  public type!: string;

  @ApiPropertyOptional({ example: "USD" })
  public currency?: string;
}

export class StockQuoteDto {
  @ApiProperty({ example: "AAPL" })
  public symbol!: string;

  @ApiProperty({ example: 220.5 })
  public current!: number;

  @ApiProperty({ example: 1.25 })
  public change!: number;

  @ApiProperty({ example: 0.57 })
  public percentChange!: number;

  @ApiProperty({ example: 221.1 })
  public high!: number;

  @ApiProperty({ example: 217.8 })
  public low!: number;

  @ApiProperty({ example: 218.4 })
  public open!: number;

  @ApiProperty({ example: 219.25 })
  public previousClose!: number;

  @ApiProperty({ example: 1719964800 })
  public timestamp!: number;
}

export class StockCandleDto {
  @ApiProperty({ example: 220.5 })
  public close!: number;

  @ApiProperty({ example: 221.1 })
  public high!: number;

  @ApiProperty({ example: 217.8 })
  public low!: number;

  @ApiProperty({ example: 218.4 })
  public open!: number;

  @ApiProperty({ example: 1719964800 })
  public timestamp!: number;

  @ApiProperty({ example: 1023400 })
  public volume!: number;
}

export class StockChartItemDto {
  @ApiProperty({ example: "AAPL" })
  public symbol!: string;

  @ApiProperty({ type: StockQuoteDto })
  public quote!: StockQuoteDto;

  @ApiProperty({ type: [StockCandleDto] })
  public candles!: StockCandleDto[];
}
