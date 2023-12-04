import { Maybe, TaskID } from "./Interface";
import { Task, Tasks } from "./Task";
import { isNumber } from "./Utils";

export class List<T = any> {
  private list: Tasks<T>;

  private _length = 0;

  constructor(list: Tasks<T> = []) {
    this.list = list;
    this._length = list.length;
  }

  private indexBound(index: number): boolean {
    return !index || (index > -1 && index < this._length);
  }

  private throwRangeError(index: number): undefined {
    throw new RangeError(
      `Index out of bounds. Expected index to be within range [0..${
        this._length - 1
      }]. Found ${index} instead.`
    );
  }

  get size() {
    return this._length;
  }

  public entries(): Tasks<T> {
    return [...this.list];
  }

  public first(): Maybe<Task<T>> {
    return this.list.at(0);
  }

  public last(): Maybe<Task<T>> {
    return this.list.at(-1);
  }

  public at(index: number): Maybe<Task<T>> {
    if (this.indexBound(index)) {
      return this.list[index];
    }

    return this.throwRangeError(index);
  }

  public range(index: number, count?: number): Maybe<Tasks<T>> {
    if (this.indexBound(index)) {
      const end = isNumber(count) ? count + 1 : undefined;
      return this.list.slice(index, end);
    }

    return this.throwRangeError(index);
  }

  public add(item: Task<T>): number {
    this._length++;
    return this.list.push(item);
  }

  public addFirst(item: Task<T>): number {
    this._length++;
    return this.list.unshift(item);
  }

  public addAt(index: number, item: Task<T>): Maybe<number> {
    if (this.indexBound(index)) {
      this._length++;
      this.list.splice(index, 0, item);
      return index;
    }

    return this.throwRangeError(index);
  }

  public remove(): Maybe<Task<T>> {
    if (this._length > 0) {
      this._length--;
      return this.list.pop() as Task<T>;
    }

    return void 0;
  }

  public removeFirst(): Maybe<Task<T>> {
    if (this._length > 0) {
      this._length--;
      return this.list.shift() as Task<T>;
    }

    return void 0;
  }

  public removeAt(index: number): Maybe<Task<T>> {
    if (this.indexBound(index)) {
      this._length--;
      return this.list.splice(index, 1)[0] as Task<T>;
    }

    return this.throwRangeError(index);
  }

  public removeRange(index: number, count?: number): Maybe<Tasks<T>> {
    if (this.indexBound(index)) {
      const removed = this.list.splice(index, count);
      this._length -= removed.length;

      return removed;
    }

    return this.throwRangeError(index);
  }

  public removeById(id: TaskID): Maybe<Task<T>> {
    const index = this.list.findIndex((task) => task.id === id);

    if (index > -1) {
      this._length--;
      return this.list.splice(index, 1).at(0);
    }

    return void 0;
  }

  public clear(): Tasks<T> {
    const removedTasks = this.list.slice();
    this._length = 0;
    this.list = [];

    return removedTasks;
  }
}
