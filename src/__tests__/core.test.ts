import { CT, TaskRunner } from "..";
import { createRunner } from "../../testing-utils/utils/create-runner";
import { generateTasks } from "../../testing-utils/utils/generate-tasks";

describe("Core", () => {
  it("should throw an error if concurrency is not in range", () => {
    expect(
      () =>
        new TaskRunner({
          concurrency: -1,
        })
    ).toThrow(RangeError);
  });

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

    expect(runner.tasks[0].status).toBe(CT.TaskStatus.PENDING);

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

  describe("add", () => {
    it("should add the task to the beginning of the queue if `prepend` option is passed", () => {
      const taskCount = 10;
      const runner = createRunner({
        taskCount,
      });

      runner.add((done) => {
        console.log("Hello world!");
        done();
      }, true);

      expect(runner.tasks.at(0)?.id).toBe(taskCount);
    });

    it("should throw an error if a task is not a function", () => {
      const runner = createRunner({
        taskCount: 0,
      });

      expect(() => runner.add("hello" as any)).toThrow(TypeError);
    });

    it("should throw an error if a task is an instance `Task`", () => {
      const runner = createRunner({
        taskCount: 0,
      });

      expect(() =>
        runner.add(
          new CT.Task("my-task", (done: CT.Done<number>) => {
            console.log("This is my task!");
            done(1);
          }) as any
        )
      ).toThrow(TypeError);
    });
  });

  describe("remove", () => {
    it("should remove the task if a valid id is provided", () => {
      const runner = createRunner();
      const taskId = runner.tasks[0].id;

      const task = runner.remove(taskId);

      expect(task?.id).toBe(taskId);

      runner.destroy();
    });

    it("should not remove anything if a valid id is not provided", () => {
      const runner = createRunner();

      expect(runner.remove(-1)).toBeNull();

      runner.destroy();
    });
  });

  describe("removeAt", () => {
    it("should return the task if a valid index is provided", () => {
      const runner = createRunner();

      const taskId = runner.tasks[1].id;
      const removedTask = runner.removeAt(1);

      expect(removedTask).not.toBeNull();
      expect(removedTask?.id).toEqual(taskId);

      runner.destroy();
    });

    it("should not return any task if an invalid index is provided", () => {
      const runner = createRunner();

      expect(runner.removeAt(-1)).toBeNull();
      expect(runner.removeAt(100)).toBeNull();

      runner.destroy();
    });
  });

  describe("removeRange", () => {
    it("should return the removed range", () => {
      const runner = createRunner({
        taskCount: 2,
      });

      const removedTasks = runner.removeRange(0, 2);

      expect(removedTasks).toHaveLength(2);

      runner.destroy();
    });

    it("should return the removed range even if count is greater than the number of tasks available", () => {
      const runner = createRunner({
        taskCount: 2,
      });

      const removedTasks = runner.removeRange(0, 4);

      expect(removedTasks).toHaveLength(2);

      runner.destroy();
    });

    it("should not return the removed range if start index is out of bounds", () => {
      const runner = createRunner({
        taskCount: 2,
      });

      expect(runner.removeRange(-1, 4)).toBeNull();
      expect(runner.removeRange(10, 4)).toBeNull();

      runner.destroy();
    });
  });

  describe("setConcurrency", () => {
    it("should set the concurrency and execute run", (done) => {
      jest.useFakeTimers();

      const runner = createRunner({
        autoStart: true,
        onRun({ tasks }) {
          if (tasks.completed > 3) {
            runner.setConcurrency(5);
          }
        },
        onEnd({ duration }) {
          expect(duration.total).toBe(10);

          runner.destroy();

          done();
        },
      });

      jest.advanceTimersByTime(1000);
      jest.clearAllTimers();
    });
  });
});