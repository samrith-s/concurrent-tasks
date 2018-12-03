import TaskRunner from 'concurrent-tasks';
import { getElements } from './util/helper';
import { addMultipleTasks } from './util/task';

document.addEventListener('DOMContentLoaded', () => {
    const {
        element,
        console: { start, done, end },
        concurrency,
        button
    } = getElements('example-2');
    const startButton = element.querySelector('.start');

    const runner = new TaskRunner({
        concurrency: concurrency.value,
        autoStart: false,
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
            startButton.removeAttribute('disabled');
            end.innerText = `✨ Completed all tasks in: ${(
                total / 1000
            ).toFixed(2)}s`;
        }
    });

    button.onclick = () => {
        addMultipleTasks(runner, 1000);
        start.innerText = `Total tasks: ${runner.tasks.total}`;
        done.innerText = '';
        end.innerText = '';
    };

    startButton.onclick = () => {
        button.setAttribute('disabled', true);
        startButton.setAttribute('disabled', true);
        runner.setConcurrency(parseInt(concurrency.value, 10));
        runner.start();
    };
});
