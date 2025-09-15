import { bench } from "../helpers/benchmarker";

export const while_loop = bench("while-loop", ({ tasks, isLast, done }) => {
  const slicedTasks = tasks.slice();

  let resolved = false;
  let count = 0;

  while (!resolved && slicedTasks.length) {
    const task = slicedTasks.shift()!;

    task(() => {
      count++;
      isLast(count, () => {
        resolved = true;
        done();
      });
    }, slicedTasks.length);
  }
});
