export const queueTasks = (instance, count) => {
    const orderOfCompletion = [];
    for (let i = 0; i < count; i++) {
        instance.add(task(i + 1, orderOfCompletion));
    }
};

export const addMultipleTasks = (instance, count) => {
    const tasks = [];
    const orderOfCompletion = [];
    for (let i = 0; i < count; i++) {
        tasks.push(task(i + 1, orderOfCompletion));
    }
    instance.addMultiple(tasks);
};

export const task = (number, orderOfCompletion = []) => done => {
    const timeout = Math.random() * 1000;
    setTimeout(() => {
        done();
        orderOfCompletion.push(number);
    }, timeout);
};
