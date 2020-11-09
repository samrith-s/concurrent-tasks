import { CoreRunner, IRunnerOptions } from '@concurrent-tasks/core';

import { Strategy } from './Strategy';

export class TaskRunner<T> extends CoreRunner<T> {
    constructor(options?: Partial<IRunnerOptions>) {
        super(Strategy, options);
    }
}
