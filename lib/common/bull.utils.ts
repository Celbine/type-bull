import { IChildProcessOpts, QueueEntity } from '../interfaces';
import { Queue } from 'bull';

export const createHandleQueue = (queueEntity: QueueEntity): Queue => {
  const process = queueEntity.processCallback;
  const events = queueEntity.events;

  if (process) {
    if (typeof queueEntity.processCallback === 'function') {
      queueEntity.process(queueEntity.processCallback);
    } else {
      const processChild = process as IChildProcessOpts;

      if (processChild.name && processChild.concurrency) {
        queueEntity.process(
          processChild.name,
          processChild.concurrency,
          processChild.filePath,
        );
      }

      if (!processChild.name && processChild.concurrency) {
        queueEntity.process(processChild.concurrency, processChild.filePath);
      }

      if (!processChild.name && !processChild.concurrency) {
        queueEntity.process(processChild.filePath);
      }
    }
  }

  if (events) {
    events.forEach((value, key) => {
      queueEntity.on(key, value);
    });
  }

  return queueEntity;
};
