import { CT } from "../../src";

export function generateTask(result = -1, timeout = 5): CT.Task<number> {
  return function Task(done) {
    setTimeout(() => {
      done(result);
    }, timeout);
  };
}

export function generateTasks(count = 10, timeout = 5) {
  const tasks: CT.Task<number>[] = [];

  for (let i = 0; i < count; i++) {
    tasks.push(generateTask(i, timeout));
  }

  return tasks;
}
