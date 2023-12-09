import { CT, TaskRunner } from "..";
import { createRunner } from "../../testing-utils/utils/create-runner";
import {
  generateTask,
  generateTasks,
} from "../../testing-utils/utils/generate-tasks";
import { RemovalMethods } from "../Interface";

const TASK_COUNT = 10;

describe("TaskRunner", () => {
  describe("constructor", () => {
    it("should set the concurrency if it is a positive integer or -1", () => {
      const runner = createRunner();

      runner.setConcurrency(10);

      expect(runner.concurrency).toBe(10);

      runner.setConcurrency(-1);

      expect(runner.concurrency).toBe(Infinity);
    });

    it("should throw an error if concurrency is not in range", () => {
      expect(
        () =>
          new TaskRunner({
            concurrency: 0,
          })
      ).toThrow(RangeError);
      expect(
        () =>
          new TaskRunner({
            concurrency: -2,
          })
      ).toThrow(RangeError);
    });
  });

  describe("properties", () => {
    describe("concurrency", () => {
      it("should return the correct concurrency", () => {
        const runner = createRunner({
          taskCount: 0,
          concurrency: 10,
        });

        expect(runner.concurrency).toBe(10);
      });
    });

    describe("busy", () => {
      it("should show the correct status", () => {
        jest.useFakeTimers();

        const runner = createRunner({
          autoStart: true,
        });

        expect(runner.busy).toBeTruthy();

        runner.removeAll();

        jest.advanceTimersByTime(10000);

        expect(runner.busy).toBeFalsy();

        runner.destroy();

        jest.clearAllTimers();
      });
    });

    describe("paused", () => {
      it("should show the correct status", () => {
        const runner = createRunner({
          autoStart: true,
        });

        expect(runner.paused).toBeFalsy();

        runner.pause();

        expect(runner.paused).toBeTruthy();

        runner.destroy();
      });
    });

    describe("destroyed", () => {
      it("should show the correct status", () => {
        const runner = createRunner({
          autoStart: true,
        });

        expect(runner.destroyed).toBeFalsy();

        runner.destroy();

        expect(runner.destroyed).toBeTruthy();
      });
    });

    describe("count", () => {
      it("should return the correct counts", () => {
        const taskCount = 5;
        const runner = createRunner({
          taskCount,
        });

        expect(runner.count).toEqual({
          total: taskCount,
          running: 0,
          completed: 0,
          pending: taskCount,
        });
      });
    });

    describe("tasks", () => {
      it("should return the correct tasks", () => {
        const tasks = generateTasks();

        const runner = createRunner({
          taskCount: 0,
        });

        runner.tasks.pending.forEach((task, index) => {
          expect(task).toBe(tasks.at(index));
        });
      });
    });
  });

  describe("methods", () => {
    describe("addListener", () => {
      it("should add the listener", () => {
        const onAdd = jest.fn();

        const runner = createRunner({
          taskCount: 0,
        });

        runner.addListener(CT.RunnerEvents.ADD, onAdd);

        runner.add(generateTask());

        expect(onAdd).toHaveBeenCalledTimes(1);
      });

      it("should throw an error if the provided value is not a function", () => {
        const runner = createRunner({
          taskCount: 0,
        });

        expect(() =>
          runner.addListener(CT.RunnerEvents.ADD, "hello" as any)
        ).toThrow(TypeError);
      });
    });

    describe("removeListener", () => {
      it("should remove the listener", () => {
        const onAdd = jest.fn();

        const runner = createRunner({
          taskCount: 0,
        });

        runner.addListener(CT.RunnerEvents.ADD, onAdd);
        runner.add(generateTask());
        runner.removeListener(CT.RunnerEvents.ADD);
        runner.add(generateTask());

        expect(onAdd).toHaveBeenCalledTimes(1);
      });
    });

    describe("setConcurrency", () => {
      it("should set the concurrency", () => {
        const runner = createRunner({
          taskCount: 0,
          concurrency: 10,
        });

        expect(runner.concurrency).toBe(10);

        runner.setConcurrency(3);

        expect(runner.concurrency).toBe(3);
      });
    });

    describe("start", () => {
      it("should start the runner", () => {
        const runner = createRunner();

        expect(runner.start()).toBeTruthy();
        expect(runner.count.running).toBe(3);
      });

      it("should not start if the runner is already busy", () => {
        const runner = createRunner();

        expect(runner.start()).toBeTruthy();
        expect(runner.count.running).toBe(3);
        expect(runner.start()).toBeFalsy();
      });

      it("should resume the runner if it is paused", () => {
        const runner = createRunner({
          autoStart: true,
        });

        expect(runner.paused).toBeFalsy();

        runner.pause();

        expect(runner.paused).toBeTruthy();

        runner.start();

        expect(runner.paused).toBeFalsy();

        runner.destroy();
      });

      it("should not start if the runner is destroyed", () => {
        const runner = createRunner();

        runner.destroy();

        expect(runner.start()).toBeFalsy();
      });
    });

    describe("destroy", () => {
      it("should destroy the runner", () => {
        const runner = createRunner();

        runner.destroy();

        expect(runner.start()).toBeFalsy();
        expect(runner.busy).toBeFalsy();
      });
    });

    describe("pause", () => {
      it("should pause the runner", () => {
        const runner = createRunner();

        runner.pause();

        expect(runner.paused).toBeTruthy();

        runner.start();

        expect(runner.paused).toBeFalsy();
      });

      it("should return `false` if the runner is destroyed", () => {
        const runner = createRunner();

        expect(runner.pause()).toBeTruthy();

        runner.destroy();

        expect(runner.pause()).toBeFalsy();
      });
    });

    describe("add", () => {
      it("should add a task", () => {
        const runner = createRunner({
          taskCount: 0,
        });

        runner.add(generateTask());

        expect(runner.count.pending).toBe(1);
      });

      it("should throw an error if task is an invalid type", () => {
        const runner = createRunner();

        expect(() => runner.add("hello" as any)).toThrow(TypeError);
        expect(() => runner.add(new CT.Task(1, console.log) as any)).toThrow(
          TypeError
        );
      });
    });

    describe("addFirst", () => {
      it("should add to the beginning of the list", () => {
        const runner = createRunner({
          taskCount: 5,
        });

        runner.addFirst(console.log);

        expect(runner.tasks.pending.at(0)?.id).toBe(5);
      });
    });

    describe("addAt", () => {
      it("should add the task at a particular index", () => {
        const runner = createRunner();

        runner.addAt(3, console.log);

        expect(runner.tasks.pending.at(3)?.id).toBe(10);
      });
    });

    describe("addMultiple", () => {
      it("should add tasks to the list", () => {
        const runner = createRunner();

        runner.addMultiple(generateTasks(5));

        runner.tasks.pending.slice(10).forEach((task, idx) => {
          expect(task.id).toBe(idx + 10);
        });
      });

      it("should add tasks to the beginning of the list", () => {
        const runner = createRunner({
          taskCount: TASK_COUNT,
        });

        runner.addMultiple(generateTasks(5), true);

        runner.tasks.pending.slice(0, 5).forEach((task, idx) => {
          expect(task.id).toBe(TASK_COUNT + idx);
        });
      });
    });

    describe("addMultipleFirst", () => {
      it("should add tasks to the beginning of the list", () => {
        const runner = createRunner({
          taskCount: TASK_COUNT,
        });

        runner.addMultipleFirst(generateTasks(5));

        runner.tasks.pending.slice(0, 5).forEach((task, idx) => {
          expect(task.id).toBe(TASK_COUNT + idx);
        });
      });
    });

    describe("remove", () => {
      it("should remove the task at the end of the list", () => {
        const onRemove = jest.fn();
        const runner = createRunner({ onRemove });
        const tasks = runner.tasks;

        expect(runner.tasks.pending.at(-1)?.id).toBe(9);

        runner.remove();

        expect(runner.tasks.pending.at(-1)?.id).toBe(8);
        expect(onRemove).toHaveBeenCalledWith({
          tasks: runner.tasks,
          count: runner.count,
          duration: runner.duration,
          method: RemovalMethods.LAST,
          removedTasks: [tasks.all.at(-1)],
        });
      });
    });

    describe("removeFirst", () => {
      it("should remove the task at the beginning of the list", () => {
        const onRemove = jest.fn();
        const runner = createRunner({ onRemove });
        const tasks = runner.tasks;

        expect(runner.tasks.pending.at(0)?.id).toBe(0);

        runner.removeFirst();

        expect(runner.tasks.pending.at(0)?.id).toBe(1);
        expect(onRemove).toHaveBeenCalledWith({
          tasks: runner.tasks,
          count: runner.count,
          duration: runner.duration,
          method: RemovalMethods.FIRST,
          removedTasks: [tasks.all.at(0)],
        });
      });
    });

    describe("removeAt", () => {
      it("should remove the task at a particular index", () => {
        const onRemove = jest.fn();
        const runner = createRunner({ onRemove });
        const tasks = runner.tasks;

        expect(runner.tasks.pending.at(1)?.id).toBe(1);

        runner.removeAt(1);

        expect(runner.tasks.pending.at(1)?.id).toBe(2);
        expect(onRemove).toHaveBeenCalledWith({
          tasks: runner.tasks,
          count: runner.count,
          duration: runner.duration,
          method: RemovalMethods.BY_INDEX,
          removedTasks: [tasks.all.at(1)],
        });
      });
    });

    describe("removeRange", () => {
      it("should remove tasks from a particular range", () => {
        const onRemove = jest.fn();
        const runner = createRunner({ onRemove });
        const tasks = runner.tasks;

        expect(runner.tasks.pending.at(1)?.id).toBe(1);
        expect(runner.tasks.pending.at(2)?.id).toBe(2);

        runner.removeRange(1, 2);

        expect(runner.tasks.pending.at(1)?.id).toBe(3);
        expect(runner.tasks.pending.at(2)?.id).toBe(4);
        expect(onRemove).toHaveBeenCalledWith({
          tasks: runner.tasks,
          count: runner.count,
          duration: runner.duration,
          method: RemovalMethods.RANGE,
          removedTasks: tasks.all.slice(1, 3),
        });
      });
    });

    describe("removeAll", () => {
      const onRemove = jest.fn();
      const runner = createRunner({ onRemove });
      const tasks = runner.tasks;

      expect(runner.count.pending).toBe(10);

      runner.removeAll();

      expect(runner.count.pending).toBe(0);
      expect(onRemove).toHaveBeenCalledWith({
        tasks: runner.tasks,
        count: runner.count,
        duration: runner.duration,
        method: RemovalMethods.ALL,
        removedTasks: tasks.all,
      });
    });
  });

  describe("events", () => {
    describe("start", () => {
      describe("on", () => {
        it("should fire `start` hook when calling `start`", () => {
          const runner = createRunner();
          const onStart = jest.fn();

          expect(onStart).not.toHaveBeenCalled();

          runner.addListener(CT.RunnerEvents.START, onStart);
          runner.start();

          expect(onStart).toHaveBeenCalled();

          runner.destroy();
        });

        it("should not fire `start` hook when going from paused to unpaused state", () => {
          jest.useFakeTimers();

          const onStart = jest.fn();
          const onPause = jest.fn();
          const runner = createRunner();

          runner.addListener(CT.RunnerEvents.START, onStart);
          runner.addListener(CT.RunnerEvents.PAUSE, onPause);

          runner.start();

          expect(onStart).toHaveBeenCalledTimes(1);

          runner.pause();

          jest.advanceTimersByTime(10000);

          expect(onPause).toHaveBeenCalledTimes(1);

          runner.start();

          expect(onStart).toHaveBeenCalledTimes(1);

          runner.destroy();
        });
      });

      describe("off", () => {
        it("should not fire `start` hook when calling `start`", () => {
          const runner = createRunner();
          const onStart = jest.fn();

          expect(onStart).not.toHaveBeenCalled();

          runner.addListener(CT.RunnerEvents.START, onStart);
          runner.removeListener(CT.RunnerEvents.START);
          runner.start();

          expect(onStart).not.toHaveBeenCalled();

          runner.destroy();
        });
      });
    });

    describe("pause", () => {
      describe("on", () => {
        it("should fire `pause` hook when calling `pause`", () => {
          jest.useFakeTimers();

          const runner = createRunner();
          const onPause = jest.fn();

          expect(onPause).not.toHaveBeenCalled();

          runner.addListener(CT.RunnerEvents.PAUSE, onPause);
          runner.start();

          runner.pause();

          jest.advanceTimersByTime(1000);

          expect(onPause).toHaveBeenCalled();

          runner.destroy();

          jest.clearAllTimers();
        });
      });

      describe("off", () => {
        it("should not fire `pause` hook when calling `pause`", () => {
          jest.useFakeTimers();

          const runner = createRunner();
          const onPause = jest.fn();

          expect(onPause).not.toHaveBeenCalled();

          runner.addListener(CT.RunnerEvents.PAUSE, onPause);
          runner.start();
          runner.removeListener(CT.RunnerEvents.PAUSE);

          runner.pause();

          jest.advanceTimersByTime(1000);

          expect(onPause).not.toHaveBeenCalled();

          runner.destroy();

          jest.clearAllTimers();
        });
      });
    });

    describe("destroy", () => {
      describe("on", () => {
        it("should fire `destroy` hook when calling `destroy`", () => {
          jest.useFakeTimers();

          const runner = createRunner();
          const onDestroy = jest.fn();

          expect(onDestroy).not.toHaveBeenCalled();

          runner.addListener(CT.RunnerEvents.DESTROY, onDestroy);
          runner.start();

          runner.destroy();

          jest.advanceTimersByTime(1000);

          expect(onDestroy).toHaveBeenCalled();
        });
      });

      describe("off", () => {
        it("should not fire `destroy` hook when calling `destroy`", () => {
          jest.useFakeTimers();

          const runner = createRunner();
          const onDestroy = jest.fn();

          expect(onDestroy).not.toHaveBeenCalled();

          runner.addListener(CT.RunnerEvents.DESTROY, onDestroy);
          runner.start();
          runner.removeListener(CT.RunnerEvents.DESTROY);

          runner.destroy();

          jest.advanceTimersByTime(1000);

          expect(onDestroy).not.toHaveBeenCalled();

          jest.clearAllTimers();
        });
      });
    });

    describe("add", () => {
      describe("on", () => {
        it("should fire `add` event when one task is added", () => {
          const runner = createRunner({ taskCount: 0 });
          const onAdd = jest.fn();

          runner.addListener(CT.RunnerEvents.ADD, onAdd);
          runner.add(generateTask());
          runner.start();

          expect(onAdd).toHaveBeenCalled();

          runner.destroy();
        });

        it("should fire `add` event as many times when multiple tasks are added", () => {
          const runner = createRunner({ taskCount: 0 });
          const onAdd = jest.fn();

          runner.addListener(CT.RunnerEvents.ADD, onAdd);
          runner.addMultiple(generateTasks(TASK_COUNT));

          expect(onAdd).toHaveBeenCalledTimes(1);

          runner.destroy();
        });
      });

      describe("off", () => {
        it("should not fire `add` event when one task is added", () => {
          const runner = createRunner({ taskCount: 0 });
          const onAdd = jest.fn();

          runner.addListener(CT.RunnerEvents.ADD, onAdd);
          runner.removeListener(CT.RunnerEvents.ADD);
          runner.add(generateTask());
          runner.start();

          expect(onAdd).not.toHaveBeenCalled();

          runner.destroy();
        });

        it("should not fire `add` event as many times when multiple tasks are added", () => {
          const runner = createRunner({ taskCount: 0 });
          const onAdd = jest.fn();

          runner.addListener(CT.RunnerEvents.ADD, onAdd);
          runner.removeListener(CT.RunnerEvents.ADD);
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

          runner.addListener(CT.RunnerEvents.REMOVE, onRemove);
          runner.remove();

          expect(onRemove).toHaveBeenCalled();

          runner.destroy();
        });

        it("should fire `remove` event when removing all", () => {
          const runner = createRunner();
          const onRemove = jest.fn();

          runner.addListener(CT.RunnerEvents.REMOVE, onRemove);
          runner.removeAll();

          expect(onRemove).toHaveBeenCalled();

          runner.destroy();
        });

        it("should fire `remove` event when removing range", () => {
          const runner = createRunner();
          const onRemove = jest.fn();

          runner.addListener(CT.RunnerEvents.REMOVE, onRemove);
          runner.removeRange(1, 1);

          expect(onRemove).toHaveBeenCalled();

          runner.destroy();
        });

        it("should fire `remove` event when removing at", () => {
          const runner = createRunner();
          const onRemove = jest.fn();

          runner.addListener(CT.RunnerEvents.REMOVE, onRemove);
          runner.removeAt(1);

          expect(onRemove).toHaveBeenCalled();

          runner.destroy();
        });
      });

      describe("off", () => {
        it("should not fire `remove` event when removing one", () => {
          const runner = createRunner();
          const onRemove = jest.fn();

          runner.addListener(CT.RunnerEvents.REMOVE, onRemove);
          runner.removeListener(CT.RunnerEvents.REMOVE);
          runner.remove();

          expect(onRemove).not.toHaveBeenCalled();

          runner.destroy();
        });

        it("should not fire `remove` event when removing all", () => {
          const runner = createRunner();
          const onRemove = jest.fn();

          runner.addListener(CT.RunnerEvents.REMOVE, onRemove);
          runner.removeListener(CT.RunnerEvents.REMOVE);
          runner.removeAll();

          expect(onRemove).not.toHaveBeenCalled();

          runner.destroy();
        });

        it("should not fire `remove` event when removing range", () => {
          const runner = createRunner();
          const onRemove = jest.fn();

          runner.addListener(CT.RunnerEvents.REMOVE, onRemove);
          runner.removeListener(CT.RunnerEvents.REMOVE);
          runner.removeRange(1, 1);

          expect(onRemove).not.toHaveBeenCalled();

          runner.destroy();
        });
      });
    });

    describe("run", () => {
      describe("on", () => {
        it("should fire `run` event whenever a task in run", (done) => {
          jest.useFakeTimers();

          const runner = createRunner({
            onEnd() {
              expect(onRun).toHaveBeenCalledTimes(TASK_COUNT);
              jest.clearAllTimers();
              runner.destroy();
              done();
            },
          });
          const onRun = jest.fn();

          runner.addListener(CT.RunnerEvents.RUN, onRun);

          runner.start();

          jest.advanceTimersByTime(10000);
        });
      });

      describe("off", () => {
        it("should not fire `run` event whenever a task in run", (done) => {
          jest.useFakeTimers();

          const runner = createRunner();
          const onRun = jest.fn();

          runner.addListener(CT.RunnerEvents.RUN, onRun);
          runner.removeListener(CT.RunnerEvents.RUN);
          runner.addListener(CT.RunnerEvents.END, () => {
            expect(onRun).not.toHaveBeenCalled();
            jest.clearAllTimers();
            runner.destroy();
            done();
          });

          runner.start();

          jest.advanceTimersByTime(10000);
        });
      });
    });

    describe("done", () => {
      describe("on", () => {
        it("should fire `done` event whenever a task is done", (done) => {
          jest.useFakeTimers();

          const runner = createRunner();
          const onDone = jest.fn();

          runner.addListener(CT.RunnerEvents.DONE, onDone);
          runner.addListener(CT.RunnerEvents.END, () => {
            expect(onDone).toHaveBeenCalledTimes(TASK_COUNT);
            jest.clearAllTimers();
            runner.destroy();
            done();
          });
          runner.start();

          jest.advanceTimersByTime(10000);
        });
      });

      describe("off", () => {
        it("should not fire `done` event whenever a task is done", (done) => {
          jest.useFakeTimers();

          const runner = createRunner();
          const onDone = jest.fn();

          runner.addListener(CT.RunnerEvents.DONE, onDone);
          runner.removeListener(CT.RunnerEvents.DONE);
          runner.addListener(CT.RunnerEvents.END, () => {
            expect(onDone).not.toHaveBeenCalled();
            jest.clearAllTimers();
            runner.destroy();
            done();
          });
          runner.start();

          jest.advanceTimersByTime(10000);
        });
      });
    });

    describe("end", () => {
      describe("on", () => {
        it("should fire `end` event when all tasks are done", (done) => {
          jest.useFakeTimers();

          const onEnd = jest.fn().mockImplementation(() => {
            expect(onEnd).toHaveBeenCalled();
            jest.clearAllTimers();
            runner.destroy();
            done();
          });
          const runner = createRunner();

          runner.addListener(CT.RunnerEvents.END, onEnd);
          runner.start();

          jest.advanceTimersByTime(10000);
        });
      });

      describe("off", () => {
        it("should not fire `end` event when all tasks are done", () => {
          jest.useFakeTimers();

          const onEnd = jest.fn();
          const runner = createRunner();

          runner.addListener(CT.RunnerEvents.END, onEnd);
          runner.start();

          jest.advanceTimersByTime(10000);

          expect(onEnd).toHaveBeenCalledTimes(1);

          runner.removeListener(CT.RunnerEvents.END);
          runner.addMultiple(generateTasks());
          runner.start();

          jest.advanceTimersByTime(10000);

          expect(onEnd).toHaveBeenCalledTimes(1);

          jest.clearAllTimers();
        });
      });
    });
  });
});
