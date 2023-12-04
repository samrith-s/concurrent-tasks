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

export type TasksWithDone<T = any> = TaskWithDone<T>[];

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

export const AdditionMethods = {
  FIRST: "first",
  LAST: "last",
  AT_INDEX: "at-index",
  MULTIPLE_FIRST: "multiple-first",
  MULTIPLE_LAST: "multiple-range",
} as const;

export type AdditionMethods =
  (typeof AdditionMethods)[keyof typeof AdditionMethods];

export type RunnerDuration = {
  start: number;
  end: number;
  total: number;
};

type HookDefaults<T = any> = {
  tasks: TasksList<T>;
  count: TasksCount;
};

type HookFn<
  T = any,
  Data extends Record<string, any> = Record<string, never>
> = (
  args: Data extends Record<string, never>
    ? Readonly<HookDefaults<T>>
    : Readonly<HookDefaults<T> & Data>
) => void;

export type OnStart<T = any> = HookFn<T>;

export type OnAdd<T = any> = HookFn<
  T,
  {
    method: AdditionMethods;
  }
>;

export type OnRemove<T = any> = HookFn<
  T,
  { method: RemovalMethods; removedTasks: Tasks<T> }
>;

export type OnRun<T = any> = HookFn<
  T,
  {
    task: Task<T>;
  }
>;

export type OnDone<T = any> = HookFn<
  T,
  {
    task: Task<T>;
    result?: T;
  }
>;

export type OnEnd<T = any> = HookFn<
  T,
  {
    duration: RunnerDuration;
  }
>;

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
