import {
  IBullModuleAsyncOptions,
  IBullOptions,
  QueueEntity,
  QueueEntityOrFunction,
} from './interfaces';
import { Queue } from 'bull';
import { createHandleQueue } from './common';

type QueueToken = IBullOptions | IBullModuleAsyncOptions | string;

export class QueueEntitiesMetadataStorage {
  private static readonly storage = new Map<string, Queue[]>();

  static addEntitiesByToken(
    token: QueueToken,
    entities: QueueEntityOrFunction[],
  ) {
    const queueToken = typeof token === 'string' ? token : token.name;

    let collection = this.storage.get(queueToken);
    if (!collection) {
      collection = [];
      this.storage.set(queueToken, collection);
    }

    entities.forEach((entity: QueueEntity) => {
      if (!collection) {
        return;
      }

      if (collection.find((el) => el.name === entity.name)) {
        return;
      }

      collection.push(createHandleQueue(entity));
    });
  }

  static getEntitiesByToken(token: QueueToken): Queue[] {
    const queueToken = typeof token === 'string' ? token : token.name;

    if (!queueToken) {
      return [];
    }

    return this.storage.get(queueToken) || [];
  }
}
