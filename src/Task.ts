import { TaskWithDone, TaskID, TaskStatus, Done } from "./Interface";

export type Tasks<T = any> = Task<T>[];

export class Task<T = any> {
  private task: TaskWithDone<T>;

  private _id: TaskID;
  private _status: TaskStatus = TaskStatus.PENDING;

  constructor(id: TaskID, task: TaskWithDone<T>) {
    this.task = task;
    this._id = id;
  }

  get id(): TaskID {
    return this._id;
  }

  get status(): TaskStatus {
    return this._status;
  }

  set status(status: TaskStatus) {
    if (Object.values(TaskStatus).includes(status)) {
      this._status = status;
    }
  }

  public run(done: Done<T>): void {
    this.task(done, this.id);
  }
}
