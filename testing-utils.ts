import { assert } from 'chai';

import { Strategy, Task, TaskRunner } from './core/src';

export function runTest<TOptions = any>(
    done: Mocha.Done,
    options: {
        tasks: Task<number>[];
        expected?: number[];
        strategy?: Strategy<number, TOptions>;
    } = {
        tasks: [],
    }
) {
    const results: number[] = [];
    const expected = options.expected ?? [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const runner = new TaskRunner<number>({
        ...options,
        onEnd() {
            checkResults(results, expected);
            done();
        },
        onDone({ result }) {
            results.push(result as number);
        },
    });
    runner.addMultiple(options.tasks);
    runner.start();
}

export function checkResults(results: number[], value: number[]) {
    return assert.equal(results.join(' '), value.join(' '));
}
