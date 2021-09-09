import {ProcessPromiseFunction} from 'bull';
import * as Bull from "bull";

export type TypeBull<T> = T & {constructor: {bull: Bull.Queue}};

export interface IBullOpts {
  validator: Object | Function;
}

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
  bull?: Bull.Queue;
  childProcessCallback: IChildProcessOpts;
  processCallbackMap: Map<string, {descriptor: ProcessPromiseFunction<T>, opts: IBullOpts}>;
  events: Map<string, {descriptor: (...args: any[]) => void, opts: IBullOpts}>;
}
