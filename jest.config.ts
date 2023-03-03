import type { JestConfigWithTsJest } from "ts-jest";

const config: JestConfigWithTsJest = {
  preset: "ts-jest",
  testEnvironment: "node",
  setupFilesAfterEnv: ["./tests/setup/test.setup.ts"],
  coveragePathIgnorePatterns: ["src/Namespace.ts", "tests/*"],
  coverageThreshold: {
    global: {
      branches: 95,
      statements: 95,
      functions: 95,
      lines: 95,
    },
  },
};

export default config;
