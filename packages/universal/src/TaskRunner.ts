'use strict';

import { CoreRunner, IRunnerOptions } from '@concurrent-tasks/core';

import { Strategy } from './Strategy';

export class TaskRunner<T = any> extends CoreRunner<T, IRunnerOptions<T>> {
    constructor(options?: Partial<IRunnerOptions<T>>) {
        super(Strategy, options);
    }
}
