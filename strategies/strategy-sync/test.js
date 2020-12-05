/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const { TaskRunner } = require('@concurrent-tasks/core');

const { Strategy } = require('.');

const x = new TaskRunner({
    strategy: Strategy({
        passErrorToDone: false,
    }),
});

function generateTasks(count) {
    const tasks = [];

    for (let i = 0; i < count; i++) {
        tasks.push(function () {
            return new Promise((resolve) => {
                const rand = Math.floor(Math.random() * 2000);
                setTimeout(() => {
                    resolve(`Task ${i} completed after ${rand}ms`);
                }, rand);
            });
        });
    }

    return tasks;
}

x.addMultiple(generateTasks(10));

x.on('done', ({ result }) => {
    !!result && console.log('Successful result', result);
});
console.log('lol?');
x.start();
