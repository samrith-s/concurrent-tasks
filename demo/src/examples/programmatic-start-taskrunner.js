'use strict';

import TaskRunner from '../../../es';
import { getElements } from './util/helper';
import { addMultipleTasks } from './util/task';

document.addEventListener('DOMContentLoaded', () => {
    const {
        element,
        progress,
        console: { info, start, done, end },
        concurrency,
        button
    } = getElements('example-2');
    const startButton = element.querySelector('.start');

    const runner = new TaskRunner({
        concurrency: parseInt(concurrency.input.value, 10),
        autoStart: false,
        onAdd() {
            if (!runner.isBusy()) {
                startButton.removeAttribute('disabled');
            }
        },
        onStart({ duration: { start: startDate } }) {
            start.innerText = `‍‍🏃🏻‍ Started at ${new Date(startDate)}`;
        },
        onDone({ completed, total }) {
            progress.style.width = `${(completed / total) * 100}%`;
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
        addMultipleTasks(runner, 1000);
        info.innerText = `ℹ️ Total tasks: ${runner.tasks.total}`;
    };

    startButton.onclick = () => {
        start.innerText = '';
        done.innerText = '';
        end.innerText = '';
        startButton.setAttribute('disabled', true);
        runner.setConcurrency(parseInt(concurrency.input.value, 10));
        runner.start();
    };

    concurrency.set.onclick = () => {
        runner.setConcurrency(parseInt(concurrency.input.value, 10));
    };
});
