import { isFunction } from './util';

export function run() {
    if (this.tasks.list.length) {
        if (this.tasks.running < this.concurrency) {
            this.tasks.list.shift()(done.bind(this));
            this.tasks.running++;
        }
    } else {
        if (this.tasks.completed === this.tasks.total) {
            this.duration.end = Date.now();
            this.duration.total = this.duration.end - this.duration.start;
            this.__working = false;
            if (isFunction(this.onEnd)) {
                const {
                    tasks: { completed },
                    duration
                } = this;
                this.onEnd({ completed, duration });
            }
        }
    }
}

export function done() {
    this.tasks.completed++;
    this.tasks.running--;
    this.duration.total = Date.now() - this.duration.start;
    if (isFunction(this.onDone)) {
        this.onDone(this.tasks);
    }
    run.call(this);
}

export function startCheck() {
    if (!this.__working) {
        this.duration.start = Date.now();
        this.__working = true;
        if (isFunction(this.onStart)) {
            const { duration } = this;
            this.onStart({ duration });
        }
    }
}

export function startCheckAndRun() {
    startCheck.call(this);
    run.call(this);
}

export function runPending() {
    if (this.tasks.running < this.concurrency) {
        for (var i = this.tasks.running; i < this.concurrency; i++) {
            run.call(this);
        }
    }
}
