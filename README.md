# Concurrent Tasks

[![npm (scoped with tag)](https://img.shields.io/npm/v/@concurrent-tasks/core/next)][core] [![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@concurrent-tasks/core?label=%40concurrent-tasks%2Fcore)][core] [![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@concurrent-tasks/universal?label=%40concurrent-tasks%2Funiversal)][universal] [![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@concurrent-tasks/node?label=%40concurrent-tasks%2Fnode)][node] [![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@concurrent-tasks/browser?label=%40concurrent-tasks%2Fbrowser)][node]

> **Note 🚨**
> This branch contains the `v2` version of the package which is still in active development. For docs and details on `v1`, visit the [old branch](https://github.com/samrith-s/concurrent-tasks/tree/v1) or [the website](https://concurrent-tasks.js.org).

A simple task runner which will run all tasks till completion, while maintaining concurrency limits.

This branch is for the current rewrite (`v2`) of the package from ground up in TypeScript and featuring four packages:

-   [`@concurrent-tasks/core`][core] (status: basic): the current form of the package, recreated in a modular way to enable passing custom strategies.
-   [`@concurrent-tasks/universal`][universal] (status: basic): environment agnostic strategy which can be used with any JS flavor.
-   [`@concurrent-tasks/node`][node] (status: not-started): specifically for NodeJS, leveraging [Worker Threads](https://nodejs.org/api/worker_threads.html).
-   [`@concurrent-tasks/browser`][browser] (status: not-started): specifically for the browser, leveraging [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).

Each package will ship with proper types to leverage auto-completion and awareness. _The `core` package **can be tried out** but please be aware it is **NOT** meant for production use as it is still in early alpha._

[core]: https://www.npmjs.com/package/@concurrent-tasks/core
[universal]: https://www.npmjs.com/package/@concurrent-tasks/universal
[node]: https://www.npmjs.com/package/@concurrent-tasks/node
[browser]: https://www.npmjs.com/package/@concurrent-tasks/browser
