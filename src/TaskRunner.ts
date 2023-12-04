import { DefaultOptions } from "./DefaultOptions";
import {
  Done,
  RemovalMethods,
  RunnerDuration,
  RunnerEvents,
  RunnerHooks,
  RunnerOptions,
  TasksCount,
  TaskStatus,
  TaskWithDone,
} from "./Interface";
import { List } from "./List";
import { Task, Tasks } from "./Task";
import { isArray, isFunction } from "./Utils";

export class TaskRunner<T = any> {
  private static instances = 0;

  private __busy = false;
  private __destroyed = false;

  private _pending = new List<T>();

  private _completed = new List<T>();

  private _running = new List<T>();

  private get total(): number {
    return this.pending + this.running + this.completed;
  }

  private get completed(): number {
    return this._completed.size;
  }

  private get pending(): number {
    return this._pending.size;
  }

  private get running(): number {
    return this._running.size;
  }

  private _concurrency = 0;

  private taskIds = 0;

  private options: RunnerOptions<T>;

  private readonly _duration: RunnerDuration = {
    start: 0,
    end: 0,
    total: 0,
  };

  private get duration(): RunnerDuration {
    return {
      ...this._duration,
    };
  }

  private onStart: RunnerHooks<T>["onStart"] | undefined;
  private onAdd: RunnerHooks<T>["onAdd"] | undefined;
  private onRemove: RunnerHooks<T>["onRemove"] | undefined;
  private onRun: RunnerHooks<T>["onRun"] | undefined;
  private onDone: RunnerHooks<T>["onDone"] | undefined;
  private onEnd: RunnerHooks<T>["onEnd"] | undefined;

  private createTask(task: TaskWithDone<T>): Task<T> {
    return new Task(this.taskIds++, task);
  }

  private done(task: Task<T>): Done<T> {
    return ((result: T) => {
      task.status = TaskStatus.DONE;

      this._running.removeById(task.id);
      this._completed.add(task);

      this.onDone?.({
        task,
        result,
        tasks: this.tasks,
        descriptor: this.count,
      });

      this.run();
    }) as unknown as Done<T>;
  }

  private run() {
    if (!this.__destroyed) {
      if (
        !!this.total &&
        this.completed < this.total &&
        this.running < this._concurrency
      ) {
        const difference = this._concurrency - this.running;

        const tasks = this._pending.removeRange(0, difference) as Tasks<T>;

        tasks.forEach((task) => {
          task.status = TaskStatus.RUNNING;

          this._running.add(task);

          task.run(this.done(task));

          this.onRun?.({
            task,
            tasks: this.tasks,
            descriptor: this.count,
          });
        });

        this.__busy = true;
      } else {
        this._duration.end = Date.now();
        this._duration.total = Math.ceil(
          this._duration.end - this._duration.start
        );

        /* istanbul ignore next */
        this.onEnd?.({
          tasks: this.tasks,
          descriptor: this.count,
          duration: this.duration,
        });

        this.__busy = false;
      }
    }
  }

  /* istanbul ignore next */
  private provideRemovedTasks(
    removedTasks: Tasks<T> | Task<T> | void
  ): Tasks<T> {
    if (isArray(removedTasks)) {
      return removedTasks;
    }

    if (removedTasks) {
      return [removedTasks];
    }

    return [];
  }

  constructor(options?: Partial<RunnerOptions<T>>) {
    this.options = {
      ...DefaultOptions(`Runner-${TaskRunner.instances++}`),
      ...options,
    };

    if (this.options.concurrency < 0) {
      throw new RangeError(
        `Invalid range for concurrency. Range should be between 0 and Infinity, found ${this.options.concurrency}`
      );
    }

    this._concurrency = this.options.concurrency;

    this.onStart = this.options.onStart;
    this.onAdd = this.options.onAdd;
    this.onRemove = this.options.onRemove;
    this.onRun = this.options.onRun;
    this.onDone = this.options.onDone;
    this.onEnd = this.options.onEnd;
  }

