import { Done, TaskWithMeta, RemovalMethods } from "../Interface";
import { isFunction } from "../Utils";

import { Core } from "./Core";

export abstract class CoreMethods<T = any> extends Core<T> {
  constructor() {
    super();
  }

  /**
   * Handles running a task, and updating metadata.
   */
  private run() {
    if (this.tasks.list.length && this.tasks.running < this.options.concurrency) {
      const task = this.tasks.list.shift();

      if (task) {
        this.tasks.running++;
        const done = this.done(task);
        task(done);

        this.setWorking(true);

        if (isFunction(this.options.onRun)) {
          const { tasks, duration } = this;
          this.options.onRun({ task, tasks, duration });
        }

        return true
      }

      return false;
    }

    if (this.tasks.completed === this.tasks.total) {
      this.duration.end = new Date();
      this.duration.total =
        (this.duration.end.valueOf() ?? 0) - (this.duration.start?.valueOf() ?? 0);

      this.setWorking(false);

      if (isFunction(this.options.onEnd)) {
        const { tasks, duration } = this;
        this.options.onEnd({ tasks, duration });
      }
    }

    return false;
  }

  /**
   * Checks if slots are available and fills them up with tasks in the queue. Calls `run` internally.
   */
  protected runPending() {
    if (this.tasks.running < this.options.concurrency) {
      for (let i = this.tasks.running; i < this.options.concurrency; i++) {
        this.run();
      }
    }
  }

  /**
   * The done function marks a task as done, and frees a slot in the queue,
   * subsequently calling `run` to fill that slot up.
   *
   * @param result - The result of the task which can be accessed in `onDone`.
   */
  protected done(task: TaskWithMeta): Done<T> {
    return ((result: T) => {
      this.tasks.completed++;
      this.tasks.running--;
      this.duration.total = Date.now() - (this.duration.start?.valueOf() ?? 0);

      const endDate = new Date();
      task.meta.execution.end = endDate;
      task.meta.execution.time = endDate.valueOf() - task.meta.execution.start.valueOf();

      if (isFunction(this.options.onDone)) {
        const { tasks } = this;
        this.options.onDone({ task, tasks, result });
      }

      if (!this.__destroyed) {
        this.run();
      }
    }) as unknown as Done<T>;
  }

  /**
   * Checks whether the runner is free to start and triggers `onStart` method (if provided).
   */
  protected startCheck() {
    if (!this.__working) {
      this.duration.start = new Date();
      this.setWorking(true);
      if (isFunction(this.options.onStart)) {
        const { tasks, duration } = this;
        this.options.onStart({ tasks, duration });
      }
    }
  }

  /**
   * Triggers the `onAdd` method (if provided).
   */
  protected addCheck() {
    if (isFunction(this.options.onAdd)) {
      const { tasks } = this;
      this.options.onAdd({ tasks });
    }
  }

  /**
   * Triggers the `onRemove` method (if provided).
   */
  protected removeCheck(method: RemovalMethods, removedTasks: TaskWithMeta[]) {
    if (isFunction(this.options.onRemove)) {
      const { tasks } = this;
      this.options.onRemove({ tasks, method, removedTasks });
    }
  }

  /**
   * Checks whether the runner is free to start and runs pending. Triggers both `onStart` and `onRun` methods (if provided).
   */
  protected startCheckAndRunPending() {
    this.startCheck();
    this.runPending();
  }
}
