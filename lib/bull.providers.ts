import { Provider } from '@nestjs/common';
import { QueueEntityOrFunction } from './interfaces';

export function createBullProviders(
  entities?: QueueEntityOrFunction[],
): Provider[] {
  return (entities || []).map((entity: QueueEntityOrFunction) => ({
    provide: entity.name,
    useFactory: () => entity,
  }));
}
