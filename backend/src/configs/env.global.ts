export interface EnvGlobalConfig {
  readonly server: {
    readonly nodeEnv: "development" | "production" | "test";
    readonly port: number;
    readonly allowedOrigins: string[];
  };
}

export default function envGlobal(): EnvGlobalConfig {
  const nodeEnv = process.env.NODE_ENV;
  const port = process.env.SERVER_PORT;
  const allowedOriginsRaw = process.env.ALLOWED_ORIGINS;

  if (!nodeEnv) {
    throw new Error("Missing required environment variable: NODE_ENV");
  }

  if (!port) {
    throw new Error("Missing required environment variable: SERVER_PORT");
  }

  if (!allowedOriginsRaw) {
    throw new Error("Missing required environment variable: ALLOWED_ORIGINS");
  }

  const allowedOrigins = allowedOriginsRaw.trim().split(",");

  return {
    server: {
      nodeEnv: nodeEnv as EnvGlobalConfig["server"]["nodeEnv"],
      port: Number.parseInt(port, 10),
      allowedOrigins,
    },
  };
}
