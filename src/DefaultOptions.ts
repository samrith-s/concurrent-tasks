"use strict";

import { RunnerOptions } from "./Interface";

export function DefaultOptions<T>(name: string) {
  return {
    name,
    concurrency: 3,
    onAdd: undefined,
    onStart: undefined,
    onRun: undefined,
    onDone: undefined,
    onEnd: undefined,
    onRemove: undefined,
  } as unknown as RunnerOptions<T>;
}
