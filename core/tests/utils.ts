import { Task } from '../src';

export function generateTasks(count = 10, timeout = 5) {
    const tasks: Task<number>[] = [];

    for (let i = 0; i < count; i++) {
        tasks.push(function (done) {
            setTimeout(() => {
                done(i);
            }, timeout);
        });
    }

    return tasks;
}
