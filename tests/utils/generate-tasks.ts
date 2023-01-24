import { CT } from "src";

export function generateTask(result = -1, timeout = 5) {
  return (done: CT.Done<number>) => {
    setTimeout(() => {
      done(result);
    }, timeout);
  };
}

export function generateTasks(count = 10, timeout = 5) {
  const tasks = [];

  for (let i = 0; i < count; i++) {
    tasks.push(generateTask(i, timeout));
  }

  return tasks;
}
