import {
    IRunnerOptions,
    ITaskFunction,
    TaskRunner,
} from '@concurrent-tasks/core';
import { assert } from 'chai';

export function createRunner(options?: Partial<IRunnerOptions<number>>) {
    const results: number[] = [];
    const runner = new TaskRunner<number>({
        ...options,
        onDone({ result }) {
            results.push(result as number);
        },
    });
    runner.addMultiple(generateTasks());
    const expected = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    return { runner, results, expected };
}

export function generateTasks(count = 10, timeout = 500) {
    const tasks: ITaskFunction[] = [];

    for (let i = 0; i < count; i++) {
        tasks.push(function (done) {
            setTimeout(() => {
                done(i);
            }, timeout);
        });
    }

    return tasks;
}

export function checkResults(results: number[], value: number[]) {
    return assert.equal(results.join(' '), value.join(' '));
}
