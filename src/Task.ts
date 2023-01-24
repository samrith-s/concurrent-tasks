import { TaskWithDone, TaskExecution, TaskID, TaskStatus, Done } from "./Interface";

export class Task<T = any> {
  private task: TaskWithDone<T>;

  private execution: TaskExecution = {
    start: null,
    end: null,
    time: 0,
  };

  private _id: TaskID;
  private _status: TaskStatus = TaskStatus.PENDING;

  constructor(id: TaskID, task: TaskWithDone<T>) {
    this.task = task;
    this._id = id;
  }

  public run(done: Done<T>) {
    this.execution.start = Date.now();
    this.task(done, this.id);
  }

  public done() {
    this.execution.end = Date.now();
    this.execution.time = this.execution.end - (this.execution.start ?? 0);
  }

  get id() {
    return this._id;
  }

  get status() {
    return this._status;
  }

  set status(status: TaskStatus) {
    if (Object.values(TaskStatus).includes(status)) {
      this._status = status;
    }
  }
}
