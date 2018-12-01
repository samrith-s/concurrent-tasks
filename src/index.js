import { startCheckAndRun } from './PrivateFunctions';
import log from './log';

import { assignFunction, isFunction, isArray, isNumber } from './util';

export default class ConcurrentTasks {
    constructor(config = {}) {
        const { concurrency, onStart, onDone, onEnd, ...otherConfig } = config;
        this.config = {
            autoStart: true,
            ...otherConfig
        };
        this.concurrency = isNumber(concurrency) ? concurrency : 3;
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

    start = () => {
        if (this.__working) {
            log('already_running');
            return false;
        }

        if (this.config.autoStart) {
            log('auto_start_true');
            return false;
        }

        startCheckAndRun.call(this);
        return true;
    };

    add = task => {
        const { autoStart } = this.config;
        this.tasks.list.push(task);
        this.tasks.total++;
        if (autoStart) {
            startCheckAndRun.call(this);
        }
    };

    addMultiple = tasks => {
        if (isArray(tasks) && tasks.every(t => isFunction(t))) {
            const { autoStart } = this.config;
            this.tasks = {
                list: tasks,
                total: tasks.length
            };
            if (autoStart) {
                startCheckAndRun.call(this);
            }
        }
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
