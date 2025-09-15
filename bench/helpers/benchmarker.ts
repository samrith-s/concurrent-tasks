import { CT } from "../../src";
import { generateTasks } from "../../testing-utils/utils/generate-tasks";

import { cpuUsage } from "./cpu-usage";

function whatIsLast(last: number) {
  return function isLast(value: number, callback: () => void) {
    if (value === last) {
      callback();
    }
  };
}

type IsLast = ReturnType<typeof whatIsLast>;

export type BenchmarkArgs = {
  tasks: CT.TasksWithDone;
  total: number;
  isLast: IsLast;
  done: () => void;
};

function benchInner(
  name: string,
  benchmark: (args: BenchmarkArgs) => Promise<void> | void
) {
  const startMark = `${name}-start`;
  const endMark = `${name}-end`;

  const task = performance.timerify(() => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise((resolve) => {
      const tasks = generateTasks(benchConfig.taskCount, benchConfig.timeout);
      const total = tasks.length;
      const isLast = whatIsLast(total - 1);

      performance.mark(startMark);

      const startTime = Date.now();
      const startUsage = process.cpuUsage();

      benchmark({
        tasks,
        total,
        done: () => {
          resolve(true);
          performance.mark(endMark);
          const entry = performance.measure(name, startMark, endMark);
          const usage = cpuUsage(startUsage, startTime);

          results.add(name, {
            Duration: `${entry.duration.toFixed(2)}ms`,
            CPU: `${usage.toFixed(2)}%`,
          });
        },
        isLast,
      });
    });
  });

  const value = task as typeof task & {
    displayName: string;
  };

  value.displayName = name;

  return value;
}

export const bench = benchInner as typeof benchInner & {
  displayName: string;
};
