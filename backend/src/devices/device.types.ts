export interface DeviceRecord {
  readonly id: string;
  readonly user_id: string;
  readonly fcm_token: string;
  readonly platform: string | null;
  readonly created_at: Date;
  readonly updated_at: Date;
}

export interface UserDevice {
  readonly id: string;
  readonly userId: string;
  readonly fcmToken: string;
  readonly platform: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
}
