import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import type { JwtModuleOptions } from "@nestjs/jwt";
import { JwtModule } from "@nestjs/jwt";
import type { EnvAuthConfig } from "src/configs/env.auth";
import envAuth from "src/configs/env.auth";
import { UsersModule } from "src/users/users.module";

import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Module({
  imports: [
    ConfigModule.forFeature(envAuth),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService<EnvAuthConfig, true>) => {
        const auth = configService.get("auth", { infer: true });
        const signOptions: JwtModuleOptions["signOptions"] = {
          expiresIn: auth.jwtExpiresIn,
        };

        return {
          secret: auth.jwtSecret,
          signOptions,
        };
      },
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtAuthGuard],
  exports: [AuthService, JwtAuthGuard, JwtModule],
  controllers: [AuthController],
})
export class AuthModule {}
