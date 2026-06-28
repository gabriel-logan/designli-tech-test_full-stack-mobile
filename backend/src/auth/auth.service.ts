import { Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import type { EnvAuthConfig } from "src/configs/env.auth";
import type { PublicUser, UserRecord } from "src/users/user.types";
import { UsersService } from "src/users/users.service";

export interface AuthResponse {
  readonly accessToken: string;
  readonly user: PublicUser;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<EnvAuthConfig, true>,
  ) {}

  async register(params: {
    readonly name: string;
    readonly email: string;
    readonly password: string;
  }): Promise<AuthResponse> {
    const passwordHash = await bcrypt.hash(params.password, 12);
    const user = await this.usersService.create({
      email: params.email,
      name: params.name,
      passwordHash,
    });

    return {
      accessToken: await this.signToken({
        id: user.id,
        email: user.email,
        name: user.name,
      }),
      user,
    };
  }

  async login(params: {
    readonly email: string;
    readonly password: string;
  }): Promise<AuthResponse> {
    const user = await this.usersService.findByEmail(params.email);

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(
      params.password,
      user.password_hash,
    );

    if (!passwordMatches) {
      throw new UnauthorizedException("Invalid email or password");
    }

    return {
      accessToken: await this.signToken(user),
      user: this.usersService.toPublicUser(user),
    };
  }

  private async signToken(
    user: Pick<UserRecord, "id" | "email" | "name">,
  ): Promise<string> {
    return await this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
        name: user.name,
      },
      {
        secret: this.configService.get("auth.jwtSecret", { infer: true }),
        expiresIn: this.configService.get("auth.jwtExpiresIn", {
          infer: true,
        }),
      },
    );
  }
}