  /**
   * Returns the concurrency of the runner.
   */
  public get concurrency(): number {
    return this._concurrency;
  }

  /**
   * Get whether the runner is busy executing tasks or not.
   */
  public get busy(): boolean {
    return this.__busy;
  }

  /**
   * Get the descriptors for the runner
   */
  public get count(): TasksCount {
    return {
      total: this.total,
      completed: this.completed,
      running: this.running,
      pending: this.pending,
    };
  }

  /**
   * Get the list of tasks of the runner.
   */
  public get tasks() {
    const completed = this._completed.entries();
    const pending = this._pending.entries();
    const running = this._running.entries();
    return {
      completed,
      pending,
      running,
      all: [...running, ...pending, ...completed],
    };
  }

  /**
   * Add a listener to any of the supported events of the runner. Only one listener per event can be attached at any time. Adding another will overwrite the existing listener.
   */
  public addListener<E extends RunnerEvents>(
    event: `${E}`,
    listener: E extends RunnerEvents ? RunnerHooks<T>[E] : never
  ): void {
    if (!isFunction(listener)) {
      throw new TypeError(
        `Invalid listener callback provided. Expected ${event} to be a function, but found ${typeof listener} instead.`
      );
    }

    Object.assign(this, {
      [event]: listener,
    });
  }

  /**
   * Remove a previously registered listener for an event supported by the runner.
   */
  public removeListener<E extends `${keyof RunnerHooks<T>}`>(event: E): void {
    Object.assign(this, {
      [event]: undefined,
    });
  }

  /**
   * Set the concurrency value
   */
  public setConcurrency(concurrency: number) {
    this._concurrency = concurrency;
    this.run();
  }

  /**
   * Set a callback for a hook
   */
  public setHooks(hooks: Partial<RunnerHooks<T>>): void {
    Object.entries(hooks).forEach(([key, fn]) => {
      if (!isFunction(fn)) {
        throw new TypeError(
          `Invalid hook value provided. Expected ${key} to be a function, but found ${typeof fn} instead.`
        );
      }

      Object.assign(this, {
        [key]: fn,
      });
    });
  }

  /**
   * Remove a callback for a hook
   */
  public unsetHooks(hooks: Array<`${keyof RunnerHooks<T>}`>): void {
    hooks.forEach((key) => {
      Object.assign(this, {
        [key]: undefined,
      });
    });
  }

  /**
   * Start task execution.
   */
  public start(): boolean {
    if (this.__destroyed) {
      return false;
    }

    if (this.__busy) {
      return false;
    }

    this._duration.start = Date.now();

    /* istanbul ignore next */
    this.onStart?.({
      tasks: this.tasks,
      descriptor: this.count,
    });
    this.run();

    return true;
  }

  /**
   * Destroy a runner instance. This will ensure that the current instance is marked as dead, and no additional tasks are run.
   *
   * This does not affect currently running tasks.
   */
  public destroy(): void {
    this.__destroyed = true;
    this.__busy = false;
  }

  /**
   * Add a single task to the list.
   *
   * ```ts
   * console.log(runner.tasks.pending) // []
   * runner.add(t1)
   * console.log(runner.tasks.pending) // [t1]
   * ```
   */
  public add(task: TaskWithDone<T>, prepend?: boolean): void {
    if (!isFunction(task) || task instanceof Task) {
      throw new TypeError(
        "A task cannot be anything but a function, nor an instance of `Task`. Pass a function instead."
      );
    } else {
      if (prepend) {
        this._pending.addFirst(this.createTask(task));
      } else {
        this._pending.add(this.createTask(task));
      }
    }

    /* istanbul ignore next */
    this.onAdd?.({
      tasks: this.tasks,
      descriptor: this.count,
    });
  }

