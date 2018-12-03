import TaskRunner from '../../../es';
import { getElements } from './util/helper';
import { multipleTasks } from './util/task';

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
            end.innerText = `✨ Completed all tasks in: ${(
                total / 1000
            ).toFixed(2)}s`;
        }
    });

    button.onclick = () => {
        button.setAttribute('disabled', true);
        start.innerText = 'Added 1000 tasks!';
        done.innerText = '';
        end.innerText = '';

        multipleTasks(runner, 1000);
        console.log(runner);
    };

    startButton.onclick = () => {
        button.setAttribute('disabled', true);
        startButton.setAttribute('disabled', true);
        runner.setConcurrency(parseInt(concurrency.value, 10));
        runner.start();
    };
});
