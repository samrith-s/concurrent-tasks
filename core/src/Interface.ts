'use strict';

import { Strategy } from './internals/DefaultStrategy';

export type TaskID = number;
export type Task<T = any> = (done: IDoneFunction<T>) => void;
export type ITaskReturn<T> = T | void;
export type IDoneFunction<T = any> = (result?: T) => void;

export interface ITaskFunction<T = any> {
    (done: IDoneFunction<T>): ITaskReturn<T> | Promise<ITaskReturn<T>>;
    meta: {
        id: TaskID;
        execution: {
            start: Date;
            end: Date | null;
            time: number;
        };
    };
}

export interface ITasks<T = any> {
    total: number;
    completed: number;
    running: number;
    list: ITaskFunction<T>[];
}

export const RemovalMethods = {
    ALL: 'all',
    BY_ID: 'by-id',
} as const;

export type IRemovalMethods = typeof RemovalMethods[keyof typeof RemovalMethods];

export interface IDuration {
    start?: Date;
    end?: Date;
    total?: number;
}

export type IOnStart<T = any> = ({
    tasks,
    duration,
}: {
    tasks: ITasks<T>;
    duration: IDuration;
}) => void;
export type IOnAdd<T = any> = ({ tasks }: { tasks: ITasks<T> }) => void;
export type IOnRemove<T = any> = ({
    tasks,
    method,
    removedTasks,
}: {
    tasks: ITasks<T>;
    method: IRemovalMethods;
    removedTasks: ITaskFunction<T>[];
}) => void;
export type IOnRun<T = any> = ({
    task,
    tasks,
    duration,
}: {
    task: ITaskFunction<T>;
    tasks: ITasks<T>;
    duration: IDuration;
}) => void;
export type IOnDone<T = any> = ({
    task,
    tasks,
    result,
}: {
    task: ITaskFunction<T>;
    tasks: ITasks<T>;
    result?: T;
}) => void;
export type IOnEnd<T = any> = ({
    tasks,
    duration,
}: {
    tasks: ITasks<T>;
    duration: IDuration;
}) => void;

export interface IRunnerEvents<T> {
    onStart: IOnStart<T>;
    onAdd: IOnAdd<T>;
    onRemove: IOnRemove<T>;
    onRun: IOnRun<T>;
    onDone: IOnDone<T>;
    onEnd: IOnEnd<T>;
}

export interface IRunnerDefaultOptions<T, TOptions> extends IRunnerEvents<T> {
    strategy?: Strategy<T, TOptions>;
    concurrency: number;
    autoStart: boolean;
    name: string | (() => string);
}

export type IRunnerOptions<T = any, TOptions = any> = {
    [K in keyof IRunnerDefaultOptions<T, TOptions>]: IRunnerDefaultOptions<
        T,
        TOptions
    >[K];
};
