import { ApiProperty } from "@nestjs/swagger";

export class StockAlertDto {
  @ApiProperty({ example: "f0547ed0-88dc-4b11-b68d-ccfe420f2d20" })
  public id!: string;

  @ApiProperty({ example: "2c4ea53d-4a27-41c8-b7ad-47e19d4efb90" })
  public userId!: string;

  @ApiProperty({ example: "AAPL" })
  public symbol!: string;

  @ApiProperty({ example: 220.5 })
  public targetPrice!: number;

  @ApiProperty({ example: true })
  public active!: boolean;

  @ApiProperty({ example: null, nullable: true })
  public triggeredAt!: string | null;

  @ApiProperty({ example: null, nullable: true })
  public lastTriggeredPrice!: number | null;

  @ApiProperty({ example: "2026-06-28T12:00:00.000Z" })
  public createdAt!: string;

  @ApiProperty({ example: "2026-06-28T12:00:00.000Z" })
  public updatedAt!: string;
}
