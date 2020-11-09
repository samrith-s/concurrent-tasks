'use strict';

import { DefaultOptions } from '../DefaultOptions';
import {
    IRunnerOptions,
    ITaskFunction,
    ITasks,
    IStrategy,
    IDuration,
    RemovalMethods,
} from '../Interface';

import {
    addCheck,
    removeCheck,
    runPending,
    startCheck,
    startCheckAndRunPending,
} from './PrivateFunctions';

export class CoreRunner<T = any> {
    static runnerCount = 0;

    protected options: IRunnerOptions<T>;
    public tasks: ITasks<T> = {
        total: 0,
        completed: 0,
        running: 0,
        list: [],
    };
    public duration: IDuration = {
        total: 0,
    };

    protected strategy: IStrategy<T>;
    protected __working = false;
    protected __isPaused = false;

    constructor(strategy: IStrategy<T>, options?: Partial<IRunnerOptions<T>>) {
        this.options = {
            ...DefaultOptions(`Runner-${++CoreRunner.runnerCount}`),
            ...options,
        };
        this.strategy = strategy;
        Object.seal(this);
    }

    public isBusy(): boolean {
        return this.__working;
    }

    protected setWorking(working: boolean) {
        this.__working = working;
    }

    public start(): boolean {
        if (this.__working) {
            return false;
        }

        if (this.options.autoStart) {
            return false;
        }

        startCheck.call(this);
        runPending.call(this);
        return true;
    }

    public add(task: ITaskFunction<T>, first = false): number {
        if (first) {
            this.tasks.list.unshift(task);
        } else {
            this.tasks.list.push(task);
        }

        if (this.options.autoStart) {
            startCheckAndRunPending.call(this);
        }

        addCheck.call(this);
        return ++this.tasks.total;
    }

    public addFirst(task: ITaskFunction<T>): number {
        return this.add(task, true);
    }

    public addMultiple(tasks: ITaskFunction<T>[], first = false): number {
        if (first) {
            this.tasks.list = [...tasks, ...this.tasks.list];
        } else {
            this.tasks.list = [...this.tasks.list, ...tasks];
        }

        if (this.options.autoStart) {
            startCheckAndRunPending.call(this);
        }

        addCheck.call(this);

        return (this.tasks.total =
            this.tasks.list.length + this.tasks.completed);
    }

    public addMultipleFirst(tasks: ITaskFunction[]): number {
        return this.addMultiple(tasks, true);
    }

    public remove(first = false): ITaskFunction | undefined {
        let task;

        if (first) {
            task = this.tasks.list.shift();
        } else {
            task = this.tasks.list.pop();
        }

        --this.tasks.total;

        removeCheck.call(
            this,
            first
                ? RemovalMethods.SINGULAR_FIRST
                : RemovalMethods.SINGULAR_LAST,
            task ? [task] : []
        );

        return task;
    }

    public removeFirst(): ITaskFunction | undefined {
        const task = this.remove(true);
        removeCheck.call(
            this,
            RemovalMethods.SINGULAR_FIRST,
            task ? [task] : []
        );
        return task;
    }

    public removeAt(index: number): ITaskFunction | undefined {
        const tasks = this.tasks.list.splice(index, 1);
        --this.tasks.total;
        removeCheck.call(this, RemovalMethods.AT_INDEX, tasks);
        return tasks[0];
    }

    public removeRange(startIndex: number, endIndex: number): ITaskFunction[] {
        const tasks = this.tasks.list.splice(startIndex, endIndex + 1);
        this.tasks.total -= tasks.length;
        removeCheck.call(this, RemovalMethods.RANGE, tasks);
        return tasks;
    }

    public removeAll(): ITaskFunction[] {
        const tasks = this.tasks.list.slice();
        this.tasks.list = [];
        this.tasks.total = this.tasks.completed;
        removeCheck.call(this, RemovalMethods.ALL, tasks);
        return tasks;
    }
}
