import type { StringValue } from "ms";

export interface EnvAuthConfig {
  readonly auth: {
    readonly jwtSecret: string;
    readonly jwtExpiresIn: StringValue | number;
  };
}

export default function envAuth(): EnvAuthConfig {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresInRaw = process.env.JWT_EXPIRES_IN ?? "1d";

  if (!jwtSecret) {
    throw new Error("Missing required environment variable: JWT_SECRET");
  }

  const jwtExpiresInNumber = Number(jwtExpiresInRaw);

  const jwtExpiresIn = Number.isNaN(jwtExpiresInNumber)
    ? (jwtExpiresInRaw as StringValue)
    : jwtExpiresInNumber;

  return {
    auth: {
      jwtSecret,
      jwtExpiresIn,
    },
  };
}
