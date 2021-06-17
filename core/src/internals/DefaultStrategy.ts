import { Done, TaskWithMeta } from '../Interface';

import { CoreRunner } from './CoreRunner';

export type StrategyInit = () => void;
export type StrategyTransform<T = any> = (
    task: TaskWithMeta<T>
) => TaskWithMeta<T>;
export type StrategyGet<T = any> = () => TaskWithMeta<T> | undefined | void;
export type StrategyExecute<T = any> = (
    task: TaskWithMeta<T>,
    done: Done<T>
) => void;

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
    get: StrategyGet<T> = () => {
        return this.instance.tasks.list.shift();
    };
    execute: StrategyExecute<T> = (task, done) => {
        task(done);
    };
    init: StrategyInit = () => {
        return;
    };
    transform: StrategyTransform<T> = (task) => {
        return task;
    };
}
