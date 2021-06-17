'use strict';

import { IDoneFunction, ITaskFunction } from '../Interface';

import { CoreRunner } from './CoreRunner';

export type StrategyInit = () => void;
export type StrategyTransform<T = any> = (task: ITaskFunction<T>) => ITaskFunction<T>
export type StrategyGet<T = any> = () => ITaskFunction<T> | undefined | void;
export type StrategyExecute<T = any> = (task: ITaskFunction<T>, done: IDoneFunction<T>) => void;

export class Strategy<T = any, TOptions = Record<string, any>> {
    constructor(defaultConfig: TOptions, config: Partial<TOptions> = {}) {
        this.config = {
            ...defaultConfig,
            ...config,
        } as TOptions;
    }
    config: TOptions = {} as TOptions;
    instance = {} as Omit<
        CoreRunner<T, TOptions>,
        '__working' | '__destroyed' | '__paused'
    >;
    get: StrategyGet<T> = () =>  {
        return this.instance.tasks.list.shift();
    }
    execute: StrategyExecute<T> = (task, done) => {
        task(done);
    }
    init: StrategyInit = () => {
        return;
    }
    transform: StrategyTransform<T> = (task) => {
        return task;
    }
}
