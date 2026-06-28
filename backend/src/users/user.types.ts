export interface UserRecord {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly password_hash: string;
  readonly created_at: Date;
  readonly updated_at: Date;
}

export interface PublicUser {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly createdAt: string;
}
