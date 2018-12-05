---
description: >-
  A simple task runner which will run tasks in parallel while maintaining
  limits.
---

# 👶🏻 Introduction

## What does it do?

**Concurrent Tasks** mimics a priority queue by using JavaScript's inbuilt array data type. Each task is a function which signals completion back to the `TaskRunner`. Once tasks are added, the instance starts executing them until the [concurrency](configuration.md#concurrency) criteria is met. Once even a single task is complete \(it calls the `done` callback\), the next task in the queue is picked up.

The `concurrency` setting means the `TaskRunner` can execute a batch of tasks. The number of tasks that is can execute are called slots. Once a task fires the `done` callback, the instance picks up the next task. This way, the instance maintains a batch size of whatever the value of `concurrency` is.

## Why another task runner?

While writing fragments or a priority queue in JavaScript, we often come across quite a few hurdles. There's either no real native option, or one needs to write a lot of code to get the desired results. **Concurrent Tasks** aims to solve this by providing a simplistic queue. The queue not only maintains the order, but also enables you to manipulate it and according to your liking. 

## What can I use it with?

The minimalism of **Concurrent Tasks** makes it an easy-to-use solution across any framework or flavour of JavaScript. It has **ZERO** dependencies and can be used virtually in any scenario.

* Vanilla JavaScript
* Frontend Frameworks \(React, Vue, Angular, etc\)
* Backend Frameworks \(Express, Hapi, Koa, etc\)
* NPM Module
* Node CLI Application

