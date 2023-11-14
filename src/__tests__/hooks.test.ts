import { createRunner } from "../../testing-utils/utils/create-runner";
import {
  generateTask,
  generateTasks,
} from "../../testing-utils/utils/generate-tasks";

const TASK_COUNT = 10;

describe("Hooks", () => {
  describe("onStart", () => {
    it("should call `onStart` hook when `autoStart` is enabled", () => {
      const onStart = jest.fn();
      const runner = createRunner({ onStart, autoStart: true });

      expect(onStart).toHaveBeenCalled();

      runner.destroy();
    });

    it("should call `onStart` hook when calling `start` manually", () => {
      const onStart = jest.fn();
      const runner = createRunner({ onStart });

      expect(onStart).not.toHaveBeenCalled();

      runner.start();

      expect(onStart).toHaveBeenCalled();

      runner.destroy();
    });
  });

  describe("onAdd", () => {
    it("should call `onAdd` hook when one task is added", () => {
      const onAdd = jest.fn();
      const runner = createRunner({ onAdd, taskCount: 0 });

      runner.add(generateTask());
      expect(onAdd).toHaveBeenCalled();

      runner.destroy();
    });

    it("should call `onAdd` hook as many times when multiple tasks are added", () => {
      const onAdd = jest.fn();
      const runner = createRunner({ onAdd, taskCount: 0 });

      runner.addMultiple(generateTasks(10));
      expect(onAdd).toHaveBeenCalled();

      runner.destroy();
    });
  });

  describe("onRemove", () => {
    it("should call `onRemove` hook when removing one", () => {
      const onRemove = jest.fn();
      const runner = createRunner({ onRemove });

      runner.remove(1);
      expect(onRemove).toHaveBeenCalled();

      runner.destroy();
    });

    it("should call `onRemove` hook when removing all", () => {
      const onRemove = jest.fn();
      const runner = createRunner({ onRemove });

      runner.removeAll();
      expect(onRemove).toHaveBeenCalled();

      runner.destroy();
    });

    it("should call `onRemove` hook when removing range", () => {
      const onRemove = jest.fn();
      const runner = createRunner({ onRemove });

      runner.removeRange(0, 1);
      expect(onRemove).toHaveBeenCalled();

      runner.destroy();
    });

    it("should call `onRemove` hook when removing at", () => {
      const onRemove = jest.fn();
      const runner = createRunner({ onRemove });

      runner.removeAt(1);
      expect(onRemove).toHaveBeenCalled();

      runner.destroy();
    });
  });

  describe("onRun", () => {
    it("should call `onRun` hook whenever a task in run", (done) => {
      const onRun = jest.fn();

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
    });
  });

  describe("onDone", () => {
    it("should call `onDone` hook whenever a task is done", (done) => {
      const onDone = jest.fn();

      const runner = createRunner({
        onDone,
        autoStart: true,
        taskCount: TASK_COUNT,
        concurrency: 1,
        onEnd() {
          expect(onDone).toHaveBeenCalledTimes(TASK_COUNT);

          runner.destroy();

          done();
        },
      });
    });
  });

  describe("onEnd", () => {
    it("should call `onEnd` hook when all tasks are done", (done) => {
      const onEnd = jest.fn().mockImplementation(() => {
        expect(onEnd).toHaveBeenCalled();

        runner.destroy();
        done();
      });

      const runner = createRunner({
        autoStart: true,
        taskCount: TASK_COUNT,
        onEnd,
      });
    });
  });
});
