import { DefaultOptions } from "./DefaultOptions";
import {
  Done,
  RemovalMethods,
  RunnerConcurrency,
  RunnerDuration,
  RunnerHooks,
  RunnerOptions,
  TaskID,
  TasksDescriptor,
  TaskStatus,
  TaskWithDone,
} from "./Interface";
import { Task } from "./Task";

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

    this.concurrency.max = this.options.concurrency;
    this.autoStart = this.options.autoStart;

    this.onStart = this.options.onStart;
    this.onAdd = this.options.onAdd;
    this.onRemove = this.options.onRemove;
    this.onRun = this.options.onRun;
    this.onDone = this.options.onDone;
    this.onEnd = this.options.onEnd;
  }

  get busy() {
    return this.__busy;
  }

  get taskList() {
    return this.tasks.list;
  }

  private done(task: Task<T>) {
    return ((result: T) => {
      task.status = TaskStatus.DONE;
      task.done();

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
      if (!!this.tasks.list.length && this.concurrency.used < this.concurrency.max) {
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
        this.duration.total = this.duration.end - this.duration.start;

        this.onEnd?.({ tasks: this.tasks, duration: this.duration });

        this.__busy = false;
      }
    }
  }

  public listen<E extends keyof RunnerHooks<T>>(event: E, listener: RunnerHooks<T>[E]): void {
    (this as any)[event] = listener;
  }

  public unlisten<E extends keyof RunnerHooks<T>>(event: E): void {
    (this as any)[event] = undefined;
  }

  public setOptions(options: Partial<RunnerOptions<T>>): RunnerOptions<T> {
    this.options = {
      ...this.options,
      ...options,
    };

    if (this.options.autoStart) {
      this.start();
    }

    return this.options;
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

  public destroy(): boolean {
    this.__destroyed = true;
    this.__busy = false;
    return true;
  }

  public add(task: TaskWithDone<T>, multiple?: boolean): boolean {
    this.tasks.total++;
    this.tasks.list.push(new Task(this.taskIds++, task));

    this.onAdd?.({ tasks: this.tasks });

    if (!multiple && this.autoStart && !this.__busy) {
      this.start();
    }

    return true;
  }

  public addMultiple(tasks: TaskWithDone<T>[]): boolean {
    this.tasks.total += tasks.length;
    tasks.forEach((task) => this.add(task, true));

    if (this.autoStart && !this.__busy) {
      this.start();
    }

    return true;
  }

  public remove(id: TaskID): void {
    const index = this.tasks.list.findIndex((t) => t.id === id);
    this.tasks.total--;
    if (index > -1) {
      const removedTasks = this.tasks.list.splice(index, 1);
      this.onRemove?.({
        removedTasks,
        method: RemovalMethods.BY_ID,
        tasks: this.tasks,
      });
    }
  }

  public removeRange(start: number, count: number): void {
    this.tasks.total -= count;
    const removedTasks = this.tasks.list.splice(start, count);
    this.onRemove?.({
      removedTasks,
      method: RemovalMethods.RANGE,
      tasks: this.tasks,
    });
  }

  public removeAll(): void {
    const removedTasks = this.tasks.list.slice();
    this.tasks.list = [];
    this.tasks.total = 0;
    this.__busy = false;

    this.onRemove?.({
      removedTasks,
      method: RemovalMethods.ALL,
      tasks: this.tasks,
    });
  }
}
