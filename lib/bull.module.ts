import { DynamicModule, Logger, Module } from '@nestjs/common';
import { QueueEntitiesMetadataStorage } from './bull-metadata.storage';
import { BullCoreModule } from './bull-core.module';
import {
  IBullModuleAsyncOptions,
  IBullOptions,
  QueueEntityOrFunction,
} from './interfaces';
import { createBullProviders } from './bull.providers';
import { v4 } from 'uuid';

@Module({})
export class BullModule {
  private static readonly logger = new Logger('BullModule');

  static forRoot(options?: IBullOptions): DynamicModule {
    return {
      module: BullModule,
      imports: [BullCoreModule.forRoot(options)],
    };
  }

  static forFeature(
    entities: QueueEntityOrFunction[] = [],
    token?: string,
  ): DynamicModule {
    if (!entities || entities.length === 0) {
      return;
    }

    if (!token) {
      token = `${v4()}:BULL_PROVIDERS`;
    }

    const providers = createBullProviders(entities);

    QueueEntitiesMetadataStorage.addEntitiesByToken(token, [...entities]);

    return {
      module: BullModule,
      providers: [...providers],
      exports: [...providers],
    };
  }

  static forRootAsync(options: IBullModuleAsyncOptions): DynamicModule {
    return {
      module: BullModule,
      imports: [BullCoreModule.forRootAsync(options)],
    };
  }
}
