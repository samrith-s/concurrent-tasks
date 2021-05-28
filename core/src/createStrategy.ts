import { IStrategy } from './Interface';

export function createStrategy<TStrategyOptions = any>(
    strategy: IStrategy<any, TStrategyOptions>
) {
    return function CreatedStrategy<T = any>(
        options: Partial<TStrategyOptions> = {}
    ) {
        strategy.options = {
            ...strategy.options,
            ...options,
        } as TStrategyOptions;

        return strategy as IStrategy<T, TStrategyOptions>;
    };
}