  /**
   * Add a single task at a particular index.
   *
   * ```ts
   * console.log(runner.tasks) // [t1, t2, t3, t4, t5, t6]
   * runner.addAt(1, t)
   * console.log(runner.tasks.pending) // [t1, t7, t2, t3, t4, t5, t6]
   * ```
   */
  public addAt(index: number, task: TaskWithDone<T>): void {
    this._pending.addAt(index, this.createTask(task));

    /* istanbul ignore next */
    this.onAdd?.({
      tasks: this.tasks,
      descriptor: this.count,
    });
  }

  /**
   * Add multiple tasks to the runner.
   *
   * ```ts
   * console.log(runner.tasks) // [t1, t2, t3, t4, t5, t6]
   * runner.addMultiple([t7, t8, t9, t10, t11, t12])
   * console.log(runner.tasks.pending) // [t1, t2, t4, t5, t6, t7, t8, t9, t10, t11, t12]
   * ```
   */
  public addMultiple(tasks: TaskWithDone<T>[], prepend?: boolean): void {
    tasks.forEach((task) => this.add(task, prepend));
  }

  /**
   * Remove the last pending task in the list.
   *
   * ```ts
   * runner.addMultiple([t1, t2, t3, t4, t5, t6])
   * runner.remove()
   * console.log(runner.tasks.pending) // [t1, t2, t3, t4, t5]
   * ```
   */
  public remove(): void {
    const removedTasks = this._pending.remove();

    /* istanbul ignore next */
    this.onRemove?.({
      tasks: this.tasks,
      descriptor: this.count,
      removedTasks: this.provideRemovedTasks(removedTasks),
      method: RemovalMethods.LAST,
    });
  }

  /**
   * Remove the first pending task in the list.
   *
   * ```ts
   * runner.addMultiple([t1, t2, t3, t4, t5, t6])
   * runner.removeFirst()
   * console.log(runner.tasks.pending) // [t2, t3, t4, t5, t6]
   * ```
   */
  public removeFirst(): void {
    const removedTasks = this._pending.removeFirst();

    /* istanbul ignore next */
    this.onRemove?.({
      tasks: this.tasks,
      descriptor: this.count,
      removedTasks: this.provideRemovedTasks(removedTasks),
      method: RemovalMethods.FIRST,
    });
  }

  /**
   * Remove a pending task at a particular index.
   *
   * ```ts
   * runner.addMultiple([t1, t2, t3, t4, t5, t6])
   * runner.removeAt(2)
   * console.log(runner.tasks.pending) // [t1, t2, t4, t5, t6]
   * ```
   */
  public removeAt(index: number): void {
    const removedTasks = this._pending.removeAt(index);

    /* istanbul ignore next */
    this.onRemove?.({
      tasks: this.tasks,
      descriptor: this.count,
      removedTasks: this.provideRemovedTasks(removedTasks),
      method: RemovalMethods.BY_INDEX,
    });
  }

  /**
   * Remove a range of pending tasks. The range is inclusive of the starting index specified.
   *
   * ```ts
   * runner.addMultiple([t1, t2, t3, t4, t5, t6])
   * runner.removeRange(2, 2)
   * console.log(runner.tasks.pending) // [t1, t4, t5, t6]
   * ```
   */
  public removeRange(start: number, count: number): void {
    const removedTasks = this._pending.removeRange(start, count);

    /* istanbul ignore next */
    this.onRemove?.({
      tasks: this.tasks,
      descriptor: this.count,
      removedTasks: this.provideRemovedTasks(removedTasks),
      method: RemovalMethods.RANGE,
    });
  }

  /**
   * Remove all pending tasks.
   *
   * ```ts
   * runner.addMultiple([t1, t2, t3, t4, t5, t6])
   * runner.removeAll()
   * console.log(runner.tasks.pending) // []
   * ```
   */
  public removeAll(): void {
    const removedTasks = this._pending.clear();

    this.__busy = false;

    /* istanbul ignore next */
    this.onRemove?.({
      tasks: this.tasks,
      descriptor: this.count,
      removedTasks: this.provideRemovedTasks(removedTasks),
      method: RemovalMethods.ALL,
    });
  }
}
