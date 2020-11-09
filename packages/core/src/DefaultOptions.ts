import { IRunnerOptions } from './Interface';
import { noop } from './Utils';

export function DefaultOptions(name: string): IRunnerOptions {
    return {
        concurrency: 3,
        autoStart: false,
        name,
        onAdd: noop,
        onStart: noop,
        onRun: noop,
        onDone: noop,
        onEnd: noop,
        onRemove: noop,
    };
}
