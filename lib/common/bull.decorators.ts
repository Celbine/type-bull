import {
  BullEvents,
  IChildProcessOpts,
  QueueEntityOrFunction,
} from '../interfaces';
import { QueueOptions, Queue as BullQueue } from 'bull';
import { Inject } from '@nestjs/common';
import { CircularDependencyException } from '@nestjs/core/errors/exceptions/circular-dependency.exception';

export const Queue = (
  queueName: string,
  opts: QueueOptions,
) => {
  return function (constructor) {
    return class extends constructor {
      constructor() {
        super(queueName, opts);
      }
    } as typeof constructor;
  };
};

export const Process = (processOpts?: IChildProcessOpts) => {
  return function (
    target: BullQueue,
    key: string,
    descriptor: PropertyDescriptor,
  ) {
    if (processOpts) {
      if (processOpts.name && processOpts.concurrency) {
        target.process(
          processOpts.name,
          processOpts.concurrency,
          processOpts.filePath,
        );
      }

      if (!processOpts.name && processOpts.concurrency) {
        target.process(processOpts.concurrency, processOpts.filePath);
      }

      if (!processOpts.name && !processOpts.concurrency) {
        target.process(processOpts.filePath);
      }
    }
    target.process(descriptor.value);
  };
};

export const Event = (event: BullEvents) => {
  return function (
    target: BullQueue,
    key: string,
    descriptor: PropertyDescriptor,
  ) {
    target.on(event, descriptor.value);
  };
};

export const InjectQueue = (
  entityOrQueueName: QueueEntityOrFunction | string,
) => {
  if (entityOrQueueName === null || entityOrQueueName === undefined) {
    throw new CircularDependencyException('@InjectQueue()');
  }

  if (typeof entityOrQueueName === 'string') {
    return Inject(entityOrQueueName);
  }

  // @ts-ignore
  const entity = new entityOrQueueName();

  return Inject(entity.name);
};
