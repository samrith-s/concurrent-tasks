import { cpus } from 'os';

import { CoreRunner, IRunnerOptions } from '@concurrent-tasks/core';

import { Strategy } from './Strategy';

interface ICTNodeOptions {
    useAllCores?: boolean;
}

export type INodeOptions<T> = IRunnerOptions<T, ICTNodeOptions>;

export class TaskRunner<T = any> extends CoreRunner<T, ICTNodeOptions> {
    constructor(options?: Partial<INodeOptions<T>>) {
        const configuredOptions: Partial<INodeOptions<T>> = {
            useAllCores: false,
            ...options,
        };

        if (
            typeof configuredOptions.useAllCores === 'boolean' &&
            configuredOptions.useAllCores
        ) {
            configuredOptions.concurrency = cpus().length;
        }

        super(Strategy, {
            useAllCores: true,
            ...configuredOptions,
        });
    }
}
