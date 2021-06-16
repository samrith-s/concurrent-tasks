'use strict';

import { Strategy, Task } from '@concurrent-tasks/core';

import { PriorityTask, StrategyPriorityOptions } from './Interface';

export function priorityTask<T = any>(task: Task<T>, priority: number) {
    (task as PriorityTask<T>).__priority = priority;
    return task;
}

export class StrategyPriority<T = any> extends Strategy<
    T,
    StrategyPriorityOptions
> {
    constructor(config: Partial<StrategyPriorityOptions>) {
        super(config);
    }

    defaultConfig = {
        totalPriorities: 5,
    };
    logged = false;
    taskIds: number[][] = [[]];
    currentPriority = 0;
    count = 0;

    init: Strategy<T>['init'] = () => {
        this.taskIds = new Array(this.config.totalPriorities)
            .fill(0)
            .reduce((acc) => {
                acc.push([]);
                return acc;
            }, []);
    };

    transform: Strategy<T>['transform'] = (task) => {
        const { totalPriorities } = this.config;
        let priority = (task as PriorityTask).__priority;

        if (priority > totalPriorities - 1) {
            priority = totalPriorities - 1;
        }

        if (!isNaN(priority)) {
            if (this.currentPriority > priority) {
                this.currentPriority = priority;
            }

            if (this.taskIds[priority]) {
                this.taskIds[priority].push(task.meta.id);
            } else {
                this.taskIds[priority] = [task.meta.id];
            }
        }

        return task;
    };

    get: Strategy<T>['get'] = () => {
        const id = this.taskIds[this.currentPriority].shift() as number;

        if (id) {
            const taskIndex = this.instance.tasks.list.findIndex(
                (task) => task.meta.id === id
            );
            if (taskIndex > -1) {
                const [task] = this.instance.tasks.list.splice(taskIndex, 1);
                return task;
            }
        }

        this.currentPriority = this.currentPriority + 1;

        if (this.currentPriority > this.config.totalPriorities - 1) {
            this.currentPriority = this.config.totalPriorities - 1;
        }

        return this.get();
    };
}
