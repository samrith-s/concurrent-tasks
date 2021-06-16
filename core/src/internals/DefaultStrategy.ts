'use strict';

import { IDoneFunction, ITaskFunction } from '../Interface';

import { CoreRunner } from './CoreRunner';

export class Strategy<T = any, TOptions = Record<string, any>> {
    constructor(config: Partial<TOptions> = {}) {
        this.config = {
            ...this.defaultConfig,
            ...config,
        } as TOptions;
    }
    config: TOptions = {} as TOptions;
    defaultConfig: TOptions = {} as TOptions;
    instance = {} as Omit<
        CoreRunner<T, TOptions>,
        '__working' | '__destroyed' | '__paused'
    >;
    get(): ITaskFunction<T> | undefined | void {
        return this.instance.tasks.list.shift();
    }
    execute(task: ITaskFunction<T>, done: IDoneFunction<T>): void {
        task(done);
    }
    init(): void {
        return;
    }
    transform(task: ITaskFunction<T>): ITaskFunction<T> {
        return task;
    }
}
