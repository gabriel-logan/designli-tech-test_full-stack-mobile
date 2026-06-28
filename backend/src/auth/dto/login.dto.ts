import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginDto {
  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  public email!: string;

  @ApiProperty({ example: "strong-password" })
  @IsString()
  @MinLength(6)
  public password!: string;
}
