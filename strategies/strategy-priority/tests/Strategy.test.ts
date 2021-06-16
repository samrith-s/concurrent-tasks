import { runTest } from '../../../testing-utils';
import { StrategyPriority, StrategyPriorityOptions } from '../src';

import { generatePriorityTasks } from './utils';

describe('Strategy Priority', () => {
    it('should run the tasks and print in the expected order', function (done) {
        this.timeout(5000);
        runTest<StrategyPriorityOptions>(done, {
            expected: [0, 2, 4, 6, 8, 1, 3, 5, 7, 9],
            tasks: generatePriorityTasks(),
            strategy: new StrategyPriority<number>({
                totalPriorities: 2,
            }),
        });
    });
});
