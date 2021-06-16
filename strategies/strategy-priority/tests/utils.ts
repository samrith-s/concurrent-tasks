import { Task } from '@concurrent-tasks/core';

import { priorityTask } from '../src';

export function generatePriorityTasks(count = 10, timeout = 5) {
    const tasks: Task<number>[] = [];

    for (let i = 0; i < count; i++) {
        tasks.push(
            priorityTask(function (done) {
                setTimeout(() => {
                    done(i);
                }, timeout);
            }, i % 2)
        );
    }

    return tasks;
}
