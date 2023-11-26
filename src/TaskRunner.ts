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

  private taskIds = 0;

  private tasks: TasksDescriptor<T> = {
    total: 0,
    completed: 0,
    list: [],
  };

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

  private autoStart: boolean;
  private onStart: RunnerHooks<T>["onStart"] | undefined;
  private onAdd: RunnerHooks<T>["onAdd"] | undefined;
  private onRemove: RunnerHooks<T>["onRemove"] | undefined;
  private onRun: RunnerHooks<T>["onRun"] | undefined;
  private onDone: RunnerHooks<T>["onDone"] | undefined;
  private onEnd: RunnerHooks<T>["onEnd"] | undefined;

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
    this.autoStart = this.options.autoStart;

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
  get busy(): boolean {
    return this.__busy;
  }

  /**
   * Get the descriptors for the runner
   */
  public get descriptor(): Omit<TasksDescriptor, "list"> {
    return {
      total: this.tasks.total,
      completed: this.tasks.completed,
    };
  }

  /**
   * Get the list of tasks of the runner.
   */
  public get taskList(): TasksDescriptor<T>["list"] {
    return this.tasks.list;
  }

  private done(task: Task<T>): Done<T> {
    return ((result: T) => {
      task.status = TaskStatus.DONE;

      this.tasks.completed++;
      this.concurrency.used--;

      this.onDone?.({
        task,
        result,
        tasks: this.tasks,
      });
      this.run();
    }) as unknown as Done<T>;
  }

  private run() {
    if (!this.__destroyed) {
      if (
        !!this.tasks.list.length &&
        this.concurrency.used < this.concurrency.max
      ) {
        const difference = this.concurrency.max - this.concurrency.used;
        const tasks = this.tasks.list.splice(0, difference);

        tasks.forEach((task) => {
          task.status = TaskStatus.RUNNING;
          task.run(this.done(task));

          this.concurrency.used++;

          this.onRun?.({ task, tasks: this.tasks });
        });

        this.__busy = true;
      } else {
        this.duration.end = Date.now();
        this.duration.total = Math.ceil(
          this.duration.end - this.duration.start
        );

        /* istanbul ignore next */
        this.onEnd?.({ tasks: this.tasks, duration: this.duration });

        this.__busy = false;
      }
    }
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

  public setOptions(
    options: Partial<Omit<RunnerOptions<T>, keyof RunnerHooks<T>>>
  ): RunnerOptions<T> {
    this.options = {
      ...this.options,
      ...options,
    };

    if (this.options.autoStart) {
      this.start();
    }

    return this.options;
  }

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

  public start(): boolean {
    if (this.__destroyed) {
      return false;
    }

    if (this.__busy) {
      return false;
    }

    this.duration.start = Date.now();
    this.onStart?.({ tasks: this.tasks });
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
    this.tasks.total++;

    if (typeof task !== "function" || task instanceof Task) {
      throw new TypeError(
        "A task cannot be anything but a function, nor an instance of `Task`. Pass a function instead."
      );
    } else {
      const taskInstance = new Task(this.taskIds++, task);

      if (prepend) {
        this.tasks.list.unshift(taskInstance);
      } else {
        this.tasks.list.push(taskInstance);
      }
    }

    this.onAdd?.({ tasks: this.tasks });

    /* istanbul ignore next */
    if (this.autoStart && !this.__busy) {
      this.start();
    }
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
    this.tasks.total += tasks.length;
    tasks.forEach((task) => this.add(task));

    if (this.autoStart && !this.__busy) {
      this.start();
    }
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
    const index = this.tasks.list.findIndex((t) => t.id === id);

    if (indexIsWithinTaskBounds(index, this.tasks)) {
      const removedTasks = this.tasks.list.splice(index, 1);
      this.tasks.total--;
      this.onRemove?.({
        removedTasks,
        method: RemovalMethods.BY_ID,
        tasks: this.tasks,
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
    if (indexIsWithinTaskBounds(index, this.tasks)) {
      const removedTasks = this.tasks.list.splice(index, 1);
      this.tasks.total--;
      this.onRemove?.({
        removedTasks,
        method: RemovalMethods.BY_INDEX,
        tasks: this.tasks,
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
    if (indexIsWithinTaskBounds(start, this.tasks)) {
      const removedTasks = this.tasks.list.splice(start, count);
      this.tasks.total -= removedTasks.length;
      this.onRemove?.({
        removedTasks,
        method: RemovalMethods.RANGE,
        tasks: this.tasks,
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
    const removedTasks = this.tasks.list.slice();
    this.tasks.list = [];
    this.tasks.total = 0;
    this.__busy = false;

    this.onRemove?.({
      removedTasks,
      method: RemovalMethods.ALL,
      tasks: this.tasks,
    });

    return removedTasks;
  }
}
