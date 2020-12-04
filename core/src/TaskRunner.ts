'use strict';

import { Strategy } from './DefaultStrategy';
import { IRunnerOptions } from './Interface';
import { CoreRunner } from './internals/CoreRunner';

export class TaskRunner<T> extends CoreRunner<T> {
    constructor(options?: Partial<IRunnerOptions>) {
        super(Strategy, options);
    }
}
