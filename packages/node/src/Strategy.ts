import { fork, isMaster, Worker } from 'cluster';

import { IDoneFunction, IStrategy } from '@concurrent-tasks/core';

export const Strategy: IStrategy = function Strategy(task, done) {
    if (isMaster) {
        const worker = fork();
        worker.on('online', () => {
            task(customDone(done, worker));
        });
    }
};

const customDone = (done: IDoneFunction, worker: Worker): IDoneFunction => (
    data
) => {
    worker.destroy();
    done(data);
};
