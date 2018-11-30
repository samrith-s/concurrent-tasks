export function TaskRunner(concurrency = 3) {
    this.concurrency = concurrency;
    this.tasks = {
        list: [],
        total: 0
    };
    this.completed = 0;
    this.running = 0;
    this.totalTasks = 0;
    this.onEnd;
    this.onStart;
    this.duration = {
        start: 0,
        end: 0,
        total: 0,
        idle: 0
    };
    this.push = task => {
        this.duration.start = Date.now();
        this.tasks.list.push(task);
        this.tasks.total++;
        if (!hasStarted && typeof this.onStart === 'function') {
            hasStarted = true;
            this.onStart();
        }

        run();
    };

    let hasStarted = false;

    const run = () => {
        if (this.tasks.list.length) {
            if (this.running < this.concurrency) {
                this.tasks.list.shift()(done);
                this.running++;
            }
        } else {
            if (this.completed === this.tasks.total) {
                this.duration.end = Date.now();
                this.duration.total = this.duration.end - this.duration.start;
                if (typeof this.onEnd === 'function') {
                    const { completed, duration } = this;
                    this.onEnd({ completed, duration });
                }
            }
        }
    };

    const done = () => {
        this.completed++;
        this.running--;
        run();
    };
}
