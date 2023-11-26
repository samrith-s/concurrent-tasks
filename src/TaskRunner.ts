import { DefaultOptions } from "./DefaultOptions";
import {
  Done,
  RemovalMethods,
  RunnerConcurrency,
  RunnerDuration,
  RunnerEvents,
  RunnerHooks,
  RunnerOptions,
  TaskID,
  TasksDescriptor,
  TaskStatus,
  TaskWithDone,
} from "./Interface";
import { Task } from "./Task";
import { indexIsWithinTaskBounds, isFunction, isValidHook } from "./Utils";

export class TaskRunner<T = any> {
  private static instances = 0;

  private __busy = false;
  private __destroyed = false;

  private _tasks: TasksDescriptor<T> = {
    total: 0,
    completed: 0,
    list: [],
  };

  private taskIds = 0;

  private options: RunnerOptions<T>;

  private readonly concurrency: RunnerConcurrency = {
    max: 0,
    used: 0,
  };

  private readonly duration: RunnerDuration = {
    start: 0,
    end: 0,
    total: 0,
  };

  private onStart: RunnerHooks<T>["onStart"] | undefined;
  private onAdd: RunnerHooks<T>["onAdd"] | undefined;
  private onRemove: RunnerHooks<T>["onRemove"] | undefined;
  private onRun: RunnerHooks<T>["onRun"] | undefined;
  private onDone: RunnerHooks<T>["onDone"] | undefined;
  private onEnd: RunnerHooks<T>["onEnd"] | undefined;

  private done(task: Task<T>): Done<T> {
    return ((result: T) => {
      task.status = TaskStatus.DONE;

      this._tasks.completed++;
      this.concurrency.used--;

      this.onDone?.({
        task,
        result,
        tasks: this._tasks,
      });
      this.run();
    }) as unknown as Done<T>;
  }

