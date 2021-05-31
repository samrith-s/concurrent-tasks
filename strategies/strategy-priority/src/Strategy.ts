'use strict';

import { createStrategy } from '@concurrent-tasks/core';

import {
    PriorityTask,
    StrategyPriorityConfig,
    StrategyPriorityOptions,
} from './Interface';

export function priorityTask<T = any>(task: PriorityTask<T>, priority: number) {
    task.__priority = priority;
    return task;
}

export const Strategy = createStrategy<
    StrategyPriorityOptions,
    StrategyPriorityConfig
>({
    indices: [[]],
    init() {
        this.indices = new Array(this.options?.totalPriorities)
            .fill(0)
            .reduce((acc) => {
                acc.push([]);
                return acc;
            }, []);
    },
    currentPriority: 0,
    transform(task: PriorityTask) {
        let priority = task.__priority;

        if (priority > this.options.totalPriorities - 1) {
            priority = this.options.totalPriorities - 1;
        }

        if (!isNaN(priority)) {
            if (this.currentPriority > priority) {
                this.currentPriority = priority;
            }

            if (this.indices[priority]) {
                this.indices[priority].push(this.tasks.list.length);
            } else {
                this.indices[priority] = [this.tasks.list.length];
            }
        }

        return task;
    },
    options: {
        totalPriorities: 5,
    },
    getTask() {
        const index = this.indices[this.currentPriority].shift() as number;

        if (index >= 0) {
            return this.tasks.list.splice(index, 1)[0];
        }

        this.currentPriority += 1;

        if (this.currentPriority > this.options.totalPriorities - 1) {
            this.currentPriority = this.options.totalPriorities - 1;
            return;
        }

        return this.getTask();
    },
    execute(task, done) {
        task(done);
    },
});
