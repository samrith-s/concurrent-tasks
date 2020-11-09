# @concurrent-tasks/browser

:warning: **This is a package for `v2` of `concurrent-taks`**

---

For docs and details on `v1` visit:

-   [the old branch](https://github.com/samrith-s/concurrent-tasks/tree/v1)
-   [the website](https://concurrent-tasks.js.org)
-   [the NPM package](https://www.npmjs.com/package/concurrent-tasks)
-   [the examples website](https://samrith-s.github.io/concurrent-tasks)

---

This project is a complete rewrite and is still in the early alpha stages. It consists of three packages:

-   [`@concurrent-tasks/core`][core] (status: basic): the current form of the package, which is environment agnostic.
-   [`@concurrent-tasks/node`][node] (status: not-started): specifically for NodeJS, leveraging [Worker Threads](https://nodejs.org/api/worker_threads.html).
-   [`@concurrent-tasks/browser`][browser] (status: not-started): specifically for the browser, leveraging [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).

This package is just a stub and does nothing (as of now) but you **can try out the `core` package in development environments**. If you do use it and find any bugs or would like to suggest features, please [create an issue](https://github.com/samrith-s/concurrent-tasks/issues/).

[core]: https://www.npmjs.com/package/@concurrent-tasks/core
[node]: https://www.npmjs.com/package/@concurrent-tasks/node
[browser]: https://www.npmjs.com/package/@concurrent-tasks/browser
