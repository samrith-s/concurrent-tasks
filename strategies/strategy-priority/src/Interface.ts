'use strict';

import { ITaskFunction } from '@concurrent-tasks/core';

export interface StrategyPriorityOptions {
    maintainPriorityQueueAcrossLifecycle?: boolean;
}

export interface PriorityTask<T> extends ITaskFunction<T> {
    __priority: number;
}
