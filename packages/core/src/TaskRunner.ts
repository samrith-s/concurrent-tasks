'use strict';

import { IRunnerOptions } from './Interface';
import { CoreStrategy } from './Strategy';
import { CoreRunner } from './core/CoreRunner';

export class TaskRunner<T> extends CoreRunner<T> {
    constructor(options?: Partial<IRunnerOptions>) {
        super(CoreStrategy, options);
    }
}

// function generateTasks(count: number) {
//     const tasks: ITaskFunction<number>[] = [];

//     for (let i = 0; i < count; i++) {
//         tasks.push(function Task(done) {
//             const rand = Math.round(Math.random() * 19 + 1) * 100;
//             setTimeout(() => {
//                 console.log(`Task ${i + 1} done!`);
//                 done(rand);
//             }, rand);
//         });
//     }

//     return tasks;
// }

// const runner = new TaskRunner<number>({
//     autoStart: false,
//     onStart() {
//         console.log('started!');
//     },
//     onDone({ tasks, result }) {
//         console.log('Progress:', `${tasks.completed} / ${tasks.total}`);
//         console.log('Running:', tasks.running);
//         console.log('Data:', result);
//         console.log('');
//     },
// });

// runner.addMultiple(generateTasks(100));
// runner.start();
