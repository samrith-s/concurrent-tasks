'use strict';

import { CoreRunner } from './CoreRunner';

export type IDoneFunction<T = any> = (result?: T) => void;
export type ITaskFunction<T = any> = (done: IDoneFunction<T>) => void;

export interface ITasks<T = any> {
    total: number;
    completed: number;
    running: number;
    list: ITaskFunction<T>[];
}

export const RemovalMethods = {
    ALL: 'all',
    SINGULAR_LAST: 'singular-last',
    SINGULAR_FIRST: 'singular-first',
    AT_INDEX: 'at-index',
    RANGE: 'range',
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
    tasks,
    result,
}: {
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

export interface IRunnerOptions<T = any> {
    concurrency: number;
    autoStart: boolean;
    name: string | (() => string);
    onAdd: IOnAdd<T>;
    onRemove: IOnRemove<T>;
    onStart: IOnStart<T>;
    onRun: IOnRun<T>;
    onDone: IOnDone<T>;
    onEnd: IOnEnd<T>;
}

export type IStrategy<T = any> = (
    this: CoreRunner,
    task: ITaskFunction<T>,
    done: IDoneFunction<T>
) => void;
