import { Injectable } from "@nestjs/common";
import { PostgresService } from "src/database/postgres.service";

import type { DeviceRecord, UserDevice } from "./device.types";

@Injectable()
export class DevicesService {
  constructor(private readonly postgresService: PostgresService) {}

  async register(params: {
    readonly userId: string;
    readonly fcmToken: string;
    readonly platform?: string;
  }): Promise<UserDevice> {
    const result = await this.postgresService.insert<DeviceRecord>(
      `
        INSERT INTO user_devices (user_id, fcm_token, platform)
        VALUES ($1, $2, $3)
        ON CONFLICT (fcm_token)
        DO UPDATE SET
          user_id = EXCLUDED.user_id,
          platform = EXCLUDED.platform,
          updated_at = now()
        RETURNING *
      `,
      [params.userId, params.fcmToken, params.platform],
    );

    return this.mapDevice(result.rows[0]);
  }

  async listByUser(userId: string): Promise<UserDevice[]> {
    const rows = await this.postgresService.select<DeviceRecord>(
      `
        SELECT *
        FROM user_devices
        WHERE user_id = $1
        ORDER BY updated_at DESC
      `,
      [userId],
    );

    return rows.map((row) => this.mapDevice(row));
  }

  async listTokensByUser(userId: string): Promise<string[]> {
    const devices = await this.listByUser(userId);

    return devices.map((device) => device.fcmToken);
  }

  async deleteToken(userId: string, fcmToken: string): Promise<void> {
    await this.postgresService.delete(
      `
        DELETE FROM user_devices
        WHERE user_id = $1 AND fcm_token = $2
      `,
      [userId, fcmToken],
    );
  }

  private mapDevice(device: DeviceRecord): UserDevice {
    return {
      id: device.id,
      userId: device.user_id,
      fcmToken: device.fcm_token,
      platform: device.platform,
      createdAt: device.created_at.toISOString(),
      updatedAt: device.updated_at.toISOString(),
    };
  }
}
