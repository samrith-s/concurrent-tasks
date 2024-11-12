import { CT } from "../..";
import { generateTasks } from "../../../testing-utils/utils/generate-tasks";

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
    return new Promise((resolve) => {
      const tasks = generateTasks(benchConfig.taskCount, benchConfig.timeout);
      const total = tasks.length;
      const isLast = whatIsLast(total - 1);

      performance.mark(startMark);

      benchmark({
        tasks,
        total,
        done: () => {
          resolve(true);
          performance.mark(endMark);
          const entry = performance.measure(name, startMark, endMark);

          results.add(name, {
            Duration: `${entry.duration.toFixed(2)}ms`,
            ELU: `${(
              performance.eventLoopUtilization().utilization * 100
            ).toFixed(2)}%`,
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
