import { Provider } from '@nestjs/common';
import { QueueEntityOrFunction } from './interfaces';
import { CircularDependencyException } from '@nestjs/core/errors/exceptions/circular-dependency.exception';

export function createBullProviders(
  entities?: QueueEntityOrFunction[],
): Provider[] {
  return (entities || []).map((entity: QueueEntityOrFunction) => {
    if (!entity) {
      throw new CircularDependencyException('CREATE BULL PROVIDERS');
    }

    // @ts-ignore
    const queueEntity = new entity();

    return {
      provide: queueEntity.name,
      useFactory: () => queueEntity,
    };
  });
}
