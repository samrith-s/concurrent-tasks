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
  RunnerEventValues,
  TasksDescriptor,
} from "./Interface";

export class TaskRunner<T = any> extends CoreMethods<T> {
  static runnerCount = 0;

  constructor(options?: Partial<RunnerOptions<T>>) {
    super();
    this.options = {
      ...DefaultOptions<T>(`Runner-${++TaskRunner.runnerCount}`),
      ...options,
    };
  }

  public get allTasks(): TasksDescriptor["list"] {
    return this.tasks.list;
  }

  public get busy(): boolean {
    return this.__working;
  }

  public start(): boolean {
    if (this.__working || this.__destroyed) {
      return false;
    }

    this.startCheck();
    this.runPending();

    return true;
  }

  public destroy(): boolean {
    this.setDestroyed(true);

    return true;
  }

  public on(event: RunnerEvents.START, callback: OnStart<T>): boolean;
  public on(event: RunnerEvents.ADD, callback: OnAdd<T>): boolean;
  public on(event: RunnerEvents.REMOVE, callback: OnRemove<T>): boolean;
  public on(event: RunnerEvents.RUN, callback: OnRun<T>): boolean;
  public on(event: RunnerEvents.DONE, callback: OnDone<T>): boolean;
  public on(event: RunnerEvents.END, callback: OnEnd<T>): boolean;
  public on(event: RunnerEvents, callback: any): boolean {
    if (RunnerEventValues.includes(event)) {
      const newEvent = `on${event.charAt(0).toUpperCase() + event.substring(1)}`;
      (this.options as any)[newEvent] = callback;
      return true;
    }

    return false;
  }

  public off(event: RunnerEvents): boolean {
    if (RunnerEventValues.includes(event)) {
      const newEvent = `on${event.charAt(0).toUpperCase() + event.substring(1)}`;
      (this.options as any)[newEvent] = undefined;
      return true;
    }

    return false;
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

      if (this.tasks.list.length) {
        this.setWorking(false);
      }
      return task;
    }
  }

  public removeAll(): TaskWithMeta<T>[] {
    const tasks = this.tasks.list.slice();
    this.tasks.list = [];
    this.tasks.total = this.tasks.completed;
    this.removeCheck(RemovalMethods.ALL, tasks);
    this.setWorking(false);
    return tasks;
  }

  public setOptions(options?: Partial<RunnerOptions<T>>) {
    this.options = {
      ...this.options,
      ...options,
    };

    if (options?.autoStart) {
      this.startCheckAndRunPending();
    }
  }
}
