import { Task, Tasks } from "./Task";

type Readonly<T = any> = {
  readonly [K in keyof T]: T[K];
};

export type Maybe<T> = T | undefined;

export type TaskID = number | string;
export type Done<T = any> = (result?: T) => void;
export type TaskReturn<T> = T | void;

export type TaskWithDone<T = any> = (
  done: Done<T>,
  id: TaskID
) => TaskReturn<T> | Promise<TaskReturn<T>>;

export type TasksList<T> = {
  readonly running: Tasks<T>;
  readonly pending: Tasks<T>;
  readonly completed: Tasks<T>;
};

export type TasksCount = {
  total: number;
  completed: number;
  pending: number;
  running: number;
};

export type TasksDescriptorWithList<T = any> = TasksCount & {
  list: Tasks<T>;
};

export enum TaskStatus {
  PENDING = "pending",
  RUNNING = "running",
  CANCELLED = "cancelled",
  DONE = "done",
}

export const RemovalMethods = {
  ALL: "all",
  BY_INDEX: "by-index",
  RANGE: "range",
  FIRST: "first",
  LAST: "last",
} as const;

export type RemovalMethods =
  (typeof RemovalMethods)[keyof typeof RemovalMethods];

export type RunnerDuration = {
  start: number;
  end: number;
  total: number;
};

export type OnStart<T = any> = ({
  tasks,
  descriptor,
}: Readonly<{
  tasks: TasksList<T>;
  descriptor: TasksCount;
}>) => void;

export type OnAdd<T = any> = ({
  tasks,
  descriptor,
}: Readonly<{
  tasks: TasksList<T>;
  descriptor: TasksCount;
}>) => void;

export type OnRemove<T = any> = ({
  tasks,
  descriptor,
  method,
  removedTasks,
}: Readonly<{
  tasks: TasksList<T>;
  descriptor: TasksCount;
  method: RemovalMethods;
  removedTasks: Tasks<T>;
}>) => void;

export type OnRun<T = any> = ({
  task,
  tasks,
  descriptor,
}: Readonly<{
  task: Task<T>;
  tasks: TasksList<T>;
  descriptor: TasksCount;
}>) => void;

export type OnDone<T = any> = ({
  task,
  tasks,
  descriptor,
  result,
}: Readonly<{
  task: Task<T>;
  tasks: TasksList<T>;
  descriptor: TasksCount;
  result?: T;
}>) => void;

export type OnEnd<T = any> = ({
  tasks,
  descriptor,
  duration,
}: Readonly<{
  tasks: TasksList<T>;
  descriptor: TasksCount;
  duration: RunnerDuration;
}>) => void;

export enum RunnerEvents {
  START = "onStart",
  ADD = "onAdd",
  REMOVE = "onRemove",
  RUN = "onRun",
  DONE = "onDone",
  END = "onEnd",
}

export type RunnerHooks<T> = {
  [RunnerEvents.START]: OnStart<T>;
  [RunnerEvents.ADD]: OnAdd<T>;
  [RunnerEvents.REMOVE]: OnRemove<T>;
  [RunnerEvents.RUN]: OnRun<T>;
  [RunnerEvents.DONE]: OnDone<T>;
  [RunnerEvents.END]: OnEnd<T>;
};

export type RunnerDefaultOptions<T> = RunnerHooks<T> & {
  concurrency: number;
  name: string | (() => string);
};

export type RunnerOptions<T = any> = {
  [K in keyof RunnerDefaultOptions<T>]: RunnerDefaultOptions<T>[K];
};

export type RunnerConcurrency = {
  max: number;
  used: number;
};
