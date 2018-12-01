import { startCheck, run } from './private-functions';

export default class ConcurrentTasks {
    constructor(concurrency) {
        this.concurrency = typeof concurrency === 'number' ? concurrency : 3;
    }

    completed = 0;
    running = 0;
    onEnd;
    onStart;
    tasks = {
        list: [],
        total: 0
    };
    duration = {
        start: 0,
        end: 0,
        total: 0,
        idle: 0
    };

    add = task => {
        this.tasks.list.push(task);
        this.tasks.total++;
        startCheck.call(this);
        run.call(this);
    };

    addMultiple = tasks => {
        if (
            tasks.constructor === Array &&
            tasks.every(t => typeof t === 'function')
        ) {
            this.tasks.list = tasks;
            this.tasks.total = tasks.length;
            startCheck.call(this);
            run.call(this);
        }
    };

    remove = index => {
        this.tasks.list.splice(index, 1);
        this.tasks.total = this.tasks.list.length;
    };

    removeAll = () => {
        this.tasks.list = [];
        this.tasks.total = 0;
    };
}
