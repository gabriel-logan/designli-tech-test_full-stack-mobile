export interface EnvGlobalConfig {
  readonly server: {
    readonly nodeEnv: "development" | "production" | "test";
    readonly port: number;
    readonly allowedOrigins: string[];
  };
  readonly database: {
    readonly host: string;
    readonly port: number;
    readonly user: string;
    readonly password: string;
    readonly name: string;
    readonly maxConnections: number;
    readonly idleTimeoutMillis: number;
  };
}

export default function envGlobal(): EnvGlobalConfig {
  const nodeEnv = process.env.NODE_ENV;
  const port = process.env.SERVER_PORT;
  const allowedOriginsRaw = process.env.ALLOWED_ORIGINS;
  const databaseHost = process.env.DB_HOST;
  const databasePort = process.env.DB_PORT;
  const databaseUser = process.env.DB_USER;
  const databasePassword = process.env.DB_PASSWORD;
  const databaseName = process.env.DB_NAME;
  const databaseMaxConnections = process.env.DB_MAX_CONNECTIONS ?? "10";
  const databaseIdleTimeoutMillis =
    process.env.DB_IDLE_TIMEOUT_MILLIS ?? "60000";

  if (!nodeEnv) {
    throw new Error("Missing required environment variable: NODE_ENV");
  }

  if (!port) {
    throw new Error("Missing required environment variable: SERVER_PORT");
  }

  if (!allowedOriginsRaw) {
    throw new Error("Missing required environment variable: ALLOWED_ORIGINS");
  }

  if (!databaseHost) {
    throw new Error("Missing required environment variable: DB_HOST");
  }

  if (!databasePort) {
    throw new Error("Missing required environment variable: DB_PORT");
  }

  if (!databaseUser) {
    throw new Error("Missing required environment variable: DB_USER");
  }

  if (!databasePassword) {
    throw new Error("Missing required environment variable: DB_PASSWORD");
  }

  if (!databaseName) {
    throw new Error("Missing required environment variable: DB_NAME");
  }

  const allowedOrigins = allowedOriginsRaw.trim().split(",");

  return {
    server: {
      nodeEnv: nodeEnv as EnvGlobalConfig["server"]["nodeEnv"],
      port: Number.parseInt(port, 10),
      allowedOrigins,
    },
    database: {
      host: databaseHost,
      port: Number.parseInt(databasePort, 10),
      user: databaseUser,
      password: databasePassword,
      name: databaseName,
      maxConnections: Number.parseInt(databaseMaxConnections, 10),
      idleTimeoutMillis: Number.parseInt(databaseIdleTimeoutMillis, 10),
    },
  };
}
