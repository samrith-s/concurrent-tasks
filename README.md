# 🏃‍♀️ Concurrent Tasks

[![npm][npm_v]][npm_package]
[![size][size_img]][size]
[![npm][npm_dw]][npm_package]
[![GitHub issues][gh_issues]][github_issues]
[![GitHub forks][gh_forks]][github_forks]
[![GitHub stars][gh_stars]][github_stars]

A simple task runner which will run all tasks till completion, while maintaining concurrency limits.

> Read the full documentation at the [website][website]

# 👋🏼 Introduction

Concurrent Tasks mimics a queue by using JavaScript's inbuilt array data type. Each task is a function which signals completion back to the runner.

The minimalism of Concurrent Tasks makes it an easy-to-use solution across any framework or flavour of JavaScript. It has **ZERO dependencies** and can be used virtually in any scenario. With a **minified and gzipped size of 2.7kB**, it is the ultimate lightweight tool for your concurrency needs.

- [x] Vanilla JavaScript
- [x] Frontend Frameworks (React, Vue, Angular, etc)
- [x] Backend Frameworks (Express, Hapi, Koa, etc)
- [x] NPM Module
- [x] Node CLI Application

### Browser

```html
<script
  src="https://cdn.jsdelivr.net/npm/concurrent-tasks/umd/concurrent-tasks.min.js"
  type="text/javascript"
></script>
```

### Bun

```bash
bun install concurrent-tasks
```

### Deno

```ts
import { TaskRunner } from "https://cdn.jsdelivr.net/npm/concurrent-tasks/src/index.ts";
```

### Usage

> **Important:** Each task passed to the task runner, necessarily has to call the done function. If not, your queue won't process properly.

```typescript
import TaskRunner from "concurrent-tasks";

const runner = new TaskRunner();

function generateTasks() {
  const tasks = [];
  let count = 1000;
  while (count) {
    tasks.push((done) => {
      setTimeout(() => {
        done();
      }, Math.random() * 1000);
    });
    count--;
  }
  return tasks;
}

runner.addMultiple(generateTasks());

runner.start();
```

[website]: https://concurrent-tasks.js.org
[size]: https://bundlephobia.com/result?p=concurrent-tasks
[size_img]: https://badgen.net/bundlephobia/minzip/concurrent-tasks
[npm_package]: https://www.npmjs.com/package/concurrent-tasks
[npm_v]: https://img.shields.io/npm/v/concurrent-tasks.svg
[npm_dw]: https://img.shields.io/npm/dw/concurrent-tasks.svg
[github_issues]: https://github.com/samrith-s/concurrent-tasks/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc
[github_forks]: https://github.com/samrith-s/concurrent-tasks/network/members
[github_stars]: https://github.com/samrith-s/concurrent-tasks/stargazers
[gh_issues]: https://img.shields.io/github/issues/samrith-s/concurrent-tasks.svg
[gh_forks]: https://img.shields.io/github/forks/samrith-s/concurrent-tasks.svg?label=Fork&style=social
[gh_stars]: https://img.shields.io/github/stars/samrith-s/concurrent-tasks.svg?label=Stars&style=social
