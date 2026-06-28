import { ApiProperty } from "@nestjs/swagger";

export class AuthUserDto {
  @ApiProperty({ example: "2c4ea53d-4a27-41c8-b7ad-47e19d4efb90" })
  public id!: string;

  @ApiProperty({ example: "user@example.com" })
  public email!: string;

  @ApiProperty({ example: "Ada Lovelace" })
  public name!: string;

  @ApiProperty({ example: "2026-06-28T12:00:00.000Z" })
  public createdAt!: string;
}

export class AuthResponseDto {
  @ApiProperty({ example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." })
  public accessToken!: string;

  @ApiProperty({ type: AuthUserDto })
  public user!: AuthUserDto;
}
