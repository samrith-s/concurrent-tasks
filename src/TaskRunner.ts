import { CoreMethods } from "./Core/CoreMethods";
import { DefaultOptions } from "./DefaultOptions";
import {
  RunnerOptions,
  OnStart,
  OnAdd,
  OnRemove,
  OnRun,
  OnDone,
  OnEnd,
  Task,
  TaskWithMeta,
  TaskID,
  RemovalMethods,
  RunnerEvents,
} from "./Interface";
import { noop } from "./Utils";

export class TaskRunner<T = any> extends CoreMethods<T> {
  static runnerCount = 0;

  constructor(options?: Partial<RunnerOptions<T>>) {
    super();
    this.options = {
      ...DefaultOptions<T>(`Runner-${++TaskRunner.runnerCount}`),
      ...options,
    };
  }

  protected setWorking(working: boolean) {
    this.__working = working;
  }

  protected setDestroyed(destroyed: boolean) {
    this.__destroyed = destroyed;
  }

  public isBusy(): boolean {
    return this.__working;
  }

  public start(): boolean {
    if (this.__working || this.__destroyed) {
      return false;
    }

    if (this.options.autoStart) {
      return false;
    }

    this.startCheck();
    this.runPending();
    return true;
  }

  public destroy(): boolean {
    this.__destroyed = true;
    this.__working = false;

    return true;
  }

  public on(event: RunnerEvents.START, callback: OnStart<T>): void;
  public on(event: RunnerEvents.ADD, callback: OnAdd<T>): void;
  public on(event: RunnerEvents.REMOVE, callback: OnRemove<T>): void;
  public on(event: RunnerEvents.RUN, callback: OnRun<T>): void;
  public on(event: RunnerEvents.DONE, callback: OnDone<T>): void;
  public on(event: RunnerEvents.DONE, callback: OnEnd<T>): void;
  public on(event: string, callback: any): void {
    const newEvent = `on${event.charAt(0).toUpperCase() + event.substring(1)}`;
    (this.options as any)[newEvent] = callback;
  }

  public off(event: RunnerEvents): void {
    const newEvent = `on${event.charAt(0).toUpperCase() + event.substring(1)}`;
    (this.options as any)[newEvent] = noop;
  }

  public add(task: Task<T>): TaskWithMeta<T> {
    const newTask = task as TaskWithMeta<T>;
    newTask.meta = {
      id: ++this.taskIds,
      execution: {
        start: new Date(),
        end: null,
        time: 0,
      },
    };

    this.tasks.list.push(newTask);
    this.tasks.total++;

    if (this.options.autoStart) {
      this.startCheckAndRunPending();
    }

    this.addCheck();
    return newTask;
  }

  public addMultiple(tasks: Task<T>[]): TaskWithMeta<T>[] {
    return tasks.map((task) => this.add(task));
  }

  public remove(id: TaskID): TaskWithMeta<T> | void {
    const taskIndex = this.tasks.list.findIndex((task) => task.meta.id === id);

    if (taskIndex > -1) {
      const task = this.tasks.list.splice(taskIndex, 1).pop();
      --this.tasks.total;

      this.removeCheck(RemovalMethods.BY_ID, task ? [task] : []);
      return task;
    }

    return void 0;
  }

  public removeAll(): TaskWithMeta<T>[] {
    const tasks = this.tasks.list.slice();
    this.tasks.list = [];
    this.tasks.total = this.tasks.completed;
    this.removeCheck(RemovalMethods.ALL, tasks);
    return tasks;
  }
}
