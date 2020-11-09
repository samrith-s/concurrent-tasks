# @concurrent-tasks/browser

:warning: **This is a package for `v2` of `concurrent-taks`**

---

For docs and details on `v1` visit:

-   [the old branch](https://github.com/samrith-s/concurrent-tasks/tree/v1)
-   [the website](https://concurrent-tasks.js.org)
-   [the NPM package](https://www.npmjs.com/package/concurrent-tasks)
-   [the examples website](https://samrith-s.github.io/concurrent-tasks)

---

![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@concurrent-tasks/core?label=%40concurrent-tasks%2Fcore) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@concurrent-tasks/node?label=%40concurrent-tasks%2Fnode) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@concurrent-tasks/browser?label=%40concurrent-tasks%2Fbrowser) ![tree-shaking](https://badgen.net/bundlephobia/tree-shaking/@concurrent-tasks/core)

This project is a complete rewrite and is still in the early alpha stages. It consists of four packages:

-   [`@concurrent-tasks/core`][core] (status: basic): the current form of the package, recreated in a modular way to enable passing custom strategies.
-   [`@concurrent-tasks/universal`][universal] (status: basic): environment agnostic strategy which can be used with any JS flavor.
-   [`@concurrent-tasks/node`][node] (status: not-started): specifically for NodeJS, leveraging [Worker Threads](https://nodejs.org/api/worker_threads.html).
-   [`@concurrent-tasks/browser`][browser] (status: not-started): specifically for the browser, leveraging [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API).

This package is still a work in progress but **can be tried out in development environments**. If you do use it and find any bugs or would like to suggest features, please [create an issue](https://github.com/samrith-s/concurrent-tasks/issues/).

[core]: https://www.npmjs.com/package/@concurrent-tasks/core
[universal]: https://www.npmjs.com/package/@concurrent-tasks/universal
[node]: https://www.npmjs.com/package/@concurrent-tasks/node
[browser]: https://www.npmjs.com/package/@concurrent-tasks/browser
