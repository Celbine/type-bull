import {
  BullEvents,
  IChildProcessOpts,
  QueueEntity,
  QueueEntityOrFunction,
} from '../interfaces';
import { QueueOptions } from 'bull';
import { Inject } from '@nestjs/common';
import { CircularDependencyException } from '@nestjs/core/errors/exceptions/circular-dependency.exception';

export const Queue = (queueName: string, opts: QueueOptions): Function => {
  return function (constructor) {
    return class extends constructor {
      constructor() {
        super(queueName, opts);
      }
    };
  };
};

export const Process = (processOpts?: IChildProcessOpts): Function => {
  return function (
    target: QueueEntity,
    key: string,
    descriptor: PropertyDescriptor,
  ) {
    if (processOpts) {
      target.processCallback = processOpts;
      return;
    }

    target.processCallback = descriptor.value;
  };
};

export const Event = (event: BullEvents): Function => {
  return function (
    target: QueueEntity,
    key: string,
    descriptor: PropertyDescriptor,
  ) {
    if (!target.events) {
      target.events = new Map();
    }

    target.events.set(event, descriptor.value);
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
