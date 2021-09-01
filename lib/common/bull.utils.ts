import { IChildProcessOpts, QueueEntity } from '../interfaces';
import { Queue } from 'bull';
import * as Bull from "bull";

export const createHandleQueue = (instance: Bull.Queue, queueEntity: QueueEntity): Queue => {
  const processMap = queueEntity.processCallbackMap;
  const childProcess = queueEntity.childProcessCallback as IChildProcessOpts;
  const events = queueEntity.events;

  if(childProcess) {
    if (childProcess.name && childProcess.concurrency) {
      instance.process(
          childProcess.name,
          childProcess.concurrency,
          childProcess.filePath,
      );
    }

    if (!childProcess.name && childProcess.concurrency) {
      instance.process(childProcess.concurrency, childProcess.filePath);
    }

    if (!childProcess.name && !childProcess.concurrency) {
      instance.process(childProcess.filePath);
    }
  }

  if (processMap.size > 0) {
    instance.process('*', (job) => {
      const jobName = (job.data && job.data.jobName) || job.name;

      const handler = processMap.get(jobName) || processMap.get('*');

      handler(job);
    })
  }

  if (events) {
    events.forEach((value, key) => {
      instance.on(key, value);
    });
  }

  return instance;
};
