import { CT, TaskRunner } from "../../src";

import { generateTasks } from "./generate-tasks";

export const RUNNER_NAME = "test-runner";

export function createRunner(
  options?: Partial<CT.RunnerOptions> & {
    taskCount?: number;
    taskDuration?: number;
  }
) {
  const runner = new TaskRunner<number>({
    autoStart: false,
    name: RUNNER_NAME,
    ...(options ?? {}),
  });
  const tasks = generateTasks(options?.taskCount, options?.taskDuration);
  runner.addMultiple(tasks);
  return runner;
}
