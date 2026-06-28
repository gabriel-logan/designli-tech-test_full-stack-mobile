import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsString, MinLength } from "class-validator";

export class RegisterDto {
  @ApiProperty({ example: "Ada Lovelace" })
  @IsString()
  @MinLength(2)
  public name!: string;

  @ApiProperty({ example: "user@example.com" })
  @IsEmail()
  public email!: string;

  @ApiProperty({ example: "strong-password" })
  @IsString()
  @MinLength(6)
  public password!: string;
}
