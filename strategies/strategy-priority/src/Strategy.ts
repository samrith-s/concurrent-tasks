'use strict';

import { IStrategy } from '@concurrent-tasks/core';

import { PriorityTask, StrategyPriorityOptions } from './Interface';

// const PRIORITY_QUEUE = {};

export function priorityTask<T>(task: PriorityTask<T>, priority: number) {
    task.__priority = priority;
    return task;
}

export function Strategy<T>(
    strategyOptions: Partial<StrategyPriorityOptions> = {}
): IStrategy<T> {
    const options: StrategyPriorityOptions = {
        maintainPriorityQueueAcrossLifecycle: false,
        ...strategyOptions,
    };
    console.log(options);
}
