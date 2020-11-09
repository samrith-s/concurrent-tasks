'use strict';

import { IDoneFunction, IRemovalMethods, ITaskFunction } from '../Interface';
import { isFunction } from '../Utils';

import { CoreRunner } from './CoreRunner';

/**
 * Handles running a task, and updating metadata.
 */
export function run(this: CoreRunner) {
    if (this.tasks.list.length) {
        if (this.tasks.running < this.options.concurrency) {
            const task = this.tasks.list.shift();
            if (task) {
                this.tasks.running++;
                if (isFunction(this.options.onRun)) {
                    const { tasks, duration } = this;
                    this.options.onRun({ task, tasks, duration });
                }
                this.strategy(task, done.bind(this));
            }
        }
    } else {
        if (this.tasks.completed === this.tasks.total) {
            this.duration.end = new Date();
            this.duration.total =
                (this.duration.end.valueOf() ?? 0) -
                (this.duration.start?.valueOf() ?? 0);
            this.setWorking(false);
            if (isFunction(this.options.onEnd)) {
                const { tasks, duration } = this;
                this.options.onEnd({ tasks, duration });
            }
        }
    }
}

/**
 * Checks if slots are available and fills them up with tasks in the queue. Calls `run` internally.
 */
export function runPending(this: CoreRunner) {
    if (this.tasks.running < this.options.concurrency) {
        for (let i = this.tasks.running; i < this.options.concurrency; i++) {
            run.call(this);
        }
    }
}

/**
 * The done function marks a task as done, and frees a slot in the queue, subsequently calling `run` to fill that slot up.
 * @param result - The result of the task which can be accessed in `onDone`.
 */
const done: IDoneFunction = function done(this: CoreRunner, result) {
    this.tasks.completed++;
    this.tasks.running--;
    this.duration.total = Date.now() - (this.duration.start?.valueOf() ?? 0);
    if (isFunction(this.options.onDone)) {
        const { tasks } = this;
        this.options.onDone({ tasks, result });
    }
    run.call(this);
};

/**
 * Checks whether the runner is free to start and triggers `onStart` method (if provided).
 */
export function startCheck(this: CoreRunner) {
    if (!this.__working) {
        this.duration.start = new Date();
        this.setWorking(true);
        if (isFunction(this.options.onStart)) {
            const { tasks, duration } = this;
            this.options.onStart({ tasks, duration });
        }
    }
}

/**
 * Triggers the `onAdd` method (if provided).
 */
export function addCheck(this: CoreRunner) {
    if (isFunction(this.options.onAdd)) {
        const { tasks } = this;
        this.options.onAdd({ tasks });
    }
}

/**
 * Triggers the `onRemove` method (if provided).
 */
export function removeCheck(
    this: CoreRunner,
    method: IRemovalMethods,
    removedTasks: ITaskFunction[]
) {
    if (isFunction(this.options.onRemove)) {
        const { tasks } = this;
        this.options.onRemove({ tasks, method, removedTasks });
    }
}

/**
 * Checks whether the runner is free to start and runs pending. Triggers both `onStart` and `onRun` methods (if provided).
 */
export function startCheckAndRunPending(this: CoreRunner) {
    startCheck.call(this);
    runPending.call(this);
}
