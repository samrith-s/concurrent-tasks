'use strict';

import {
    startCheckAndRun,
    runPending,
    startCheck,
    addCheck,
    removeCheck,
    setAppropriateConcurrency
} from './PrivateFunctions';
import log from './log';

import { assignFunction, isFunction, isArray, assignNumber } from './util';
import { isNumber } from '../es/util';

export default class TaskRunner {
    static runnerCount = 0;

    constructor(config = {}) {
        const {
            concurrency,
            onAdd,
            onStart,
            onDone,
            onEnd,
            ...otherConfig
        } = config;
        this.config = {
            autoStart: true,
            name: `Runner ${++TaskRunner.runnerCount}`,
            ...otherConfig
        };
        this.concurrency = this.setConcurrency(concurrency);
        this.onAdd = assignFunction(onAdd);
        this.onStart = assignFunction(onStart);
        this.onDone = assignFunction(onDone);
        this.onEnd = assignFunction(onEnd);
        Object.seal(this);
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

    isBusy = () => this.__working;

    setConcurrency = concurrency => {
        concurrency = parseInt(concurrency, 10);
        if (!isNumber(concurrency)) {
            console.warn(log.call(this, 'concurrency_not_a_number'));
        }

        if (concurrency < 0) {
            concurrency = Math.abs(concurrency);
            console.warn(
                log.call(this, 'concurrency_should_be_positive_integer')
            );
        }

        this.concurrency = assignNumber(concurrency, 3, this.tasks.total);
        if (this.__working) {
            runPending.call(this);
        }
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
        runPending.call(this);
        return true;
    };

    add = (task, first = false) => {
        if (isFunction(task)) {
            const { autoStart } = this.config;

            if (first) {
                this.tasks.list.push(task);
            } else {
                this.tasks.list.unshift(task);
            }

            this.tasks.total++;
            if (autoStart) {
                startCheckAndRun.call(this);
            }

            addCheck.call(this);
            return true;
        }

        throw new TypeError(log('add_requires_function'));
    };

    addFirst = task => {
        this.add(task, true);
    };

    addMultiple = (tasks, first) => {
        if (isArray(tasks) && tasks.every(t => isFunction(t))) {
            const { autoStart } = this.config;

            this.tasks = {
                ...this.tasks,
                list: first
                    ? [...tasks, ...this.tasks.list]
                    : [...this.tasks.list, ...tasks],
                total: this.tasks.total + tasks.length
            };

            if (autoStart) {
                startCheckAndRun.call(this);
            }

            addCheck.call(this);
            return true;
        }

        throw new TypeError(
            log.call(this, 'add_multiple_requires_array_of_functions')
        );
    };

    addMultipleFirst = tasks => {
        this.addMultiple(tasks, first);
    };

    remove = (first = false) => {
        const task = first ? this.tasks.list.shift() : this.tasks.list.pop();
        this.tasks.total = this.tasks.list.length + this.tasks.completed;
        removeCheck.call(this);
        return task;
    };

    removeFirst = () => {
        this.remove(true);
    };

    removeAt = index => {
        const task = this.tasks.list.splice(index, 1);
        this.tasks.total = this.tasks.list.length + this.tasks.completed;
        removeCheck.call(this);
        return task;
    };

    removeAll = () => {
        this.tasks.list = [];
        this.tasks.total = this.tasks.completed;
        removeCheck.call(this);
        return this.tasks.list;
    };
}
