import { ProcessCallbackFunction, Queue } from 'bull';
import { ModuleMetadata, Type } from '@nestjs/common';
import * as Bull from 'bull';

export type BullEvents =
  | 'error'
  | 'waiting'
  | 'active'
  | 'stalled'
  | 'progress'
  | 'completed'
  | 'failed'
  | 'paused'
  | 'resumed'
  | 'cleaned'
  | 'drained'
  | 'removed'
  | `global:${string}`;

export interface IChildProcessOpts {
  filePath: string;
  concurrency?: number;
  name?: string;
}

type ProcessType<T = any> = IChildProcessOpts | ProcessCallbackFunction<T>;

export interface IBullOptions {
  name?: string;
  entities?: Queue[];
}

export interface IBullOptionsFactory {
  createTypeBullOptions(
    tokenName?: string,
  ): Promise<IBullOptions> | IBullOptions;
}

export type BullQueueFactory = (options?: IBullOptions) => Promise<Queue>;

export interface IBullModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  name?: string;
  useExisting?: Type<IBullOptionsFactory>;
  useClass?: Type<IBullOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<IBullOptions> | IBullOptions;
  queueFactory?: BullQueueFactory;
  inject?: any[];
}

export class QueueEntity<T = any> extends Bull<T> {
  processCallback: ProcessType;
  events: Map<string, (...args: any[]) => void>;
}

export type QueueEntityOrFunction<T = any> = Queue<T> | any;
