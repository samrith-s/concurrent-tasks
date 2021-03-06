'use strict';

import {
    RunnerOptions,
    TasksDescriptor,
    Duration,
    OnStart,
    OnAdd,
    OnRemove,
    OnRun,
    OnDone,
    OnEnd,
    Task,
    TaskWithMeta,
    TaskID,
    RemovalMethods,
} from '../Interface';
import { noop } from '../Utils';

import { DefaultOptions } from './DefaultOptions';
import { Strategy } from './DefaultStrategy';
import {
    addCheck,
    removeCheck,
    runPending,
    startCheck,
    startCheckAndRunPending,
} from './PrivateFunctions';

export class CoreRunner<T = any, TOptions = any> {
    static runnerCount = 0;

    public readonly strategy: Strategy<T, TOptions>;

    protected __working = false;
    protected __destroyed = false;
    protected __paused = false;

    public readonly options: RunnerOptions<T, TOptions>;

    public tasks: TasksDescriptor<T> = {
        total: 0,
        completed: 0,
        running: 0,
        list: [],
    };

    public duration: Duration = {
        total: 0,
    };

    private taskIds = 0;

    constructor(
        strategy: Strategy<T, TOptions>,
        options?: Partial<RunnerOptions<T, TOptions>>
    ) {
        this.options = {
            ...DefaultOptions<T, TOptions>(
                `Runner-${++CoreRunner.runnerCount}`
            ),
            ...options,
        };
        strategy.instance = this;
        this.strategy = strategy;
        this.strategy.init();
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

    public on(event: 'start', callback: OnStart<T>): void;
    public on(event: 'add', callback: OnAdd<T>): void;
    public on(event: 'remove', callback: OnRemove<T>): void;
    public on(event: 'run', callback: OnRun<T>): void;
    public on(event: 'done', callback: OnDone<T>): void;
    public on(event: 'end', callback: OnEnd<T>): void;
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

    public add(task: Task<T>): TaskWithMeta<T> {
        const newTask = task as TaskWithMeta<T>;
        newTask.meta = {
            id: ++this.taskIds,
            execution: {
                start: new Date(),
                end: null,
                time: 0,
            },
        };

        const transformedTask = this.strategy.transform(newTask);

        this.tasks.list.push(transformedTask);
        this.tasks.total++;

        if (this.options.autoStart) {
            startCheckAndRunPending.call(this);
        }

        addCheck.call(this);
        return newTask;
    }

    public addMultiple(tasks: Task<T>[]): TaskWithMeta<T>[] {
        return tasks.map((task) => this.add(task));
    }

    public remove(id: TaskID): TaskWithMeta<T> | void {
        const taskIndex = this.tasks.list.findIndex(
            (task) => task.meta.id === id
        );

        if (taskIndex > -1) {
            const task = this.tasks.list.splice(taskIndex, 1).pop();
            --this.tasks.total;

            removeCheck.call(this, RemovalMethods.BY_ID, task ? [task] : []);
            return task;
        }

        return void 0;
    }

    public removeAll(): TaskWithMeta<T>[] {
        const tasks = this.tasks.list.slice();
        this.tasks.list = [];
        this.tasks.total = this.tasks.completed;
        removeCheck.call(this, RemovalMethods.ALL, tasks);
        return tasks;
    }
}
