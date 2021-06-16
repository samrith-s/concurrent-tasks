import { runTest } from '../../testing-utils';

import { generateTasks } from './utils';

describe('DefaultStrategy', () => {
    it('should run the tasks and print in the expected order', (done) => {
        runTest(done, {
            tasks: generateTasks(),
        });
    });
});
