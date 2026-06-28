import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

import { ListStocksQueryDto } from "./dto/list-stocks-query.dto";
import { StockCandlesQueryDto } from "./dto/stock-candles-query.dto";
import {
  StockCandleDto,
  StockChartItemDto,
  StockQuoteDto,
  StockSymbolDto,
} from "./dto/stock-response.dto";
import { StocksChartQueryDto } from "./dto/stocks-chart-query.dto";
import type {
  StockCandle,
  StockChartItem,
  StockQuote,
  StockSymbol,
} from "./stock.types";
import { StocksService } from "./stocks.service";

@ApiTags("stocks")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("stocks")
export class StocksController {
  constructor(private readonly stocksService: StocksService) {}

  @ApiOkResponse({ type: [StockSymbolDto] })
  @Get()
  async list(@Query() query: ListStocksQueryDto): Promise<StockSymbol[]> {
    return await this.stocksService.list(query);
  }

  @ApiOkResponse({ type: [StockChartItemDto] })
  @Get("summary")
  async summary(): Promise<StockChartItem[]> {
    return await this.stocksService.getChart(this.stocksService.defaultSymbols);
  }

  @ApiOkResponse({ type: [StockChartItemDto] })
  @Get("chart")
  async chart(@Query() query: StocksChartQueryDto): Promise<StockChartItem[]> {
    const symbols = query.symbols
      .split(",")
      .map((symbol) => symbol.trim())
      .filter(Boolean);

    return await this.stocksService.getChart(symbols);
  }

  @ApiOkResponse({ type: StockQuoteDto })
  @Get(":symbol/quote")
  async quote(@Param("symbol") symbol: string): Promise<StockQuote> {
    return await this.stocksService.getQuote(symbol);
  }

  @ApiOkResponse({ type: [StockCandleDto] })
  @Get(":symbol/candles")
  async candles(
    @Param("symbol") symbol: string,
    @Query() query: StockCandlesQueryDto,
  ): Promise<StockCandle[]> {
    return await this.stocksService.getCandles({
      symbol,
      resolution: query.resolution,
      from: query.from,
      to: query.to,
    });
  }
}
