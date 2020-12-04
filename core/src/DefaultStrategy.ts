'use strict';

import { IStrategy } from './Interface';

export const Strategy: IStrategy = function (task, done) {
    task(done);

    process.on('unhandledRejection', (e) => {
        throw e;
    });
};
