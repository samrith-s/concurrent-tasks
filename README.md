<p align="center">
  <img src="https://raw.githubusercontent.com/samrith-s/concurrent-tasks/main/docs/public/logo.svg" alt="Concurrent Tasks logo" height="64"  />
</p>

<h1 align="center">Concurrent Tasks</h1>

<p align="center">
  <a href="https://www.npmjs.com/package/concurrent-tasks" style="text-decoration:none">
    <img src="https://img.shields.io/npm/v/concurrent-tasks.svg">
  </a>
  <a href="https://www.npmjs.com/package/concurrent-tasks" style="text-decoration:none">
    <img src="https://img.shields.io/npm/dw/concurrent-tasks.svg">
  </a>
  <a href="https://bundlephobia.com/result?p=concurrent-tasks" style="text-decoration:none">
    <img src="https://badgen.net/bundlephobia/minzip/concurrent-tasks" />
  </a>
  <a href="https://github.com/samrith-s/concurrent-tasks/stargazers" style="text-decoration:none">
    <img src="https://img.shields.io/github/stars/samrith-s/concurrent-tasks.svg?label=Stars&style=social" />
  </a>
</p>

<p align="center">
A simple task runner which will run all tasks till completion, while maintaining concurrency limits.
</p>

<p align="center">
Read the full documentation at the <a href="https://www.concurrent-tasks.js.org">website</a>
</p>

---

# Introduction

Concurrent Tasks mimics a queue by using JavaScript's inbuilt array data type. Each task is a function which signals completion back to the runner.

The minimalism of Concurrent Tasks makes it an easy-to-use solution across any framework or flavour of JavaScript. It has **ZERO dependencies** and can be used virtually in any scenario. With a **minified and gzipped size of 2.7kB**, it is the ultimate lightweight tool for your concurrency needs.

- [x] Vanilla JavaScript
- [x] Frontend Frameworks (React, Vue, Angular, etc)
- [x] Backend Frameworks (Express, Hapi, Koa, etc)
- [x] NPM Module
- [x] Node CLI Application

# Installation

### Node

```bash
# NPM
npm i concurrent-tasks

# Yarn
yarn add concurrent-tasks

# PNPM
pnpm i concurrent-tasks
```

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

# Usage

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
