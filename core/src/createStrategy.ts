import { IStrategy } from './Interface';

export function createStrategy<
    TStrategyOptions = any,
    TStrategyConfig = Record<string | number | symbol, any>
>(strategy: IStrategy<any, TStrategyOptions, TStrategyConfig>) {
    return function CreatedStrategy<T = any>(
        options: Partial<TStrategyOptions> = {}
    ) {
        strategy.options = {
            ...strategy.options,
            ...options,
        } as TStrategyOptions;

        return strategy as IStrategy<T, TStrategyOptions, TStrategyConfig>;
    };
}
