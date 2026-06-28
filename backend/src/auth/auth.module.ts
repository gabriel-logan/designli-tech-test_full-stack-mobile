import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import type { EnvAuthConfig } from "src/configs/env.auth";
import { UsersModule } from "src/users/users.module";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvAuthConfig, true>) => ({
        secret: configService.get("auth.jwtSecret", { infer: true }),
        signOptions: {
          expiresIn: configService.get("auth.jwtExpiresIn", { infer: true }),
        },
      }),
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
