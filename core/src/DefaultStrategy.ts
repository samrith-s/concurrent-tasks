'use strict';

import { createStrategy } from './createStrategy';

export const Strategy = createStrategy({
    init() {
        process.on('unhandledRejection', (e) => {
            console.log(e);
        });
    },
    getTask() {
        return this.tasks.list.shift();
    },
    execute(task, done) {
        task(done);
    },
});
