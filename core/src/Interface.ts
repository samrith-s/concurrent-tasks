'use strict';

import { Strategy } from './internals/DefaultStrategy';

export type TaskID = number;
export type Done<T = any> = (result?: T) => void;
export type Task<T = any> = (done: Done<T>) => void;
export type TaskReturn<T> = T | void;

export interface TaskWithMeta<T = any> {
    (done: Done<T>): TaskReturn<T> | Promise<TaskReturn<T>>;
    meta: {
        id: TaskID;
        execution: {
            start: Date;
            end: Date | null;
            time: number;
        };
    };
}

export interface TasksDescriptor<T = any> {
    total: number;
    completed: number;
    running: number;
    list: TaskWithMeta<T>[];
}

export const RemovalMethods = {
    ALL: 'all',
    BY_ID: 'by-id',
} as const;

export type RemovalMethods = typeof RemovalMethods[keyof typeof RemovalMethods];

export interface Duration {
    start?: Date;
    end?: Date;
    total?: number;
}

export type OnStart<T = any> = ({
    tasks,
    duration,
}: {
    tasks: TasksDescriptor<T>;
    duration: Duration;
}) => void;
export type OnAdd<T = any> = ({ tasks }: { tasks: TasksDescriptor<T> }) => void;
export type OnRemove<T = any> = ({
    tasks,
    method,
    removedTasks,
}: {
    tasks: TasksDescriptor<T>;
    method: RemovalMethods;
    removedTasks: TaskWithMeta<T>[];
}) => void;
export type OnRun<T = any> = ({
    task,
    tasks,
    duration,
}: {
    task: TaskWithMeta<T>;
    tasks: TasksDescriptor<T>;
    duration: Duration;
}) => void;
export type OnDone<T = any> = ({
    task,
    tasks,
    result,
}: {
    task: TaskWithMeta<T>;
    tasks: TasksDescriptor<T>;
    result?: T;
}) => void;
export type OnEnd<T = any> = ({
    tasks,
    duration,
}: {
    tasks: TasksDescriptor<T>;
    duration: Duration;
}) => void;

export interface RunnerEvents<T> {
    onStart: OnStart<T>;
    onAdd: OnAdd<T>;
    onRemove: OnRemove<T>;
    onRun: OnRun<T>;
    onDone: OnDone<T>;
    onEnd: OnEnd<T>;
}

export interface RunnerDefaultOptions<T, TOptions> extends RunnerEvents<T> {
    strategy?: Strategy<T, TOptions>;
    concurrency: number;
    autoStart: boolean;
    name: string | (() => string);
}

export type RunnerOptions<T = any, TOptions = any> = {
    [K in keyof RunnerDefaultOptions<T, TOptions>]: RunnerDefaultOptions<
        T,
        TOptions
    >[K];
};
