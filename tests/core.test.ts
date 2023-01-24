import { describe, expect, it, vitest } from "vitest";

import { RunnerEvents } from "src/Interface";

import { createRunner } from "./utils/create-runner";
import { generateTasks } from "./utils/generate-tasks";

describe.concurrent("Core", () => {
  it("should display correct working status", () => {
    const runner = createRunner({
      autoStart: true,
    });
    expect(runner.busy).true;

    runner.removeAll();

    expect(runner.busy).false;

    runner.destroy();
  });

  it("should not update working status if runner is destroyed", () => {
    const runner = createRunner({
      autoStart: true,
    });

    expect(runner.busy).true;

    runner.destroy();
    runner.addMultiple(generateTasks(10));

    expect(runner.busy).false;
  });

  it("should print the correct duration on end", () =>
    new Promise<void>((done) => {
      // vitest.setSystemTime(0);
      const runner = createRunner({
        autoStart: true,
      });

      vitest.useFakeTimers({
        now: 0,
        shouldAdvanceTime: true,
        toFake: ["setTimeout"],
      });

      runner.listen(RunnerEvents.END, ({ duration }) => {
        expect(duration.total).eq(0);
        done();

        runner.destroy();
      });
      runner.start();

      vitest.clearAllTimers();
    }).catch(console.error));

  describe("start", () => {
    it("should return `false` if runner is already working", () => {
      const runner = createRunner({
        autoStart: true,
      });

      expect(runner.start()).false;

      runner.destroy();
    });

    it("should return `false` if runner is destroyed", () => {
      const runner = createRunner({
        autoStart: true,
      });

      runner.destroy();

      expect(runner.start()).false;
    });

    it("should return `true` if it is able to start", () => {
      const runner = createRunner();

      expect(runner.start()).true;

      runner.destroy();
    });
  });

  describe("remove", () => {
    it("should return the task if a valid id is provided", () => {
      const runner = createRunner();

      expect(runner.remove(runner.taskList[0].id)).not.undefined;

      runner.destroy();
    });

    it("should not return anything if a valid id is not provided", () => {
      const runner = createRunner();

      expect(runner.remove(-1)).undefined;

      runner.destroy();
    });
  });
});
