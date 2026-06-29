export interface EnvDatabaseConfig {
  readonly database: {
    readonly postgres: {
      readonly host: string;
      readonly port: number;
      readonly user: string;
      readonly password: string;
      readonly name: string;
      readonly maxConnections: number;
      readonly idleTimeoutMillis: number;
      readonly ssl: boolean;
      readonly channelBinding: boolean;
    };
  };
}

export default function envDatabase(): EnvDatabaseConfig {
  const postgresHost = process.env.POSTGRES_HOST;
  const postgresPort = process.env.POSTGRES_PORT;
  const postgresUser = process.env.POSTGRES_USER;
  const postgresPassword = process.env.POSTGRES_PASSWORD;
  const postgresDatabase = process.env.POSTGRES_DATABASE;
  const postgresMaxConnections = process.env.POSTGRES_MAX_CONNECTIONS ?? "10";
  const postgresIdleTimeoutMillis =
    process.env.POSTGRES_IDLE_TIMEOUT_MILLIS ?? "60000";
  const postgresSsl = process.env.POSTGRES_SSL_MODE;
  const postgresChannelBinding = process.env.POSTGRES_CHANNEL_BINDING;

  if (!postgresHost) {
    throw new Error("Missing required environment variable: POSTGRES_HOST");
  }

  if (!postgresPort) {
    throw new Error("Missing required environment variable: POSTGRES_PORT");
  }

  if (!postgresUser) {
    throw new Error("Missing required environment variable: POSTGRES_USER");
  }

  if (!postgresPassword) {
    throw new Error("Missing required environment variable: POSTGRES_PASSWORD");
  }

  if (!postgresDatabase) {
    throw new Error("Missing required environment variable: POSTGRES_DATABASE");
  }

  if (!postgresMaxConnections) {
    throw new Error(
      "Missing required environment variable: POSTGRES_MAX_CONNECTIONS",
    );
  }

  if (!postgresIdleTimeoutMillis) {
    throw new Error(
      "Missing required environment variable: POSTGRES_IDLE_TIMEOUT_MILLIS",
    );
  }

  if (!postgresSsl) {
    throw new Error("Missing required environment variable: POSTGRES_SSL_MODE");
  }

  if (!postgresChannelBinding) {
    throw new Error(
      "Missing required environment variable: POSTGRES_CHANNEL_BINDING",
    );
  }

  return {
    database: {
      postgres: {
        host: postgresHost,
        port: Number.parseInt(postgresPort, 10),
        user: postgresUser,
        password: postgresPassword,
        name: postgresDatabase,
        maxConnections: Number.parseInt(postgresMaxConnections, 10),
        idleTimeoutMillis: Number.parseInt(postgresIdleTimeoutMillis, 10),
        ssl: postgresSsl.toLocaleLowerCase() === "true",
        channelBinding: postgresChannelBinding.toLocaleLowerCase() === "true",
      },
    },
  };
}
