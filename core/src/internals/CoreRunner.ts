'use strict';

import {
    IRunnerOptions,
    ITaskFunction,
    ITasks,
    IStrategy,
    IDuration,
    RemovalMethods,
    IOnAdd,
    IOnStart,
    IOnRun,
    IOnRemove,
    IOnDone,
    IOnEnd,
} from '../Interface';
import { noop } from '../Utils';

import { DefaultOptions } from './DefaultOptions';
import {
    addCheck,
    removeCheck,
    runPending,
    startCheck,
    startCheckAndRunPending,
} from './PrivateFunctions';

export class CoreRunner<T = any, TOptions = any> {
    static runnerCount = 0;

    protected readonly options: IRunnerOptions<T, TOptions>;
    protected readonly strategy: IStrategy<T>;

    protected __working = false;
    protected __destroyed = false;
    protected __paused = false;

    public tasks: ITasks<T> = {
        total: 0,
        completed: 0,
        running: 0,
        list: [],
    };

    public duration: IDuration = {
        total: 0,
    };

    constructor(
        strategy: IStrategy<T>,
        options?: Partial<IRunnerOptions<T, TOptions>>
    ) {
        this.options = {
            ...DefaultOptions<T, TOptions>(
                `Runner-${++CoreRunner.runnerCount}`
            ),
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

    protected setDestroyed(destroyed: boolean) {
        this.__destroyed = destroyed;
    }

    public start(): boolean {
        if (this.__working || this.__destroyed) {
            return false;
        }

        if (this.options.autoStart) {
            return false;
        }

        startCheck.call(this);
        runPending.call(this);
        return true;
    }

    public destroy(): boolean {
        this.__destroyed = true;
        this.__working = false;

        return true;
    }

    public on(event: 'start', callback: IOnStart<T>): void;
    public on(event: 'add', callback: IOnAdd<T>): void;
    public on(event: 'remove', callback: IOnRemove<T>): void;
    public on(event: 'run', callback: IOnRun<T>): void;
    public on(event: 'done', callback: IOnDone<T>): void;
    public on(event: 'end', callback: IOnEnd<T>): void;
    public on(event: string, callback: any): void {
        const newEvent = `on${event.charAt(0).toUpperCase() + event.substr(1)}`;
        (this.options as any)[newEvent] = callback;
    }

    public off(
        event: 'start' | 'add' | 'remove' | 'run' | 'done' | 'end'
    ): void {
        const newEvent = `on${event.charAt(0).toUpperCase() + event.substr(1)}`;
        (this.options as any)[newEvent] = noop;
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
