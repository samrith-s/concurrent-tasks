import { IStrategy } from '@concurrent-tasks/core';

export const Strategy: IStrategy = function (task, done) {
    task(done);
};
