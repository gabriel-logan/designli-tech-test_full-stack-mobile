import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsOptional, IsString, MinLength } from "class-validator";

export class RegisterDeviceDto {
  @ApiProperty({ example: "firebase-registration-token" })
  @IsString()
  @MinLength(10)
  public fcmToken!: string;

  @ApiPropertyOptional({ example: "android" })
  @IsOptional()
  @IsString()
  public platform?: string;
}
