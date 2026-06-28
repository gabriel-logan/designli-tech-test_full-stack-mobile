import type { PostgresService } from "../../database/postgres.service";

type AsyncMethod = (...args: any[]) => Promise<unknown>;

interface PostgresTransactionalContext {
  readonly postgresService?: PostgresService;
}

export function PostgresTransactional(): (
  target: object,
  methodName: string | symbol,
  descriptor: TypedPropertyDescriptor<AsyncMethod>,
) => TypedPropertyDescriptor<AsyncMethod> {
  return (
    _target: object,
    _methodName: string | symbol,
    descriptor: TypedPropertyDescriptor<AsyncMethod>,
  ): TypedPropertyDescriptor<AsyncMethod> => {
    const originalMethod = descriptor.value;

    if (!originalMethod) {
      throw new Error(
        "PostgresTransactional decorator can only be applied to methods.",
      );
    }

    descriptor.value = async function (...args: any[]): Promise<unknown> {
      const typedThis = this as PostgresTransactionalContext | undefined;
      const postgresService = typedThis?.postgresService;

      if (!postgresService) {
        throw new Error(
          `\nPostgresService is not available in the context of this method.
Ensure that the class has a postgresService property.
The property should be named exactly 'postgresService' and be of type PostgresService.\n`,
        );
      }

      return await postgresService.transaction(async () => {
        return await originalMethod.apply(this, args);
      });
    };

    return descriptor;
  };
}
