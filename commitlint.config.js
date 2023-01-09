/* eslint-disable no-undef */
/**
 * @type {import('@commitlint/types').UserConfig}
 */
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", ["feat", "fix", "refactor", "deps", "docs", "test", "chore"]],
    "scope-enum": [2, "always", ["core", "interface", "runner", "utils", "options", "logs"]],
  },
};