  private run() {
    if (!this.__destroyed) {
      if (
        !!this._tasks.list.length &&
        this.concurrency.used < this.concurrency.max
      ) {
        const difference = this.concurrency.max - this.concurrency.used;
        const tasks = this._tasks.list.splice(0, difference);

        tasks.forEach((task) => {
          task.status = TaskStatus.RUNNING;
          task.run(this.done(task));

          this.concurrency.used++;

          this.onRun?.({ task, tasks: this._tasks });
        });

        this.__busy = true;
      } else {
        this.duration.end = Date.now();
        this.duration.total = Math.ceil(
          this.duration.end - this.duration.start
        );

        /* istanbul ignore next */
        this.onEnd?.({ tasks: this._tasks, duration: this.duration });

        this.__busy = false;
      }
    }
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
    this.concurrency.max = this.options.concurrency;

    this.onStart = this.options.onStart;
    this.onAdd = this.options.onAdd;
    this.onRemove = this.options.onRemove;
    this.onRun = this.options.onRun;
    this.onDone = this.options.onDone;
    this.onEnd = this.options.onEnd;
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
  public get descriptor(): Omit<TasksDescriptor, "list"> {
    return {
      total: this._tasks.total,
      completed: this._tasks.completed,
    };
  }

  /**
   * Get the list of tasks of the runner.
   */
  public get tasks(): TasksDescriptor<T>["list"] {
    return this._tasks.list;
  }

  public listen<E extends keyof RunnerHooks<T>>(
    event: E,
    listener: RunnerHooks<T>[E]
  ): void {
    (this as any)[event] = listener;
  }

  public unlisten<E extends keyof RunnerHooks<T>>(event: E): void {
    (this as any)[event] = undefined;
  }

  /**
   * Set the concurrency value
   */
  public setConcurrency(concurrency: number) {
    this.concurrency.max = concurrency;
    this.run();
  }

  /**
   * Set or unset hook values
   */
  public setHooks(hooks: Partial<RunnerHooks<T>>): void {
    Object.entries(hooks).forEach(([key, fn]) => {
      if (!isValidHook(key as keyof typeof hooks, this.options)) {
        throw new TypeError(
          `Invalid hook provided. Expected one of ${Object.values(
            RunnerEvents
          ).join(", ")} but found ${key} instead.`
        );
      }

      if (!isFunction(fn)) {
        throw new TypeError(
          `Invalid hook value provided. Expected ${key} to be a function, but found ${typeof fn} instead.`
        );
      }

      (this as any)[key] = fn;
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

    this.duration.start = Date.now();
    this.onStart?.({ tasks: this._tasks });
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
   * console.log(runner.taskList) // []
   * runner.add(t1)
   * console.log(runner.taskList) // [t1]
   * ```
   */
  public add(task: TaskWithDone<T>, prepend?: boolean): void {
    this._tasks.total++;

    if (typeof task !== "function" || task instanceof Task) {
      throw new TypeError(
        "A task cannot be anything but a function, nor an instance of `Task`. Pass a function instead."
      );
    } else {
      const taskInstance = new Task(this.taskIds++, task);

      if (prepend) {
        this._tasks.list.unshift(taskInstance);
      } else {
        this._tasks.list.push(taskInstance);
      }
    }

    this.onAdd?.({ tasks: this._tasks });
  }

  /**
   * Add multiple tasks to the runner.
   *
   * ```ts
   * console.log(runner.taskList) // [t1, t2, t3, t4, t5, t6]
   * runner.addMultiple([t7, t8, t9, t10, t11, t12])
   * console.log(runner.taskList) // [t1, t2, t4, t5, t6, t7, t8, t9, t10, t11, t12]
   * ```
   */
  public addMultiple(tasks: TaskWithDone<T>[]): void {
    this._tasks.total += tasks.length;
    tasks.forEach((task) => this.add(task));
  }

  /**
   * Remove a particular task by its ID.
   *
   * ```ts
   * runner.addMultiple([t1, t2, t3, t4, t5, t6])
   * const taskId = runner.taskList.at(2).id
   * runner.remove(taskId)
   * console.log(runner.taskList) // [t1, t2, t4, t5, t6]
   * ```
   */
  public remove(id: TaskID): Task<T> | null {
    const index = this._tasks.list.findIndex((t) => t.id === id);

    if (indexIsWithinTaskBounds(index, this._tasks)) {
      const removedTasks = this._tasks.list.splice(index, 1);
      this._tasks.total--;
      this.onRemove?.({
        removedTasks,
        method: RemovalMethods.BY_ID,
        tasks: this._tasks,
      });

      return removedTasks[0];
    }

    return null;
  }

  /**
   * Remove a task at a particular index.
   *
   * ```ts
   * runner.addMultiple([t1, t2, t3, t4, t5, t6])
   * runner.removeAt(2)
   * console.log(runner.taskList) // [t1, t2, t4, t5, t6]
   * ```
   */
  public removeAt(index: number): Task<T> | null {
    if (indexIsWithinTaskBounds(index, this._tasks)) {
      const removedTasks = this._tasks.list.splice(index, 1);
      this._tasks.total--;
      this.onRemove?.({
        removedTasks,
        method: RemovalMethods.BY_INDEX,
        tasks: this._tasks,
      });

      return removedTasks[0];
    }

    return null;
  }

  /**
   * Remove a range of tasks. The range is inclusive of the starting index specified.
   *
   * ```ts
   * runner.addMultiple([t1, t2, t3, t4, t5, t6])
   * runner.removeRange(2, 2)
   * console.log(runner.taskList) // [t1, t2, t5, t6]
   * ```
   */
  public removeRange(start: number, count: number): Task<T>[] | null {
    if (indexIsWithinTaskBounds(start, this._tasks)) {
      const removedTasks = this._tasks.list.splice(start, count);
      this._tasks.total -= removedTasks.length;
      this.onRemove?.({
        removedTasks,
        method: RemovalMethods.RANGE,
        tasks: this._tasks,
      });

      return removedTasks;
    }

    return null;
  }

  /**
   * Remove all tasks that are not picked up for execution. Currently running tasks are ignored.
   *
   * ```ts
   * runner.addMultiple([t1, t2, t3, t4, t5, t6])
   * runner.removeAll()
   * console.log(runner.taskList) // []
   * ```
   */
  public removeAll(): Task<T>[] | null {
    const removedTasks = this._tasks.list.slice();
    this._tasks.list = [];
    this._tasks.total = 0;
    this.__busy = false;

    this.onRemove?.({
      removedTasks,
      method: RemovalMethods.ALL,
      tasks: this._tasks,
    });

    return removedTasks;
  }
}
