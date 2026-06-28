import { ApiProperty } from "@nestjs/swagger";

export class UserDeviceDto {
  @ApiProperty({ example: "e2cb6a6a-7808-4dd3-808d-c0187e78b49d" })
  public id!: string;

  @ApiProperty({ example: "2c4ea53d-4a27-41c8-b7ad-47e19d4efb90" })
  public userId!: string;

  @ApiProperty({ example: "firebase-registration-token" })
  public fcmToken!: string;

  @ApiProperty({ example: "android", nullable: true })
  public platform!: string | null;

  @ApiProperty({ example: "2026-06-28T12:00:00.000Z" })
  public createdAt!: string;

  @ApiProperty({ example: "2026-06-28T12:00:00.000Z" })
  public updatedAt!: string;
}
