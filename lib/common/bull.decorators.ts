import {
    BullEvents, IBullOpts,
    IChildProcessOpts,
    QueueEntity,
} from '../interfaces';
import {QueueOptions} from 'bull';
import * as Bull from "bull";
import {createHandleQueue} from "./bull.utils";

export const Queue = (queueName: string, opts: QueueOptions): Function => {
    return function (constructor) {
        constructor.bull = new Bull(queueName, opts);

        createHandleQueue(constructor);

        return class extends constructor {
            constructor(...args) {
                super(...args);

                if (constructor.processCallbackMap) {
                    Array.from(constructor.processCallbackMap).map(([key, value]) => {
                        constructor.processCallbackMap.set(key, {
                            descriptor: value.descriptor.bind(this),
                            opts: value.opts,
                        });
                    });
                }

                if (constructor.events) {
                    Array.from(constructor.events).map(([key, value]) => {
                        constructor.events.set(key,
                            {
                                descriptor: value.descriptor.bind(this),
                                opts: value.opts,
                            });
                    });
                }

                if (constructor.childProcessCallback) {
                    constructor.childProcessCallback = constructor.childProcessCallback.bind(this);
                }
            }
        }
    };
};

export const Process = (processOpts: IChildProcessOpts | string, opts?: IBullOpts): Function => {
    return function (
        target: { constructor: QueueEntity },
        key: string,
        descriptor: PropertyDescriptor,
    ) {
        if (!target.constructor.processCallbackMap) {
            target.constructor.processCallbackMap = new Map();
        }

        if (processOpts && typeof processOpts !== "string") {
            target.constructor.childProcessCallback = processOpts;
            return;
        }

        if (typeof processOpts === "string") {
            target.constructor.processCallbackMap.set(processOpts, {
                descriptor: descriptor.value,
                opts
            });
            return;
        }

        new Error(`Process('job_name' || IChildProcessOpts) is required argument`);
    };
};

export const Event = (event: BullEvents, opts?: IBullOpts): Function => {
    return function (
        target: { constructor: QueueEntity },
        key: string,
        descriptor: PropertyDescriptor,
    ) {
        if (!target.constructor.events) {
            target.constructor.events = new Map();
        }

        target.constructor.events.set(event, {
            descriptor: descriptor.value,
            opts
        });
    };
};