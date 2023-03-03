import { TaskWithDone, TaskID, TaskStatus, Done } from "./Interface";

export class Task<T = any> {
  private task: TaskWithDone<T>;

  private _id: TaskID;
  private _status: TaskStatus = TaskStatus.PENDING;

  constructor(id: TaskID, task: TaskWithDone<T>) {
    this.task = task;
    this._id = id;
  }

  public run(done: Done<T>) {
    this.task(done, this.id);
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
