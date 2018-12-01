export const run = () => {
    if (this.tasks.list.length) {
        if (this.running < this.concurrency) {
            this.tasks.list.shift()(done.bind(this));
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

export const done = () => {
    this.completed++;
    this.running--;
    run.call(this);
};

export const startCheck = hasStarted => {
    if (!hasStarted && typeof this.onStart === 'function') {
        this.duration.start = Date.now();
        hasStarted = true;
        this.onStart();
    }
};
