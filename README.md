# Concurrent Tasks

> **Note 🚨**
> This branch contains the `v2` version of the package. For docs and details on `v1`, visit the [old branch](https://github.com/samrith-s/concurrent-tasks/tree/v1) or [the website](https://concurrent-tasks.js.org).

A simple task runner which will run all tasks till completion, while maintaining concurrency limits.

This branch is for the current rewrite (`v2`) of the package from ground up in TypeScript and featuring three packages:

-   [`@concurrent-tasks/core`][core] (status: basic): the current form of the package, which is environment agnostic.
-   [`@concurrent-tasks/node`][node] (status: not-started): specifically for NodeJS, leveraging [Worker Threads](https://nodejs.org/api/worker_threads.html).
-   [`@concurrent-tasks/browser`][browser] (status: not-started): specifically for the browser, leveraging [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).

Each package will ship with proper types to leverage auto-completion and awareness. _The `core` package **can be tried out** but please be aware it is **NOT** meant for production use as it is still in early alpha._

[core]: https://www.npmjs.com/package/@concurrent-tasks/core
[node]: https://www.npmjs.com/package/@concurrent-tasks/node
[browser]: https://www.npmjs.com/package/@concurrent-tasks/browser
