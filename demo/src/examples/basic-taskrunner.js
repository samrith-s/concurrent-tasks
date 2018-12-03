'use strict';

import TaskRunner from 'concurrent-tasks';
import { getElements } from './util/helper';
import { queueTasks } from './util/task';

document.addEventListener('DOMContentLoaded', () => {
    const {
        progress,
        console: { info, start, done, end },
        concurrency,
        button
    } = getElements('example-1');

    const runner = new TaskRunner({
        concurrency: parseInt(concurrency.input.value, 10),
        onStart({ duration: { start: startDate } }) {
            start.innerText = `🏃🏻‍ Started at ${new Date(startDate)}`;
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
        runner.setConcurrency(parseInt(concurrency.input.value, 10));
        queueTasks(runner, 1000);
        info.innerText = `ℹ️ Total tasks: ${runner.tasks.total}`;
        end.innerHTML = '';
    };

    concurrency.set.onclick = () => {
        runner.setConcurrency(parseInt(concurrency.input.value, 10));
    };
});
