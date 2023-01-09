import { CT, TaskRunner } from "../../src";

import { generateTasks } from "./generate-tasks";

export const RUNNER_NAME = "test-runner";

export function createRunner(
  options?: Partial<Omit<CT.RunnerOptions, "name" | "autoStart">> & {
    taskCount?: number;
    taskDuration?: number;
  }
) {
  const runner = new TaskRunner({
    ...(options ?? {}),
    name: RUNNER_NAME,
    autoStart: false,
  });
  runner.addMultiple(generateTasks(options?.taskCount, options?.taskDuration));
  return runner;
}
