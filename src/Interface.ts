import { Task } from "./Task";

export type TaskID = number;
export type Done<T = any> = (result?: T) => void;
export type TaskReturn<T> = T | void;

export type TaskWithDone<T = any> = (
  done: Done<T>,
  id: TaskID
) => TaskReturn<T> | Promise<TaskReturn<T>>;

export type TaskExecution = {
  start: number | null;
  end: number | null;
  time: number;
};

export type TasksDescriptor<T = any> = {
  total: number;
  completed: number;
  list: Task<T>[];
};

export enum TaskStatus {
  PENDING = "pending",
  RUNNING = "running",
  CANCELLED = "cancelled",
  DONE = "done",
}

export const RemovalMethods = {
  ALL: "all",
  BY_ID: "by-id",
  RANGE: "range",
} as const;

export type RemovalMethods = (typeof RemovalMethods)[keyof typeof RemovalMethods];

export type RunnerDuration = {
  start: number;
  end: number;
  total: number;
};

export type OnStart<T = any> = ({ tasks }: { tasks: TasksDescriptor<T> }) => void;
export type OnAdd<T = any> = ({ tasks }: { tasks: TasksDescriptor<T> }) => void;
export type OnRemove<T = any> = ({
  tasks,
  method,
  removedTasks,
}: {
  tasks: TasksDescriptor<T>;
  method: RemovalMethods;
  removedTasks: Task<T>[];
}) => void;
export type OnRun<T = any> = ({
  task,
  tasks,
}: {
  task: Task<T>;
  tasks: TasksDescriptor<T>;
}) => void;
export type OnDone<T = any> = ({
  task,
  tasks,
  result,
}: {
  task: Task<T>;
  tasks: TasksDescriptor<T>;
  result?: T;
}) => void;
export type OnEnd<T = any> = ({
  tasks,
  duration,
}: {
  tasks: TasksDescriptor<T>;
  duration: RunnerDuration;
}) => void;

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
  autoStart: boolean;
  name: string | (() => string);
};

export type RunnerOptions<T = any> = {
  [K in keyof RunnerDefaultOptions<T>]: RunnerDefaultOptions<T>[K];
};

export type RunnerConcurrency = {
  max: number;
  used: number;
};
