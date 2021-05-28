'use strict';

import { createStrategy } from '@concurrent-tasks/core';

import { StrategySyncOptions } from './Interface';

const dummyDone = () => void 0;

export const Strategy = createStrategy<StrategySyncOptions>({
    options: {
        passErrorToDone: false,
        passResultToDone: true,
        logError: false,
    },
    getTask() {
        return this.tasks.list.shift();
    },
    async execute(task, done) {
        const { passResultToDone, passErrorToDone, logError } = this.options;

        try {
            const result = await task(dummyDone);
            done(passResultToDone && result !== undefined ? result : undefined);
        } catch (error) {
            if (logError) {
                console.error(error);
            }
            done(passErrorToDone && error !== undefined ? error : undefined);
        }
    },
});

// export function Strategy<T>(
//     strategyOptions: Partial<StrategySyncOptions> = {}
// ): IStrategy<T> {
//     const options: StrategySyncOptions = {
//         passErrorToDone: false,
//         passResultToDone: true,
//         logError: false,
//         ...strategyOptions,
//     };

//     return async function InnerStrategy(task, done) {
//         try {
//             const result = await task(dummyDone);
//             done(
//                 options.passResultToDone && result !== undefined
//                     ? result
//                     : undefined
//             );
//         } catch (error) {
//             if (options.logError) {
//                 console.error(error);
//             }
//             done(
//                 options.passErrorToDone && error !== undefined
//                     ? error
//                     : undefined
//             );
//         }
//     };
// }
