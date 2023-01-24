import { describe, it, expect, vitest } from "vitest";

import { createRunner } from "./utils/create-runner";
import { generateTask, generateTasks } from "./utils/generate-tasks";

const TASK_COUNT = 10;

describe.concurrent("Hooks", () => {
  describe.concurrent("onStart", () => {
    it("should call `onStart` hook when `autoStart` is enabled", () => {
      const onStart = vitest.fn();
      const runner = createRunner({ onStart, autoStart: true });

      expect(onStart).toHaveBeenCalled();

      runner.destroy();
    });

    it("should call `onStart` hook when calling `start` manually", () => {
      const onStart = vitest.fn();
      const runner = createRunner({ onStart });

      expect(onStart).not.toHaveBeenCalled();

      runner.start();

      expect(onStart).toHaveBeenCalled();

      runner.destroy();
    });
  });

  describe.concurrent("onAdd", () => {
    it("should call `onAdd` hook when one task is added", () => {
      const onAdd = vitest.fn();
      const runner = createRunner({ onAdd, taskCount: 0 });

      runner.add(generateTask());
      expect(onAdd).toHaveBeenCalled();

      runner.destroy();
    });

    it("should call `onAdd` hook as many times when multiple tasks are added", () => {
      const onAdd = vitest.fn();
      const runner = createRunner({ onAdd, taskCount: 0 });

      runner.addMultiple(generateTasks(10));
      expect(onAdd).toHaveBeenCalled();

      runner.destroy();
    });
  });

  describe.concurrent("onRemove", () => {
    it("should call `onRemove` hook when removing one", () => {
      const onRemove = vitest.fn();
      const runner = createRunner({ onRemove });

      runner.remove(1);
      expect(onRemove).toHaveBeenCalled();

      runner.destroy();
    });

    it("should call `onRemove` hook when removing all", () => {
      const onRemove = vitest.fn();
      const runner = createRunner({ onRemove });

      runner.removeAll();
      expect(onRemove).toHaveBeenCalled();

      runner.destroy();
    });
  });

  describe.concurrent("onRun", () => {
    it("should call `onRun` hook whenever a task in run", () =>
      new Promise<void>((done) => {
        const onRun = vitest.fn();

        const runner = createRunner({
          onRun,
          autoStart: true,
          taskCount: TASK_COUNT,
          onEnd() {
            expect(onRun).toHaveBeenCalledTimes(TASK_COUNT);
            done();

            runner.destroy();
          },
        });
      }).catch(console.error));
  });

  describe.concurrent("onDone", () => {
    it("should call `onDone` hook whenever a task is done", () =>
      new Promise<void>((done) => {
        const onDone = vitest.fn();

        const runner = createRunner({
          onDone,
          autoStart: true,
          taskCount: TASK_COUNT,
          onEnd() {
            expect(onDone).toHaveBeenCalledTimes(TASK_COUNT);
            done();

            runner.destroy();
          },
        });
      }).catch(console.error));
  });

  describe.concurrent("onEnd", () => {
    it("should call `onEnd` hook when all tasks are done", () =>
      new Promise<void>((done) => {
        let count = 0;

        const runner = createRunner({
          autoStart: true,
          taskCount: TASK_COUNT,
          onEnd() {
            count++;
            expect(count).eq(1);
            done();

            runner.destroy();
          },
        });
      }).catch(console.error));
  });
});
