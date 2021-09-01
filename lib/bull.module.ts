import { DynamicModule, Module } from '@nestjs/common';
import {QueueEntity} from './interfaces';
import { createBullProviders } from './bull.providers';
import * as Bull from "bull";
import {createHandleQueue} from "./common";

@Module({})
export class BullModule {
  static forFeature(
    entities: QueueEntity[] = [],
  ): DynamicModule {
    if (!entities || entities.length === 0) {
      return;
    }

    const instancesEntities = entities.map((e) => createHandleQueue(new Bull(e.queueName, e.opts), e));

    const providers = createBullProviders(instancesEntities);

    return {
      module: BullModule,
      providers: providers,
      exports: providers,
    };
  }
}
