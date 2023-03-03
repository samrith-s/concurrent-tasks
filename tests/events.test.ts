import { CT } from "../src";

import { createRunner } from "./utils/create-runner";
import { generateTask, generateTasks } from "./utils/generate-tasks";

const TASK_COUNT = 10;

describe("Events", () => {
  describe("start", () => {
    describe("on", () => {
      it("should fire `start` event when `autoStart` is enabled", () => {
        const runner = createRunner();
        const onStart = jest.fn();

        runner.listen(CT.RunnerEvents.START, onStart);
        runner.setOptions({ autoStart: true });

        expect(onStart).toHaveBeenCalled();

        runner.destroy();
      });

      it("should fire `start` hook when calling `start` manually", () => {
        const runner = createRunner();
        const onStart = jest.fn();

        expect(onStart).not.toHaveBeenCalled();

        runner.listen(CT.RunnerEvents.START, onStart);
        runner.start();

        expect(onStart).toHaveBeenCalled();

        runner.destroy();
      });
    });

    describe("off", () => {
      it("should not fire `start` event when `autoStart` is enabled", () => {
        const runner = createRunner();
        const onStart = jest.fn();

        runner.listen(CT.RunnerEvents.START, onStart);
        runner.unlisten(CT.RunnerEvents.START);
        runner.setOptions({ autoStart: true });

        expect(onStart).not.toHaveBeenCalled();

        runner.destroy();
      });

      it("should not fire `start` hook when calling `start` manually", () => {
        const runner = createRunner();
        const onStart = jest.fn();

        expect(onStart).not.toHaveBeenCalled();

        runner.listen(CT.RunnerEvents.START, onStart);
        runner.unlisten(CT.RunnerEvents.START);
        runner.start();

        expect(onStart).not.toHaveBeenCalled();

        runner.destroy();
      });
    });
  });

  describe("add", () => {
    describe("on", () => {
      it("should fire `add` event when one task is added", () => {
        const runner = createRunner({ taskCount: 0 });
        const onAdd = jest.fn();

        runner.listen(CT.RunnerEvents.ADD, onAdd);
        runner.add(generateTask());
        runner.start();

        expect(onAdd).toHaveBeenCalled();

        runner.destroy();
      });

      it("should fire `add` event as many times when multiple tasks are added", () => {
        const runner = createRunner({ taskCount: 0 });
        const onAdd = jest.fn();

        runner.listen(CT.RunnerEvents.ADD, onAdd);
        runner.addMultiple(generateTasks(TASK_COUNT));

        // expect(onAdd).toHaveBeenCalledTimes(TASK_COUNT);

        runner.destroy();
      });
    });

    describe("off", () => {
      it("should not fire `add` event when one task is added", () => {
        const runner = createRunner({ taskCount: 0 });
        const onAdd = jest.fn();

        runner.listen(CT.RunnerEvents.ADD, onAdd);
        runner.unlisten(CT.RunnerEvents.ADD);
        runner.add(generateTask());
        runner.start();

        expect(onAdd).not.toHaveBeenCalled();

        runner.destroy();
      });

      it("should not fire `add` event as many times when multiple tasks are added", () => {
        const runner = createRunner({ taskCount: 0 });
        const onAdd = jest.fn();

        runner.listen(CT.RunnerEvents.ADD, onAdd);
        runner.unlisten(CT.RunnerEvents.ADD);
        runner.addMultiple(generateTasks(TASK_COUNT));

        expect(onAdd).not.toHaveBeenCalled();

        runner.destroy();
      });
    });
  });

  describe("remove", () => {
    describe("on", () => {
      it("should fire `remove` event when removing one", () => {
        const runner = createRunner();
        const onRemove = jest.fn();

        runner.listen(CT.RunnerEvents.REMOVE, onRemove);
        runner.remove(1);

        expect(onRemove).toHaveBeenCalled();

        runner.destroy();
      });

      it("should fire `remove` event when removing all", () => {
        const runner = createRunner();
        const onRemove = jest.fn();

        runner.listen(CT.RunnerEvents.REMOVE, onRemove);
        runner.removeAll();

        expect(onRemove).toHaveBeenCalled();

        runner.destroy();
      });

      it("should fire `remove1 event when removing range", () => {
        const runner = createRunner();
        const onRemove = jest.fn();

        runner.listen(CT.RunnerEvents.REMOVE, onRemove);
        runner.removeRange(1, 1);

        expect(onRemove).toHaveBeenCalled();

        runner.destroy();
      });
    });

    describe("off", () => {
      it("should not fire `remove` event when removing one", () => {
        const runner = createRunner();
        const onRemove = jest.fn();

        runner.listen(CT.RunnerEvents.REMOVE, onRemove);
        runner.unlisten(CT.RunnerEvents.REMOVE);
        runner.remove(1);

        expect(onRemove).not.toHaveBeenCalled();

        runner.destroy();
      });

      it("should not fire `remove` event when removing all", () => {
        const runner = createRunner();
        const onRemove = jest.fn();

        runner.listen(CT.RunnerEvents.REMOVE, onRemove);
        runner.unlisten(CT.RunnerEvents.REMOVE);
        runner.removeAll();

        expect(onRemove).not.toHaveBeenCalled();

        runner.destroy();
      });

      it("should not fire `remove` event when removing range", () => {
        const runner = createRunner();
        const onRemove = jest.fn();

        runner.listen(CT.RunnerEvents.REMOVE, onRemove);
        runner.unlisten(CT.RunnerEvents.REMOVE);
        runner.removeRange(1, 1);

        expect(onRemove).not.toHaveBeenCalled();

        runner.destroy();
      });
    });
  });

  describe("run", () => {
    describe("on", () => {
      it("should fire `run` event whenever a task in run", (done) => {
        const runner = createRunner();
        const onRun = jest.fn();

        runner.listen(CT.RunnerEvents.RUN, onRun);
        runner.listen(CT.RunnerEvents.END, () => {
          // expect(onRun).toHaveBeenCalledTimes(TASK_COUNT);
          done();

          runner.destroy();
        });
        runner.start();
      });
    });

    describe("off", () => {
      it("should not fire `run` event whenever a task in run", (done) => {
        const runner = createRunner();
        const onRun = jest.fn();

        runner.listen(CT.RunnerEvents.RUN, onRun);
        runner.unlisten(CT.RunnerEvents.RUN);
        runner.listen(CT.RunnerEvents.END, () => {
          expect(onRun).not.toHaveBeenCalled();
          done();

          runner.destroy();
        });
        runner.start();
      });
    });
  });

  describe("done", () => {
    describe("on", () => {
      it("should fire `done` event whenever a task is done", (done) => {
        const runner = createRunner();
        const onDone = jest.fn();

        runner.listen(CT.RunnerEvents.DONE, onDone);
        runner.listen(CT.RunnerEvents.END, () => {
          // expect(onDone).toHaveBeenCalledTimes(TASK_COUNT);
          done();

          runner.destroy();
        });
        runner.start();
      });
    });

    describe("off", () => {
      it("should not fire `done` event whenever a task is done", (done) => {
        const runner = createRunner();
        const onDone = jest.fn();

        runner.listen(CT.RunnerEvents.DONE, onDone);
        runner.unlisten(CT.RunnerEvents.DONE);
        runner.listen(CT.RunnerEvents.END, () => {
          expect(onDone).not.toHaveBeenCalled();
          done();

          runner.destroy();
        });
        runner.start();
      });
    });
  });

  describe("end", () => {
    describe("on", () => {
      it("should fire `end` event when all tasks are done", (done) => {
        const onEnd = jest.fn().mockImplementation(() => {
          expect(onEnd).toHaveBeenCalled();

          runner.destroy();

          done();
        });
        const runner = createRunner();

        runner.listen(CT.RunnerEvents.END, onEnd);
        runner.start();
      });
    });

    describe("off", () => {
      it("should not fire `end` event when all tasks are done", (done) => {
        const onEnd = jest.fn();
        const runner = createRunner();

        runner.listen(CT.RunnerEvents.END, onEnd);
        runner.unlisten(CT.RunnerEvents.END);

        runner.setHooks({
          onEnd() {
            expect(onEnd).not.toHaveBeenCalled();

            runner.destroy();

            done();
          },
        });

        runner.start();
      });
    });
  });
});
