'use strict';

import { CT } from '@concurrent-tasks/core';

export interface StrategyPriorityOptions {
    totalPriorities: number;
}

export interface PriorityTask<T = any> extends CT.TaskWithMeta<T> {
    __priority: number;
}
