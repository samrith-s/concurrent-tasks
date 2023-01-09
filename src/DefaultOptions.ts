"use strict";

import { RunnerOptions } from "./Interface";

export function DefaultOptions<T>(name: string) {
  return {
    concurrency: 3,
    autoStart: false,
    name,
    onAdd: undefined,
    onStart: undefined,
    onRun: undefined,
    onDone: undefined,
    onEnd: undefined,
    onRemove: undefined,
  } as unknown as RunnerOptions<T>;
}
