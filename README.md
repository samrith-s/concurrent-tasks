# <img src="https://raw.githubusercontent.com/samrith-s/concurrent-tasks/master/icons/icon-x64.png" style="vertical-align: middle"> Concurrent Tasks

[![npm][npm_v]][npm_package]
[![size][size_img]][size]
[![npm][npm_dw]][npm_package]
[![GitHub issues][gh_issues]][github_issues]
[![GitHub forks][gh_forks]][github_forks]
[![GitHub stars][gh_stars]][github_stars]

A simple task runner which will run all tasks till completion, while maintaining concurrency limits.

The following is a quick reference guide to help you get friendly with **Concurrent Tasks**. Visit [the website][website] for a detailed documentation.

# Table of Contents

- [👋🏼 Introduction](#introduction)
- [🎬 Getting Started](#getting-started)
- [🏁 The Done Callback](#the-done-callback)
- [⚒ Configuration](#configuration)
- [🕹 API](#api)
  - [add](#api-add)
  - [addFirst](#api-add-first)
  - [addMultiple](#api-add-multiple)
  - [addMultipleFirst](#api-add-multiple-first)
  - [remove](#api-remove)
  - [removeRange](#api-remove-range)
  - [removeAt](#api-remove-at)
  - [removeAll](#api-remove-all)
  - [start](#api-start)
  - [setConcurrency](#api-set-concurrency)
  - [isBusy](#api-is-busy)
- [💪🏼 Powered by Concurrent Tasks](#powered-by-concurrent-tasks)
- [👩🏻‍💻 Contributing](#contributing)
- [🧐 Issues](#issues)
- [🗺 Roadmap](#roadmap)
- [🔑 License](#license)

# 👋🏼 Introduction <a name="introduction"></a>

Concurrent Tasks mimics a priority queue by using JavaScript's inbuilt array data type. Each task is a function which signals completion back to the `TaskRunner`. Once tasks are added, the instance starts executing them until the concurrency criteria is met. Once even a single task is complete (it calls the `done` callback), the next task in the queue is picked up.

### What can I use it with?

The minimalism of Concurrent Tasks makes it an easy-to-use solution across any framework or flavour of JavaScript. It has ZERO dependencies and can be used virtually in any scenario.

- ✅ Vanilla JavaScript
- ✅ Frontend Frameworks (React, Vue, Angular, etc)
- ✅ Backend Frameworks (Express, Hapi, Koa, etc)
- ✅ NPM Module
- ✅ Node CLI Application

# 🎬 Getting Started <a name="getting-started"></a>

Via NPM

```
npm install concurrent-tasks
```

Or the script tag

```
<script src="https://cdn.jsdelivr.net/npm/concurrent-tasks/umd/concurrent-tasks.min.jss" type="text/javascript"></script>
```

### Usage

```javascript
import TaskRunner from 'concurrent-tasks';
​
const runner = new TaskRunner();
​
function generateTasks() {
    const tasks = [];
    let count = 1000;
    while(count) {
        tasks.push(done => {
            setTimeout(() => {
                done();
            }, Math.random() * 1000)
        });
        count--;
    }
    return tasks;
}
​
runner.addMultiple(generateTasks());
```

**Important:** Each task passed to the task runner, necessarily has to call the done function. If not, your queue won't process properly.

# 🏁 The Done Callback <a name="the-done-callback"></a>

In JavaScript, it gets very difficult for tasks to talk to each other. A lot of times, we need to maintain a map of running tasks and call a function which will update the value and call the next task.

**Concurrent Tasks** is a JavaScript module, which runs multiple tasks concurrently until all the tasks are complete. It needs a way to figure out when a particular task has been completed.

### Solution

Gulp solves this problem by either accepting a return of a Gulp task, or by calling a function done. Similarly, to solve the exact same problem, each task passed to the TaskRunner has access to a special function called done (ingenuity max).

### Purpose

The purpose of this function is simple: Tell the instance when a particular task is complete! Internally, the done function does a fair amount of work. It:

- Makes a free slot available for the internal runner.
- Updates completion counts and calls the internal runner.
- Updates the time elapsed from start, until the function calling `done`'s completion.
- Calls the internal runner to pick up the next task in the priority queue.

### Examples

For some examples on how you can use the callback, head over to the [docs](https://concurrent-tasks.js.org/the-done-callback#examples).

# ⚒ Configuration <a name="configuration"></a>

| Property    | Type       | Default                   | Description                                                  |
| ----------- | ---------- | ------------------------- | ------------------------------------------------------------ |
| concurrency | `Number`   | `3`                       | Set the batch size of the task runner.                       |
| autoStart   | `Boolean`  | `true`                    | Decides whether to start executing tasks automatically.      |
| name        | `String`   | `Runner <instance-count>` | A unique name to identify the `TaskRunner` instance.         |
| onAdd       | `Function` | `undefined`               | Fired every time `add` is called.                            |
| onStart     | `Function` | `undefined`               | Fired every time the runner goes from idle to working state. |
| onDone      | `Function` | `undefined`               | Fired each time a task calls `done` callback.                |
| onEnd       | `Function` | `undefined`               | Fired every time the runner goes from working to idle state. |

# 🕹 API <a name="api"></a>

The following methods are provided by **Concurrent Tasks** to help you in manipulating your task list and get the most out of the module.

### add <a name="api-add"></a>

Adds a task to the task list.

```javascript
add(task: Function, [first: Boolean])
```

### addFirst <a name="api-add-first"></a>

Adds a task to the beginning of the task list.

```javascript
addFirst(task: Function, [first: Boolean])
```

### addMultiple <a name="api-add-multiple"></a>

Adds a collection of tasks to the task list.

```javascript
addMultiple(tasks: Array.Function, [first: Boolean])
```

### addMultipleFirst <a name="api-add-multiple-first"></a>

Adds a collection of tasks to the beginning task list.

```javascript
addMultipleFirst(tasks: Array.Function)
```

### remove <a name="api-remove"></a>

Remove a task from the task list.

```javascript
remove([first: Boolean])
```

### removeFirst <a name="api-remove-first"></a>

Remove the first task from the task list.

```javascript
removeFirst();
```

### removeAt <a name="api-remove-at"></a>

Remove a task at a particular index from the task list.

```javascript
removeAt(index: Number)
```

### removeAll <a name="api-remove-all"></a>

Removes all tasks in the task list.

```javascript
removeAll();
```

### start <a name="api-start"></a>

Programmatically start processing the first batch of tasks from the task list.

```javascript
start();
```

### setConcurrency <a name="api-set-concurrency"></a>

Set the concurrency limit on an already-running or a idle instance.

```javascript
setConcurrency(concurrency: Number)
```

### isBusy <a name="api-is-busy"></a>

Get the current state of the instance (idle or busy).

```javascript
isBusy();
```

# 💪🏼 Powered by Concurrent Tasks <a name="powered-by-concurrent-tasks"></a>

If you'd like to showcase any:

- Website
- Package
- Framework
- API

That's been powered by **Concurrent Tasks**, you can get in touch on [Twitter](https://twitter.com/tueieo) or just use [#poweredByConcurrentTasks](https://twitter.com/search?f=tweets&q=%23poweredByConcurrentTasks&src=typd) and it'll be featured here!

# 👩🏻‍💻 Contributing <a name="contributing"></a>

We ❤️ contributions! We are looking for people who echo our sentiments and share the same idea about **Concurrent Tasks**. Check out the [contributing guidelines](https://github.com/samrith-s/concurrent-tasks/blob/master/CONTRIBUTING.md).

# 🧐 Issues <a name="issues"></a>

For any issues or queries you might have about the table, please feel free to create one in the [issues section](https://github.com/samrith-s/concurrent-tasks/issues?q=is%3Aissue+is%3Aopen+sort%3Aupdated-desc).

# 🗺 Roadmap <a name="roadmap"></a>

- ✅ Custom concurrency.
- ✅ Events for task addition, idle state change, `done` callback firing.
- ✅ Programmatic and automatic start.
- ✅ Different kinds of addition and removal.
- ❌ Priority value for each task.
- ❌ Storing tasks as a map of priorities.
- ❌ Adding/removing tasks to/from an existing priority.
- ❌ Adding/removing multiple tasks to/from an existing priority.
- ❌ Adding tasks to a new priority.
- ❌ Adding multiple tasks to a new priority.
- ❌ Removal of a priority.

# 🔑 License <a name="license"></a>

This project is under the [MIT License](https://opensource.org/licenses/MIT). You can checkout the project's [license](https://github.com/samrith-s/concurrent-tasks/blob/master/LICENSE) for more info.

Copyright © 2018.

[website]: https://concurrent-tasks.js.org
[icon]: https://raw.githubusercontent.com/samrith-s/concurrent-tasks/master/icons/icon-x64.png
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
