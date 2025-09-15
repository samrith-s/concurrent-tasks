import { bench } from "../helpers/benchmarker";

export const for_loop = bench("for-loop", ({ tasks, isLast, done }) => {
  for (const idx in tasks) {
    const task = tasks[idx];
    const count = Number(idx);

    task(() => {
      isLast(count, done);
    }, count);
  }
});
