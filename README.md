# Concurrent Tasks
A simple task runner which will run all tasks till completion, while maintaining concurrency limits.

This branch is for the current rewrite of the package from ground up in TypeScript and featuring three packages:
- `@concurrent-tasks/core`: the current form of the package, which is environment agnostic.
- `@concurrent-tasks/node`: specifically for NodeJS, leveraging [Worker Threads](https://nodejs.org/api/worker_threads.html).
- `@concurrent-tasks/browser`: specifically for the browser, leveraging [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).

Each package will ship with proper types to leverage auto-completion and awareness.

Note: I hope to be able to release these within this year, but there is currently no timeline for the release. 
