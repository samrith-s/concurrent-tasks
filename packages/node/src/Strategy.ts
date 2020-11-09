import { Worker, isMainThread, workerData } from 'worker_threads';

import { IStrategy } from '@concurrent-tasks/core';

export const Strategy: IStrategy = function Strategy(task, done) {
    if (isMainThread) {
        new Worker(__filename, {
            workerData: task.bind(done),
        });
    } else {
        const task = workerData;
        task();
    }
};
