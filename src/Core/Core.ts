import { Duration, RunnerOptions, TasksDescriptor } from "../Interface";

export abstract class Core<T = any> {
  protected taskIds = 0;

  protected __working = false;
  protected __destroyed = false;
  protected __paused = false;

  protected options: RunnerOptions<T> = {} as RunnerOptions<T>;

  protected tasks: TasksDescriptor<T> = {
    total: 0,
    completed: 0,
    running: 0,
    list: [],
  };

  protected duration: Duration = {
    total: 0,
  };

  protected setWorking(working: boolean): void {
    if (!this.__destroyed) {
      this.__working = working;
    } else {
      this.__working = false;
    }
  }

  protected setDestroyed(destroyed: boolean) {
    this.__working = false;
    this.__destroyed = destroyed;
  }
}
