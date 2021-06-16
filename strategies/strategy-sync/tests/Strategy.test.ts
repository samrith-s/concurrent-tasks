import { runTest } from '../../../testing-utils';
import { StrategySyncOptions, StrategySync } from '../src';

import { generateAsyncTasks } from './utils';

describe('Strategy Sync', () => {
    it('should run the tasks and print in the expected order', function (done) {
        this.timeout(5000);
        runTest<StrategySyncOptions>(done, {
            tasks: generateAsyncTasks(),
            strategy: new StrategySync<number>(),
        });
    });
});
