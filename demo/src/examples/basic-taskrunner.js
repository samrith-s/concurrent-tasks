import TaskRunner from 'concurrent-tasks';
import { getElements } from './util/helper';
import { queueTasks } from './util/task';

document.addEventListener('DOMContentLoaded', () => {
    const {
        console: { start, done, end },
        concurrency,
        button
    } = getElements('example-1');

    const runner = new TaskRunner({
        concurrency: concurrency.value,
        onStart({ duration: { start: startDate } }) {
            start.innerText = `Added 1000 tasks on ${new Date(startDate)}`;
        },
        onDone({ completed, total }) {
            done.innerText = `✅ Completed ${completed} of ${total} tasks with ${
                runner.concurrency
            } concurrency`;
        },
        onEnd({ duration: { total } }) {
            button.removeAttribute('disabled');
            end.innerText = `✨ Completed all tasks in: ${(
                total / 1000
            ).toFixed(2)}s`;
        }
    });

    button.onclick = () => {
        runner.setConcurrency(concurrency.value);
        button.setAttribute('disabled', true);
        start.innerText = '';
        done.innerText = '';
        end.innerText = '';

        queueTasks(runner, 1000);
    };
});
