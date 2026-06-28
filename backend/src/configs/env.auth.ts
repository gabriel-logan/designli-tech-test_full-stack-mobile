export interface EnvAuthConfig {
  readonly auth: {
    readonly jwtSecret: string;
    readonly jwtExpiresIn: string;
  };
}

export default function envAuth(): EnvAuthConfig {
  const jwtSecret = process.env.JWT_SECRET;
  const jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? "7d";

  if (!jwtSecret) {
    throw new Error("Missing required environment variable: JWT_SECRET");
  }

  return {
    auth: {
      jwtSecret,
      jwtExpiresIn,
    },
  };
}
