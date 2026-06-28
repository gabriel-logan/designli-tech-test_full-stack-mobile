import { ApiProperty } from "@nestjs/swagger";
import { IsNumber, IsString, Min } from "class-validator";

export class CreateAlertDto {
  @ApiProperty({ example: "AAPL" })
  @IsString()
  public symbol!: string;

  @ApiProperty({ example: 220.5 })
  @IsNumber()
  @Min(0.01)
  public targetPrice!: number;
}
