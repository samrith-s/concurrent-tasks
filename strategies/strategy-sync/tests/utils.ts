import { Task } from '@concurrent-tasks/core';

export function generateAsyncTasks(count = 10, timeout = 5) {
    const tasks: Task<number>[] = [];

    for (let i = 0; i < count; i++) {
        tasks.push(function (): Promise<number> {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(i);
                }, timeout);
            });
        });
    }

    return tasks;
}
