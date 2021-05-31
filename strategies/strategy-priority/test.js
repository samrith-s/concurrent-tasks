/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { TaskRunner } = require('@concurrent-tasks/core');
const chalk = require('chalk');

const { Strategy, priorityTask } = require('.');

const TOTAL_PRIORITIES = 4;

function generateTasks(count) {
    const tasks = [];

    for (let i = 0; i < count; i++) {
        const p = Math.floor(Math.random() * (TOTAL_PRIORITIES - 1));

        let text = '';

        switch (p) {
            case 0: {
                text = 'redBright ⬆';
                break;
            }
            case 1: {
                text = 'yellowBright ⬆';
                break;
            }
            case 2: {
                text = 'cyanBright ⬇';
                break;
            }
            case 3: {
                text = 'greenBright ⬇⬇';
                break;
            }
            default: {
                break;
            }
        }

        tasks.push(
            priorityTask(function (done) {
                const rand = Math.floor(Math.random() * 2000);
                setTimeout(() => {
                    done(chalk`{${text} Task ${i} completed after ${rand}ms}`);
                }, rand);
            }, p)
        );
    }

    return tasks;
}

const y = new TaskRunner({
    onDone({ result }) {
        console.log(result);
    },
    strategy: Strategy(),
});
y.addMultiple(generateTasks(10));

y.start();

setTimeout(() => {
    y.addMultiple(generateTasks(10));
}, 150);
