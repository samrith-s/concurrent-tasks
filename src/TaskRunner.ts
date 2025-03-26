import { DefaultOptions } from "./DefaultOptions";
import {
  AdditionMethods,
  Done,
  HookDefaults,
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
  #_paused = false;
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

  #runHook<
    Hook extends keyof RunnerHooks<T>,
    Data extends Omit<
      Parameters<RunnerHooks<T>[Hook]>[0],
      keyof HookDefaults
    > extends infer D
      ? D extends Record<string, never>
        ? null
        : D
      : null,
  >(
    ...[hook, data]: Data extends null ? [hook: Hook] : [hook: Hook, data: Data]
  ) {
    (this as any)[hook]?.({
      ...(data || {}),
      tasks: this.tasks,
      count: this.count,
      duration: this.duration,
    });
  }

  #createTask(task: TaskWithDone<T>): Task<T> {
    return new Task(this.#_taskIds++, task);
  }

  #done(task: Task<T>): Done<T> {
    return ((result: T) => {
      task.status = TaskStatus.DONE;

      this.#_running.removeById(task.id);
      this.#_completed.add(task);

      this.#runHook(RunnerEvents.DONE, {
        task,
        result,
      });

      if (!this.#_paused && !this.#_destroyed) {
        return this.#run();
      }

      if (!this.#running) {
        if (this.#_paused) {
          return this.#runHook(RunnerEvents.PAUSE);
        }

        if (this.#_destroyed) {
          return this.#runHook(RunnerEvents.DESTROY);
        }
      }
    }) as unknown as Done<T>;
  }

  #run() {
    if (this.#completed !== this.#total) {
      if (!this.#_paused && this.#running < this.#_concurrency) {
        const difference = this.#_concurrency - this.#running;

        const tasks = this.#_pending.removeRange(0, difference) as Tasks<T>;

        this.#_busy = true;
        tasks.forEach((task) => {
          task.status = TaskStatus.RUNNING;

          this.#_running.add(task);

          task.run(this.#done(task));

          /* istanbul ignore next */
          this.#runHook(RunnerEvents.RUN, {
            task,
          });
        });
      }
    } else {
      this.#_duration.end = Date.now();
      this.#_duration.total = Math.ceil(
        this.#_duration.end - this.#_duration.start
      );

      /* istanbul ignore next */
      this.#runHook(RunnerEvents.END);

      this.#_busy = false;
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

    Object.values(RunnerEvents).forEach((value) => {
      (this as any)[value] = this.#_options[value];
    });
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
   * Get whether the runner is paused or not.
   */
  public get paused(): boolean {
    return this.#_paused;
  }

  /**
   * Get whether the runner is destroyed or not.
   */
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

  public get duration(): RunnerDuration {
    return {
      ...this.#_duration,
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

    const previousPause = this.#_paused;

    if (previousPause) {
      this.#_paused = false;
    }

    if (this.#_busy) {
      return false;
    }

    this.#_duration.start = Date.now();

    /* istanbul ignore next */
    if (!previousPause) {
      this.#runHook(RunnerEvents.START);
    }
    this.#run();

    return true;
  }

  /**
   * Pause task execution.
   */
  public pause(): boolean {
    if (this.#_destroyed) {
      return false;
    }

    this.#_paused = true;

    return true;
  }

  /**
   * Destroy a runner instance. This will ensure that the current instance is marked as dead, and no additional tasks are run.
   *
   * This does not affect currently running tasks.
   */
  public destroy(): void {
    this.#_destroyed = true;

    this.#runHook(RunnerEvents.DESTROY);
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

      this.#runHook(RunnerEvents.ADD, {
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
      this.#runHook(RunnerEvents.ADD, {
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
      this.#runHook(RunnerEvents.ADD, {
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
    this.#runHook(RunnerEvents.REMOVE, {
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
    this.#runHook(RunnerEvents.REMOVE, {
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
    this.#runHook(RunnerEvents.REMOVE, {
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
    this.#runHook(RunnerEvents.REMOVE, {
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
