---
description: >-
  A simple task runner which will run tasks in parallel, all while maintaining
  limits.
---

# 👶🏻 Introduction

## What does it do?

Concurrent Tasks mimics a priority queue by using JavaScript's in-build array data type. Each task is a function which signals completion back to the `TaskRunner`. Once tasks are added, the instance starts executing them until the [concurrency](configuration.md#concurrency) criteria is met. Once even a single task is complete \(it calls the `done` callback\), the next task in the queue is picked up.

The `concurrency` setting means the `TaskRunner` can execute a batch of tasks. The number of tasks that is can execute are called slots. Once a task fires the `done` callback, the instance picks up the next task. This way, the instance maintains a batch size of whatever the value of `concurrency` is.

## Why another task runner?

While writing page fragments or a priority queue in JavaScript, we often come across some hurdles. It's either no real inbuilt option, or a lot of code to perform a simple task. Concurrent Tasks aims to solve this by providing a simple FIFO queue. The queue not only maintains the order, but also enables you to manipulate it and suit it according to your liking. 

## What can I use it with?

The simplicity of Concurrent Tasks makes it an easy-to-use solution across any framework or flavour of JavaScript. It has **ZERO** dependencies and can be used virtually in any scenario.

* Vanilla JavaScript
* Frontend Frameworks \(React, Vue, Angular, etc\)
* Backend Frameworks \(Express, Hapi, Koa, etc\)
* NPM Module
* Node CLI Application

