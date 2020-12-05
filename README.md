# Concurrent Tasks

[![npm (scoped with tag)](https://img.shields.io/npm/v/@concurrent-tasks/core/next)][core] [![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@concurrent-tasks/core?label=%40concurrent-tasks%2Fcore)][core]

> **Note 🚨**
> This branch contains the `v2` version of the package which is still in active development. For docs and details on `v1`, visit the [old branch](https://github.com/samrith-s/concurrent-tasks/tree/v1) or [the website](https://concurrent-tasks.js.org).

A simple task runner which will run all tasks till completion, while maintaining concurrency limits.

This branch is for the current rewrite (`v2`) of the package from ground up in TypeScript and featuring a more modular structure.

## Task runners

-   [`@concurrent-tasks/core`][core] (status: implemented): Allows you to create, manage and execute a task runner in virtually any environment or flavour of JavaScript.

## Strategies

-   [`@concurrent-tasks/strategy-sync`][strategy-sync] (status: implemented): A simple strategy which accepts a promise and moves on to the next task automatically when a Promise resoves itself.

_The `core` package **can be tried out** but please be aware it is still in `beta` and is considered more-or-less stable. Useage in production environment is discouraged._

If you are keen on contributing to the development of this package, please feel free to create a PR.

Alternatively, if you have created an independent pacakge which implements a strategy, please do not hesitate to create a PR which adds it to the README.

The guides on implementing strategies are currently being written. You can check out the [`strategies/strategy-sync`](#) for an example.

[core]: https://www.npmjs.com/package/@concurrent-tasks/core
[universal]: https://www.npmjs.com/package/@concurrent-tasks/universal
[node]: https://www.npmjs.com/package/@concurrent-tasks/node
[browser]: https://www.npmjs.com/package/@concurrent-tasks/browser
