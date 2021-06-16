'use strict';

import { ITaskFunction } from '@concurrent-tasks/core';

export interface StrategyPriorityOptions {
    totalPriorities: number;
}

export interface PriorityTask<T = any> extends ITaskFunction<T> {
    __priority: number;
}
