import {
  Injectable,
  Logger,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AsyncLocalStorage } from "async_hooks";
import type { PoolClient, QueryResult, QueryResultRow } from "pg";
import { Pool } from "pg";

import type { EnvDatabaseConfig } from "../configs/env.database";

type QueryParams = readonly unknown[];
type QueryConnection = Pool | PoolClient;

@Injectable()
export class PostgresService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PostgresService.name);

  private readonly asyncLocalStorage = new AsyncLocalStorage<PoolClient>();

  private pool!: Pool;

  constructor(
    private readonly configService: ConfigService<EnvDatabaseConfig, true>,
  ) {}

  async onModuleInit(): Promise<void> {
    const database = this.configService.get("database.postgres", {
      infer: true,
    });

    this.pool = new Pool({
      host: database.host,
      port: database.port,
      user: database.user,
      password: database.password,
      database: database.name,
      max: database.maxConnections,
      idleTimeoutMillis: database.idleTimeoutMillis,
      allowExitOnIdle: false,
    });

    this.pool.on("error", (error) => {
      this.logger.error("Unexpected PostgreSQL pool error", error.stack);
    });

    await this.verifyPostgresConnection();
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool.end();
  }

  async getConnection(): Promise<PoolClient> {
    return await this.pool.connect();
  }

  async transaction<T>(callback: () => Promise<T>): Promise<T> {
    const connection = await this.getConnection();

    try {
      this.logger.verbose("Starting transaction \n");

      await connection.query("BEGIN");

      const result = await this.asyncLocalStorage.run(connection, async () => {
        const transactionResult = await callback();

        await connection.query("COMMIT");

        this.logger.verbose("Transaction committed successfully \n");

        return transactionResult;
      });

      return result;
    } catch (error) {
      await connection.query("ROLLBACK");

      this.logger.error("Transaction rolled back \n");

      throw error;
    } finally {
      connection.release();
    }
  }

  async select<
    Row extends QueryResultRow = QueryResultRow,
    Params extends QueryParams = QueryParams,
  >(sql: string, params?: Params): Promise<Row[]> {
    const result = await this.query<Row, Params>(sql, params, "SELECT");

    return result.rows;
  }

  async insert<
    Row extends QueryResultRow = QueryResultRow,
    Params extends QueryParams = QueryParams,
  >(sql: string, params?: Params): Promise<QueryResult<Row>> {
    return await this.query<Row, Params>(sql, params, "INSERT");
  }

  async update<
    Row extends QueryResultRow = QueryResultRow,
    Params extends QueryParams = QueryParams,
  >(sql: string, params?: Params): Promise<QueryResult<Row>> {
    return await this.query<Row, Params>(sql, params, "UPDATE");
  }

  async delete<
    Row extends QueryResultRow = QueryResultRow,
    Params extends QueryParams = QueryParams,
  >(sql: string, params?: Params): Promise<QueryResult<Row>> {
    return await this.query<Row, Params>(sql, params, "DELETE");
  }

  private verifySqlRequested(sql: string, expected: string): string {
    const sqlTreated = sql.trim().replace(/\s+/g, " ");
    const operation = sqlTreated.split(" ")[0]?.toUpperCase();

    if (operation !== expected) {
      throw new Error(
        `Only ${expected} queries are allowed in this method. Received: ${sqlTreated}`,
      );
    }

    return sqlTreated;
  }

  private logQuery(sql: string, params?: QueryParams): void {
    const formatted =
      `Executing SQL: ${sql}` +
      (params ? ` | params: ${JSON.stringify(params)}\n` : "\n");

    this.logger.debug(formatted);
  }

  private getActiveConnection(): QueryConnection {
    const store = this.asyncLocalStorage.getStore();

    if (store) {
      return store;
    }

    this.logger.warn("Using global pool connection (NO ALS)");

    return this.pool;
  }

  private async verifyPostgresConnection(): Promise<void> {
    const postgresMaxConnectionRetries = 3;
    const postgresConnectionRetryDelayMs = 1000;

    for (
      let postgresConnectionAttempt = 1;
      postgresConnectionAttempt <= postgresMaxConnectionRetries;
      postgresConnectionAttempt += 1
    ) {
      try {
        const connection = await this.getConnection();

        try {
          await connection.query("SELECT 1");

          this.logger.log("PostgreSQL connection established successfully");

          return;
        } finally {
          connection.release();
        }
      } catch (error) {
        const isLastAttempt =
          postgresConnectionAttempt === postgresMaxConnectionRetries;
        const postgresConnectionError =
          error instanceof Error ? error.message : String(error);

        this.logger.error(
          `PostgreSQL connection attempt ${postgresConnectionAttempt}/${postgresMaxConnectionRetries} failed`,
          postgresConnectionError,
        );

        if (isLastAttempt) {
          throw error;
        }

        await this.sleep(postgresConnectionRetryDelayMs);
      }
    }
  }

  private async sleep(milliseconds: number): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve, milliseconds));
  }

  private async query<
    Row extends QueryResultRow,
    Params extends QueryParams = QueryParams,
  >(
    sql: string,
    params: Params | undefined,
    operation: string,
  ): Promise<QueryResult<Row>> {
    const sqlTreated = this.verifySqlRequested(sql, operation);
    const conn = this.getActiveConnection();

    this.logQuery(sqlTreated, params);

    return await conn.query<Row>(sqlTreated, params ? [...params] : undefined);
  }
}
