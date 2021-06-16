'use strict';

import { IRunnerOptions } from './Interface';
import { CoreRunner } from './internals/CoreRunner';
import { Strategy } from './internals/DefaultStrategy';

export class TaskRunner<T, TOptions = any> extends CoreRunner<T, TOptions> {
    constructor(options?: Partial<IRunnerOptions<T, TOptions>>) {
        const { strategy: providedStrategy, ...otherOptions } = options || {};
        const strategy = (providedStrategy || new Strategy({})) as Strategy<
            T,
            TOptions
        >;
        super(strategy, otherOptions as Partial<IRunnerOptions<T, TOptions>>);
    }
}
