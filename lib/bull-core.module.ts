import {
  DynamicModule,
  Inject,
  Logger,
  OnApplicationShutdown,
  Provider,
  Type,
} from '@nestjs/common';
import { BULL_MODULE_ID, BULL_MODULE_OPTIONS } from './bull.constants';
import { Queue, QueueOptions } from 'bull';
import { QueueEntitiesMetadataStorage } from './bull-metadata.storage';
import {
  IBullModuleAsyncOptions,
  IBullOptionsFactory,
  IBullOptions,
} from './interfaces';
import { v4 } from 'uuid';

export class BullCoreModule implements OnApplicationShutdown {
  static logger = new Logger('BullCoreModule');

  constructor(
    @Inject(BULL_MODULE_OPTIONS)
    private readonly options: QueueOptions,
  ) {}

  static forRoot(options: IBullOptions = {}): DynamicModule {
    const bullModuleOptions = {
      provide: BULL_MODULE_OPTIONS,
      useValue: options,
    };

    const genName = `${v4()}:BULL_CORE_MODULE`;

    if (!options) {
      options = {
        name: genName,
      };
    }

    if (!options.name) {
      options.name = genName;
    }

    const queueProvider = {
      provide: options.name,
      useFactory: async () => await this.createQueueFactory(options),
    };

    return {
      module: BullCoreModule,
      providers: [queueProvider, bullModuleOptions],
      exports: [queueProvider],
    };
  }

  static forRootAsync(options: IBullModuleAsyncOptions): DynamicModule {
    const queueProvider = {
      provide: options.name,
      useFactory: async (queueOptions: IBullOptions) => {
        return await this.createQueueFactory(queueOptions);
      },
      inject: [BULL_MODULE_OPTIONS],
    };

    const asyncProviders = this.createAsyncProviders(options);
    return {
      module: BullCoreModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        queueProvider,
        {
          provide: BULL_MODULE_ID,
          useValue: v4(),
        },
      ],
      exports: [queueProvider],
    };
  }

  async onApplicationShutdown() {
    // TODO: Сделать grateful shutdown
  }

  private static createAsyncProviders(
    options: IBullModuleAsyncOptions,
  ): Provider[] {
    if (options.useExisting || options.useFactory) {
      return [this.createAsyncOptionsProvider(options)];
    }
    const useClass = options.useClass as Type<IBullOptionsFactory>;
    return [
      this.createAsyncOptionsProvider(options),
      {
        provide: useClass,
        useClass,
      },
    ];
  }

  private static createAsyncOptionsProvider(
    options: IBullModuleAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: BULL_MODULE_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject || [],
      };
    }
    // `as Type<TypeOrmOptionsFactory>` is a workaround for microsoft/TypeScript#31603
    const inject = [
      (options.useClass || options.useExisting) as Type<IBullOptionsFactory>,
    ];
    return {
      provide: BULL_MODULE_OPTIONS,
      useFactory: async (optionsFactory: IBullOptionsFactory) =>
        await optionsFactory.createTypeBullOptions(options.name),
      inject,
    };
  }

  private static async createQueueFactory(
    options: IBullOptions,
  ): Promise<Queue[]> {
    const queueToken = options.name;

    const entities = options.entities;
    if (options.entities) {
      return entities.concat(
        QueueEntitiesMetadataStorage.getEntitiesByToken(queueToken),
      );
    }
    return QueueEntitiesMetadataStorage.getEntitiesByToken(queueToken);
  }
}
