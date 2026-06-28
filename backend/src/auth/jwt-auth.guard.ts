import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import type { Request } from "express";
import type { EnvAuthConfig } from "src/configs/env.auth";

export interface AuthenticatedUser {
  readonly sub: string;
  readonly email: string;
  readonly name: string;
}

export interface AuthenticatedRequest extends Request {
  user: AuthenticatedUser;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  private readonly jwtSecret: string;

  constructor(
    private readonly jwtService: JwtService,
    configService: ConfigService<EnvAuthConfig, true>,
  ) {
    const auth = configService.get("auth", { infer: true });

    this.jwtSecret = auth.jwtSecret;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractToken(request);

    if (!token) {
      throw new UnauthorizedException("Missing bearer token");
    }

    try {
      request.user = await this.jwtService.verifyAsync<AuthenticatedUser>(
        token,
        {
          secret: this.jwtSecret,
        },
      );

      return true;
    } catch {
      throw new UnauthorizedException("Invalid bearer token");
    }
  }

  private extractToken(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(" ") ?? [];

    return type === "Bearer" && token ? token : null;
  }
}
