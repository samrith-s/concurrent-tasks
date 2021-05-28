/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { TaskRunner } = require('@concurrent-tasks/core');

const { Strategy } = require('.');

function generatePromiseTasks(count) {
    const tasks = [];

    for (let i = 0; i < count; i++) {
        tasks.push(function () {
            return new Promise((resolve) => {
                const rand = Math.floor(Math.random() * 2000);
                setTimeout(() => {
                    resolve(
                        `[Async Strategy]::Task ${i} completed after ${rand}ms`
                    );
                }, rand);
            });
        });
    }

    return tasks;
}

function generateTasks(count) {
    const tasks = [];

    for (let i = 0; i < count; i++) {
        tasks.push(function (done) {
            const rand = Math.floor(Math.random() * 2000);
            setTimeout(() => {
                done(`[Default Strategy]::Task ${i} completed after ${rand}ms`);
            }, rand);
        });
    }

    return tasks;
}

const x = new TaskRunner({
    onDone({ result }) {
        console.log(result);
    },
});
x.addMultiple(generateTasks(10));

const y = new TaskRunner({
    onDone({ result }) {
        console.log(result);
    },
    strategy: Strategy({
        passErrorToDone: false,
    }),
});
y.addMultiple(generatePromiseTasks(10));

x.start();
y.start();
