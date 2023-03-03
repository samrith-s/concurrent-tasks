import { CT } from "../src";

import { createRunner } from "./utils/create-runner";
import { generateTasks } from "./utils/generate-tasks";

describe("Core", () => {
  it("should display correct working status", () => {
    const runner = createRunner({
      autoStart: true,
    });
    expect(runner.busy).toBeTruthy();

    runner.removeAll();

    expect(runner.busy).toBeFalsy();

    runner.destroy();
  });

  it("should not update working status if runner is destroyed", () => {
    const runner = createRunner({
      autoStart: true,
    });

    expect(runner.busy).toBeTruthy();

    runner.destroy();
    runner.addMultiple(generateTasks(10));

    expect(runner.busy).toBeFalsy();
  });

  it("should show correct status for task", (done) => {
    const runner = createRunner({
      autoStart: false,
      taskCount: 1,
      taskDuration: 0,
      onDone({ task }) {
        expect(task.status).toBe(CT.TaskStatus.DONE);

        runner.destroy();

        done();
      },
    });

    expect(runner.taskList[0].status).toBe(CT.TaskStatus.PENDING);

    runner.start();
  });

  it("should print the correct duration on end", (done) => {
    jest.useFakeTimers();
    const TASK_COUNT = 10;
    const runner = createRunner({
      autoStart: true,
      concurrency: 1,
      taskDuration: 0,
      taskCount: TASK_COUNT,
      onEnd({ duration }) {
        expect(duration.total).toBe(TASK_COUNT - 1);
        runner.destroy();

        done();
      },
    });
    jest.advanceTimersByTime(1000);
    jest.clearAllTimers();
  });

  describe("start", () => {
    it("should return `false` if runner is already working", () => {
      const runner = createRunner({
        autoStart: true,
      });

      expect(runner.start()).toBeFalsy();

      runner.destroy();
    });

    it("should return `false` if runner is destroyed", () => {
      const runner = createRunner({
        autoStart: true,
      });

      runner.destroy();

      expect(runner.start()).toBeFalsy();
    });

    it("should return `true` if it is able to start", () => {
      const runner = createRunner();

      expect(runner.start()).toBeTruthy();

      runner.destroy();
    });
  });

  describe("remove", () => {
    it("should return the task if a valid id is provided", () => {
      const runner = createRunner();
      const taskId = runner.taskList[0].id;

      runner.remove(taskId);

      expect(runner.taskList[0].id).not.toBe(taskId);

      runner.destroy();
    });

    it("should not return anything if a valid id is not provided", () => {
      const runner = createRunner();

      expect(runner.remove(-1)).toBeUndefined();

      runner.destroy();
    });
  });

  describe("removeRange", () => {
    it("should return the removed range and call `onRemove`", () => {
      const onRemove = jest.fn();
      const runner = createRunner({
        taskCount: 1,
        onRemove,
      });

      runner.removeRange(0, 0);

      expect(onRemove).toHaveBeenCalled();
    });
  });
});
