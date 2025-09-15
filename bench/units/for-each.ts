import { bench } from "../helpers/benchmarker";

export const for_each = bench("for-each", ({ tasks, isLast, done }) => {
  tasks.forEach((task, index) => {
    task(() => {
      isLast(index, done);
    }, index);
  });
});
