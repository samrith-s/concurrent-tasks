import { CT, TaskRunner } from "..";
import { createRunner } from "../../testing-utils/utils/create-runner";
import {
  generateTask,
  generateTasks,
} from "../../testing-utils/utils/generate-tasks";
import { AdditionMethods, RemovalMethods } from "../Interface";

const TASK_COUNT = 10;

describe("TaskRunner", () => {
  describe("constructor", () => {
    it("should throw an error if concurrency is not in range", () => {
      expect(
        () =>
          new TaskRunner({
            concurrency: -1,
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
        const runner = createRunner({
          autoStart: true,
        });

        expect(runner.busy).toBeTruthy();

        runner.removeAll();

        expect(runner.busy).toBeFalsy();

        runner.destroy();
      });
    });

    describe("count", () => {
      it("should return the correct descriptor", () => {
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

        runner.addListener("onAdd", onAdd);

        runner.add(generateTask());

        expect(onAdd).toHaveBeenCalledTimes(1);
      });

      it("should throw an error if the provided value is not a function", () => {
        const runner = createRunner({
          taskCount: 0,
        });

        expect(() => runner.addListener("onAdd", "hello" as any)).toThrow(
          TypeError
        );
      });
    });

    describe("removeListener", () => {
      it("should remove the listener", () => {
        const onAdd = jest.fn();

        const runner = createRunner({
          taskCount: 0,
        });

        runner.addListener("onAdd", onAdd);
        runner.add(generateTask());
        runner.removeListener("onAdd");
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
        method: RemovalMethods.ALL,
        removedTasks: tasks.all,
      });
    });
  });

  describe("hooks", () => {
    describe("onStart", () => {
      it("should call `onStart` hook when calling `start`", () => {
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
        expect(onAdd).toHaveBeenCalledWith({
          tasks: runner.tasks,
          count: runner.count,
          method: AdditionMethods.LAST,
        });

        runner.addFirst(generateTask());
        expect(onAdd).toHaveBeenCalledWith({
          tasks: runner.tasks,
          count: runner.count,
          method: AdditionMethods.FIRST,
        });

        runner.destroy();
      });

      it("should call `onAdd` hook as many times when multiple tasks are added", () => {
        const onAdd = jest.fn();
        const runner = createRunner({ onAdd, taskCount: 0 });

        runner.addMultiple(generateTasks(10));
        expect(onAdd).toHaveBeenCalledWith({
          tasks: runner.tasks,
          count: runner.count,
          method: AdditionMethods.MULTIPLE_LAST,
        });

        runner.addMultiple(generateTasks(10), true);
        expect(onAdd).toHaveBeenCalledWith({
          tasks: runner.tasks,
          count: runner.count,
          method: AdditionMethods.MULTIPLE_FIRST,
        });

        runner.destroy();
      });
    });

    describe("onRemove", () => {
      it("should call `onRemove` hook when removing one", () => {
        const onRemove = jest.fn();
        const runner = createRunner({ onRemove });

        runner.remove();
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
          const runner = createRunner({
            onEnd() {
              expect(onRun).toHaveBeenCalledTimes(TASK_COUNT);
              done();

              runner.destroy();
            },
          });
          const onRun = jest.fn();

          runner.addListener(CT.RunnerEvents.RUN, onRun);

          runner.start();
        });
      });

      describe("off", () => {
        it("should not fire `run` event whenever a task in run", (done) => {
          const runner = createRunner();
          const onRun = jest.fn();

          runner.addListener(CT.RunnerEvents.RUN, onRun);
          runner.removeListener(CT.RunnerEvents.RUN);
          runner.addListener(CT.RunnerEvents.END, () => {
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

          runner.addListener(CT.RunnerEvents.DONE, onDone);
          runner.addListener(CT.RunnerEvents.END, () => {
            expect(onDone).toHaveBeenCalledTimes(TASK_COUNT);
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

          runner.addListener(CT.RunnerEvents.DONE, onDone);
          runner.removeListener(CT.RunnerEvents.DONE);
          runner.addListener(CT.RunnerEvents.END, () => {
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

          runner.addListener(CT.RunnerEvents.END, onEnd);
          runner.start();
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
