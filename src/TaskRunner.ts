import { DefaultOptions } from "./DefaultOptions";
import {
  AdditionMethods,
  Done,
  RemovalMethods,
  RunnerDuration,
  RunnerEvents,
  RunnerHooks,
  RunnerOptions,
  TasksCount,
  TaskStatus,
  TasksWithDone,
  TaskWithDone,
} from "./Interface";
import { List } from "./List";
import { Task, Tasks } from "./Task";
import { isArray, isFunction } from "./Utils";

export class TaskRunner<T = any> {
  static #instances = 0;

  #_busy = false;
  #_destroyed = false;

  readonly #_pending = new List<T>();
  readonly #_completed = new List<T>();
  readonly #_running = new List<T>();
  readonly #_options: RunnerOptions<T>;
  readonly #_duration: RunnerDuration = {
    start: 0,
    end: 0,
    total: 0,
  };

  #_concurrency = 0;
  #_taskIds = 0;

  private onStart: RunnerHooks<T>["onStart"] | undefined;
  private onAdd: RunnerHooks<T>["onAdd"] | undefined;
  private onRemove: RunnerHooks<T>["onRemove"] | undefined;
  private onRun: RunnerHooks<T>["onRun"] | undefined;
  private onDone: RunnerHooks<T>["onDone"] | undefined;
  private onEnd: RunnerHooks<T>["onEnd"] | undefined;

  set #concurrency(concurrency: number) {
    if (!concurrency || concurrency < -1) {
      throw new RangeError(
        `Invalid range for concurrency. Range should be a positive integer, or -1. Found ${concurrency} instead`
      );
    }

    if (concurrency === -1) {
      this.#_concurrency = Infinity;
    } else {
      this.#_concurrency = concurrency;
    }
  }

  get #total(): number {
    return this.#pending + this.#running + this.#completed;
  }

  get #completed(): number {
    return this.#_completed.size;
  }

  get #pending(): number {
    return this.#_pending.size;
  }

  get #running(): number {
    return this.#_running.size;
  }

  get #duration(): RunnerDuration {
    return {
      ...this.#_duration,
    };
  }

  #createTask(task: TaskWithDone<T>): Task<T> {
    return new Task(this.#_taskIds++, task);
  }

  #done(task: Task<T>): Done<T> {
    return ((result: T) => {
      task.status = TaskStatus.DONE;

      this.#_running.removeById(task.id);
      this.#_completed.add(task);

      this.onDone?.({
        task,
        result,
        tasks: this.tasks,
        count: this.count,
      });

      this.#run();
    }) as unknown as Done<T>;
  }

  #run() {
    if (!this.#_destroyed) {
      if (
        !!this.#total &&
        this.#completed < this.#total &&
        this.#running < this.#_concurrency
      ) {
        const difference = this.#_concurrency - this.#running;

        const tasks = this.#_pending.removeRange(0, difference) as Tasks<T>;

        tasks.forEach((task) => {
          task.status = TaskStatus.RUNNING;

          this.#_running.add(task);

          task.run(this.#done(task));

          this.onRun?.({
            task,
            tasks: this.tasks,
            count: this.count,
          });
        });

        this.#_busy = true;
      } else {
        this.#_duration.end = Date.now();
        this.#_duration.total = Math.ceil(
          this.#_duration.end - this.#_duration.start
        );

        /* istanbul ignore next */
        this.onEnd?.({
          tasks: this.tasks,
          count: this.count,
          duration: this.#duration,
        });

        this.#_busy = false;
      }
    }
  }

  #provideRemovedTasks(removedTasks: Tasks<T> | Task<T> | void): Tasks<T> {
    if (isArray(removedTasks)) {
      return removedTasks;
    }

    if (removedTasks) {
      return [removedTasks];
    }

    /* istanbul ignore next */
    return [];
  }

  constructor(options?: Partial<RunnerOptions<T>>) {
    this.#_options = {
      ...DefaultOptions(`Runner-${TaskRunner.#instances++}`),
      ...options,
    };

    this.#concurrency = this.#_options.concurrency;

    this.onStart = this.#_options.onStart;
    this.onAdd = this.#_options.onAdd;
    this.onRemove = this.#_options.onRemove;
    this.onRun = this.#_options.onRun;
    this.onDone = this.#_options.onDone;
    this.onEnd = this.#_options.onEnd;
  }

  /**
   * Returns the concurrency of the runner.
   */
  public get concurrency(): number {
    return this.#_concurrency;
  }

  /**
   * Get whether the runner is busy executing tasks or not.
   */
  public get busy(): boolean {
    return this.#_busy;
  }

  /**
   * Get whether the runner is destroyed or not.
   */
  /* istanbul ignore next */
  public get destroyed(): boolean {
    return this.#_destroyed;
  }

  /**
   * Get the counts for the runner
   */
  public get count(): TasksCount {
    return {
      total: this.#total,
      completed: this.#completed,
      running: this.#running,
      pending: this.#pending,
    };
  }

  /**
   * Get the list of tasks of the runner.
   */
  public get tasks() {
    const completed = this.#_completed.entries();
    const pending = this.#_pending.entries();
    const running = this.#_running.entries();
    return {
      completed,
      pending,
      running,
      all: [...running, ...pending, ...completed],
    };
  }

  /**
   * Start task execution.
   */
  public start(): boolean {
    if (this.#_destroyed) {
      return false;
    }

    if (this.#_busy) {
      return false;
    }

    this.#_duration.start = Date.now();

    /* istanbul ignore next */
    this.onStart?.({
      tasks: this.tasks,
      count: this.count,
    });

    this.#run();

    return true;
  }

  /**
   * Destroy a runner instance. This will ensure that the current instance is marked as dead, and no additional tasks are run.
   *
   * This does not affect currently running tasks.
   */
  public destroy(): void {
    this.#_destroyed = true;
  }

  /**
   * Set the concurrency value
   */
  public setConcurrency(concurrency: number): void {
    if (!this.#_destroyed) {
      this.#concurrency = concurrency;
      this.#run();
    }
  }

  /**
   * Add a single task to the end of the list.
   *
   * ```ts
   * console.log(runner.tasks.pending) // []
   * runner.add(t1)
   * console.log(runner.tasks.pending) // [t1]
   * ```
   */
  public add(task: TaskWithDone<T>, prepend?: boolean): void {
    if (!this.#_destroyed) {
      if (!isFunction(task) || task instanceof Task) {
        throw new TypeError(
          "A task cannot be anything but a function, nor an instance of `Task`. Pass a function instead."
        );
      } else {
        if (prepend) {
          this.#_pending.addFirst(this.#createTask(task));
        } else {
          this.#_pending.add(this.#createTask(task));
        }
      }

      /* istanbul ignore next */
      this.onAdd?.({
        tasks: this.tasks,
        count: this.count,
        method: prepend ? AdditionMethods.FIRST : AdditionMethods.LAST,
      });
    }
  }

  /**
   * Add a single task to the beginning of the list.
   *
   * ```ts
   * console.log(runner.tasks.pending) // [t1, t2, t3]
   * runner.addFirst(t4)
   * console.log(runner.tasks.pending) // [t4, t1, t2, t3]
   * ```
   */
  public addFirst(task: TaskWithDone<T>): void {
    this.add(task, true);
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
    if (!this.#_destroyed) {
      this.#_pending.addAt(index, this.#createTask(task));

      /* istanbul ignore next */
      this.onAdd?.({
        tasks: this.tasks,
        count: this.count,
        method: AdditionMethods.AT_INDEX,
      });
    }
  }

  /**
   * Add multiple tasks to the end of the list.
   *
   * ```ts
   * console.log(runner.tasks) // [t1, t2, t3, t4, t5, t6]
   * runner.addMultiple([t7, t8, t9, t10, t11, t12])
   * console.log(runner.tasks.pending) // [t1, t2, t4, t5, t6, t7, t8, t9, t10, t11, t12]
   * ```
   */
  public addMultiple(tasks: TasksWithDone<T>, prepend?: boolean): void {
    if (!this.#_destroyed) {
      this.#_pending.concat(tasks.map(this.#createTask.bind(this)), prepend);

      /* istanbul ignore next */
      this.onAdd?.({
        tasks: this.tasks,
        count: this.count,
        method: prepend
          ? AdditionMethods.MULTIPLE_FIRST
          : AdditionMethods.MULTIPLE_LAST,
      });
    }
  }

  /**
   * Add multiple tasks to the beginning of the list.
   *
   * ```ts
   * console.log(runner.tasks) // [t1, t2, t3, t4, t5, t6]
   * runner.addMultiple([t7, t8, t9, t10, t11, t12])
   * console.log(runner.tasks.pending) // [t1, t2, t4, t5, t6, t7, t8, t9, t10, t11, t12]
   * ```
   */
  public addMultipleFirst(tasks: TasksWithDone<T>): void {
    this.addMultiple(tasks, true);
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
  public remove(first?: boolean): void {
    const removedTasks = first
      ? this.#_pending.removeFirst()
      : this.#_pending.remove();

    /* istanbul ignore next */
    this.onRemove?.({
      tasks: this.tasks,
      count: this.count,
      removedTasks: this.#provideRemovedTasks(removedTasks),
      method: first ? RemovalMethods.FIRST : RemovalMethods.LAST,
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
    this.remove(true);
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
    const removedTasks = this.#_pending.removeAt(index);

    /* istanbul ignore next */
    this.onRemove?.({
      tasks: this.tasks,
      count: this.count,
      removedTasks: this.#provideRemovedTasks(removedTasks),
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
    const removedTasks = this.#_pending.removeRange(start, count);

    /* istanbul ignore next */
    this.onRemove?.({
      tasks: this.tasks,
      count: this.count,
      removedTasks: this.#provideRemovedTasks(removedTasks),
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
    const removedTasks = this.#_pending.clear();

    /* istanbul ignore next */
    this.onRemove?.({
      tasks: this.tasks,
      count: this.count,
      removedTasks: this.#provideRemovedTasks(removedTasks),
      method: RemovalMethods.ALL,
    });
  }

  /**
   * Add a listener to any of the supported events of the runner. Only one listener per event can be attached at any time. Adding another will overwrite the existing listener.
   */
  public addListener<E extends RunnerEvents>(
    event: `${E}`,
    listener: E extends RunnerEvents ? RunnerHooks<T>[E] : never
  ): void {
    if (!this.#_destroyed) {
      if (!isFunction(listener)) {
        throw new TypeError(
          `Invalid listener callback provided. Expected ${event} to be a function, but found ${typeof listener} instead.`
        );
      }

      Object.assign(this, {
        [event]: listener,
      });
    }
  }

  /**
   * Remove a previously registered listener for an event supported by the runner.
   */
  public removeListener<E extends `${keyof RunnerHooks<T>}`>(event: E): void {
    Object.assign(this, {
      [event]: undefined,
    });
  }
}
