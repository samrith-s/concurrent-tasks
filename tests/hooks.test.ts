import { expect } from "chai";

import { createHook } from "./utils/create-hook";
import { createRunner } from "./utils/create-runner";
import { generateTask, generateTasks } from "./utils/generate-tasks";

describe("Hooks", () => {
  it("should call `onStart` event when provided", () => {
    const onStart = createHook("onStart");
    const runner = createRunner({ onStart: onStart.fn });

    runner.start();

    expect(onStart.callCount).eq(1);
  });

  it("should call `onAdd` event when provided", () => {
    const onAdd = createHook("onAdd");
    const runner = createRunner({ onAdd: onAdd.fn, taskCount: 0 });

    expect(onAdd.callCount).eq(0);

    runner.addMultiple(generateTasks(10));

    expect(onAdd.callCount).eq(10);

    runner.add(generateTask());

    expect(onAdd.callCount).eq(11);
  });
});
