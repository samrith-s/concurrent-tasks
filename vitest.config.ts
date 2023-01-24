import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      provider: "c8",
      reportsDirectory: "./tests/coverage",
      include: ["src/*"],
      cleanOnRerun: true,
      clean: true,
      all: true,
      perFile: true,
      branches: 90,
      statements: 90,
      functions: 90,
      lines: 90,
    },
    reporters: ["dot", "html"],
  },
});
