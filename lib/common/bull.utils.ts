import {IBullOpts, IChildProcessOpts, QueueEntity} from '../interfaces';
import {Job} from "bull";
import {validate} from "class-validator";
const Ajv = require('ajv');
import {TypeBullValidationError} from "./bull.errors";

export const createHandleQueue = (queueEntity: QueueEntity): QueueEntity => {
    const processMap = queueEntity.processCallbackMap;
    const childProcess = queueEntity.childProcessCallback as IChildProcessOpts;
    const events = queueEntity.events;

    if (childProcess) {
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
        queueEntity.bull.process('*', async (job) => {
            try {
                const jobName = (job.data && job.data.jobName) || job.name;

                const handler = processMap.get(jobName) || processMap.get('*');

                if(!handler) {
                    throw new Error('Handler is undefined');
                }

                if(handler.opts && handler.opts.validator) {
                    await validateData(job, handler.opts.validator);
                }

                handler.descriptor(job);
            } catch (e) {
                if (!(e instanceof TypeBullValidationError)) {
                    throw e;
                }
                // TODO: Handle validation error
                throw e;
            }
        })
    }

    if (events) {
        events.forEach((value, key) => {
            queueEntity.bull.on(key, async function (...args) {
                try {
                    if (value.opts && value.opts.validator) {
                        const validator = value.opts.validator;

                        if (Array.isArray(arguments[0])) {
                            await Promise.all(arguments[0].map(async (job: Job<any>) => {
                                await validateData(job, validator);
                            }));
                        }

                        if(!Array.isArray(arguments[0]) && typeof arguments[0] === 'object') {
                            await validateData(arguments[0], validator);
                        }
                    }

                    value.descriptor(...args);
                } catch (e) {
                    if (!(e instanceof TypeBullValidationError)) {
                        throw e;
                    }
                    // TODO: Handle validation error
                    throw e;
                }
            });
        });
    }

    return queueEntity;
};

const validateData = async (job: Job<any>, validator: IBullOpts['validator']) => {
    if (typeof validator === 'function') {
        // @ts-ignore
        const dto = new validator();

        const validationDto = Object.assign(dto, job.data);

        const errors = await validate(validationDto);

        if (errors.length > 0) {
            throw new TypeBullValidationError('Validation error', errors);
        }

        return true;
    }

    if (typeof validator === 'object') {
        const ajv = new Ajv();
        const validate = ajv.compile(validator);

        if (!validate(job.data)) {
            throw new TypeBullValidationError('Validation error', validate.errors);
        }

        return true;
    }

    throw new Error('validation unknown error');
}