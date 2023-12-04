import { generateTask } from "../../testing-utils/utils/generate-tasks";
import { TaskStatus } from "../Interface";
import { Task } from "../Task";

describe("Task", () => {
  describe("id", () => {
    it("should return the correct id", () => {
      const task = new Task(1, generateTask());
      expect(task.id).toBe(1);
    });
  });

  describe("status", () => {
    it("should return the correct status", () => {
      const task = new Task(1, generateTask());
      expect(task.status).toBe(TaskStatus.PENDING);
    });

    it("should not set status if it is not a valid status", () => {
      const task = new Task(1, generateTask());

      task.status = "Hello!" as TaskStatus;

      expect(task.status).toBe(TaskStatus.PENDING);
    });
  });

  describe("run", () => {
    const taskFn = jest.fn().mockImplementation((done) => {
      done();
    });
    const doneFn = jest.fn();

    const task = new Task(1, taskFn);

    task.run(doneFn);

    expect(taskFn).toHaveBeenCalledTimes(1);
    expect(taskFn).toHaveBeenCalledWith(doneFn, 1);

    expect(doneFn).toHaveBeenCalledTimes(1);
  });
});
