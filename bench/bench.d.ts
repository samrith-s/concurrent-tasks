/* eslint-disable no-var */
declare global {
  declare var benchConfig: {
    taskCount?: number;
    timeout?: number;
  };

  declare type BenchmarkResult = {
    Duration: string;
    CPU: string;
  };

  declare type BenchmarkResults = Record<string, BenchmarkResult>;

  declare var results = {} as {
    add: (name: string, result: BenchmarkResult) => void;
    delete(name: string): void;
    print(): void;
  };
}

export {};
