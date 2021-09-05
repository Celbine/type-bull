import { IChildProcessOpts, QueueEntity } from '../interfaces';

export const createHandleQueue = (queueEntity: QueueEntity): QueueEntity => {
  const processMap = queueEntity.processCallbackMap;
  const childProcess = queueEntity.childProcessCallback as IChildProcessOpts;
  const events = queueEntity.events;

  if(childProcess) {
    if (childProcess.name && childProcess.concurrency) {
      queueEntity.bull.process(
          childProcess.name,
          childProcess.concurrency,
          childProcess.filePath,
      );
    }

    if (!childProcess.name && childProcess.concurrency) {
      queueEntity.bull.process(childProcess.concurrency, childProcess.filePath);
    }

    if (!childProcess.name && !childProcess.concurrency) {
      queueEntity.bull.process(childProcess.filePath);
    }
  }

  if (processMap && processMap.size > 0) {
    queueEntity.bull.process('*', (job) => {
      const jobName = (job.data && job.data.jobName) || job.name;

      const handler = processMap.get(jobName) || processMap.get('*');

      handler(job);
    })
  }

  if (events) {
    events.forEach((value, key) => {
      queueEntity.bull.on(key, value);
    });
  }

  return queueEntity;
};
