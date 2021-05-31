import { checkResults, createRunner } from '../../testing-utils';

describe('DefaultStrategy', () => {
    it('should run the tasks and print in the expected order', () => {
        const { runner, results, expected } = createRunner({
            onEnd() {
                checkResults(results, expected);
            },
        });
        runner.start();
    });
});
