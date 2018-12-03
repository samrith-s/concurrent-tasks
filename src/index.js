import { startCheckAndRun, startCheck, run } from './PrivateFunctions';
import log from './log';

import { assignFunction, isFunction, isArray, assignNumber } from './util';

export default class TaskRunner {
    static runnerCount = 0;

    constructor(config = {}) {
        const { concurrency, onStart, onDone, onEnd, ...otherConfig } = config;
        this.config = {
            autoStart: true,
            name: `Runner ${TaskRunner.runnerCount++}`,
            ...otherConfig
        };
        this.concurrency = assignNumber(concurrency, 3);
        this.onStart = assignFunction(onStart);
        this.onDone = assignFunction(onDone);
        this.onEnd = assignFunction(onEnd);
    }
    __working = false;
    tasks = {
        list: [],
        total: 0,
        completed: 0,
        running: 0
    };
    duration = {
        start: 0,
        end: 0,
        total: 0
    };

    setConcurrency = concurrency => {
        this.concurrency = assignNumber(concurrency, 3);
    };

    start = () => {
        if (this.__working) {
            console.warn(log.call(this, 'already_running'));
            return false;
        }

        if (this.config.autoStart) {
            console.warn(log.call(this, 'auto_start_true'));
            return false;
        }

        startCheck.call(this);
        for (let i = 0; i < this.concurrency; i++) {
            run.call(this);
        }
        return true;
    };

    add = task => {
        if (isFunction(task)) {
            const { autoStart } = this.config;
            this.tasks.list.push(task);
            this.tasks.total++;
            if (autoStart) {
                startCheckAndRun.call(this);
            }
            return true;
        }

        throw new TypeError(log('add_requires_function'));
    };

    addMultiple = tasks => {
        if (isArray(tasks) && tasks.every(t => isFunction(t))) {
            const { autoStart } = this.config;
            this.tasks = {
                ...this.tasks,
                list: [...this.tasks.list, ...tasks],
                total: tasks.length
            };
            if (autoStart) {
                startCheckAndRun.call(this);
            }
            return true;
        }

        throw new TypeError(
            log.call(this, 'add_multiple_requires_array_of_functions')
        );
    };

    remove = index => {
        this.tasks.list.splice(index, 1);
        this.tasks.total = this.tasks.list.length;
    };

    removeAll = () => {
        this.tasks.list = [];
        this.tasks.total = 0;
    };
}
