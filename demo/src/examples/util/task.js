export const queueTasks = (instance, count, { onStart, onDone, onEnd }) => {
    const orderOfCompletion = [];
    for (let i = 0; i < count; i++) {
        instance.add(task(i + 1, orderOfCompletion));
    }
    instance.onStart = onStart;
    instance.onDone = onDone;
    instance.onEnd = onEnd;
};

export const task = (number, orderOfCompletion = []) => done => {
    const timeout = Math.random() * 1000;
    setTimeout(() => {
        done();
        orderOfCompletion.push(number);
    }, timeout);
};
