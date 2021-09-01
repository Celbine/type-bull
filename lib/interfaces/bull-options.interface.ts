import {ProcessPromiseFunction, QueueOptions} from 'bull';
import * as Bull from "bull";

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

export class QueueEntity<T = any> {
  opts?: QueueOptions;
  queueName: string;
  childProcessCallback: IChildProcessOpts;
  processCallbackMap: Map<string, ProcessPromiseFunction<T>> = new Map();
  events: Map<string, (...args: any[]) => void>;
}
