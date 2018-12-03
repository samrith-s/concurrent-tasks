import TaskRunner from 'concurrent-tasks';
import { getElements } from './util/helper';
import { queueTasks } from './util/task';

document.addEventListener('DOMContentLoaded', () => {
    const runner = new TaskRunner({
        concurrency: 100
    });

    const {
        console: { start, done, end },
        button
    } = getElements('example-1');

    button.onclick = () => {
        button.setAttribute('disabled', true);
        start.innerText = '';
        done.innerText = '';
        end.innerText = '';

        queueTasks(runner, 1000, {
            onStart() {
                alert('start run!');
                start.innerText = 'Tasks have begun!';
            },
            onDone({ completed, total }) {
                done.innerText = `✅ Completed ${completed} of ${total} tasks`;
            },
            onEnd({ duration: { total } }) {
                button.removeAttribute('disabled');
                end.innerText = `✨ Completed all tasks in: ${(
                    total / 1000
                ).toFixed(2)}s`;
            }
        });
    };
});
