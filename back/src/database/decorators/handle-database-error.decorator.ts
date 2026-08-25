import { DatabaseErrorMapper } from '../filters';

type AsyncMethod = (...args: unknown[]) => Promise<unknown>;

export function HandleDatabaseError(): MethodDecorator {
  return (
    _target: object,
    _propertyKey: string | symbol,
    descriptor: PropertyDescriptor,
  ) => {
    const originalMethod = descriptor.value as AsyncMethod;

    descriptor.value = async function (
      this: unknown,
      ...args: unknown[]
    ): Promise<unknown> {
      try {
        return await Reflect.apply(originalMethod, this, args);
      } catch (error) {
        const mappedError = new DatabaseErrorMapper().map(error);

        throw mappedError ?? error;
      }
    };

    return descriptor;
  };
}
