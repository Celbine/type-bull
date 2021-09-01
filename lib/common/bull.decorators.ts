import {
  BullEvents,
  IChildProcessOpts,
  QueueEntity,
} from '../interfaces';
import { QueueOptions } from 'bull';
import { Inject } from '@nestjs/common';
import { CircularDependencyException } from '@nestjs/core/errors/exceptions/circular-dependency.exception';

export const Queue = (queueName: string, opts: QueueOptions): Function => {
  return function (constructor) {
    const newClass = class extends constructor {};
    newClass.queueName = queueName;
    newClass.opts = opts;
    return newClass;
  };
};

export const Process = (processOpts: IChildProcessOpts | string): Function => {
  return function (
    target: QueueEntity,
    key: string,
    descriptor: PropertyDescriptor,
  ) {
    if (processOpts && typeof processOpts !== 'string' ) {
      target.childProcessCallback = processOpts;
      return;
    }

    if(typeof processOpts === 'string'){
      target.processCallbackMap.set(processOpts, descriptor.value);
    }
    throw new Error(`Process('job_name' || IChildProcessOpts) is required argument`);
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
  entityOrQueueName: QueueEntity | string,
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
