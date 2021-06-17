'use strict';

import { RunnerOptions } from '../Interface';
import { noop } from '../Utils';

export function DefaultOptions<T, TOptions>(name: string) {
    return ({
        concurrency: 3,
        autoStart: false,
        name,
        onAdd: noop,
        onStart: noop,
        onRun: noop,
        onDone: noop,
        onEnd: noop,
        onRemove: noop,
    } as unknown) as RunnerOptions<T, TOptions>;
}
