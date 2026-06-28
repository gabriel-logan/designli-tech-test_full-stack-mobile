import { ConflictException, Injectable } from "@nestjs/common";
import { PostgresService } from "src/database/postgres.service";

import type { PublicUser, UserRecord } from "./user.types";

@Injectable()
export class UsersService {
  constructor(private readonly postgresService: PostgresService) {}

  async create(params: {
    readonly email: string;
    readonly name: string;
    readonly passwordHash: string;
  }): Promise<PublicUser> {
    try {
      const result = await this.postgresService.insert<UserRecord>(
        `
          INSERT INTO users (email, name, password_hash)
          VALUES ($1, $2, $3)
          RETURNING id, email, name, password_hash, created_at, updated_at
        `,
        [params.email.toLowerCase(), params.name, params.passwordHash],
      );

      return this.toPublicUser(result.rows[0]);
    } catch (error) {
      if (this.isUniqueViolation(error)) {
        throw new ConflictException("Email already registered");
      }

      throw error;
    }
  }

  async findByEmail(email: string): Promise<UserRecord | null> {
    const rows = await this.postgresService.select<UserRecord>(
      `
        SELECT id, email, name, password_hash, created_at, updated_at
        FROM users
        WHERE email = $1
      `,
      [email.toLowerCase()],
    );

    return rows[0] ?? null;
  }

  async findById(id: string): Promise<PublicUser | null> {
    const rows = await this.postgresService.select<UserRecord>(
      `
        SELECT id, email, name, password_hash, created_at, updated_at
        FROM users
        WHERE id = $1
      `,
      [id],
    );

    if (rows.length === 0) {
      return null;
    }

    return this.toPublicUser(rows[0]);
  }

  toPublicUser(user: UserRecord): PublicUser {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.created_at.toISOString(),
    };
  }

  private isUniqueViolation(error: unknown): boolean {
    return (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "23505"
    );
  }
}
