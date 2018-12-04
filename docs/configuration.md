---
description: >-
  The list of available configurations which will help you tinker Concurrent
  Tasks to your needs!
---

# ⚒ Configuration

### concurrency

Type: `Number` Default: `3`

* Set the batch size of the task runner. 
* Should be a positive integer.
* Set `0` which translates to `Infinity` to make all the tasks execute in parallel.

### autoStart

Type: `Boolean` Default: `true`

* Decides whether to start executing tasks as soon as the first task/batch of tasks are pushed into the task list.
* If set to `false`, the `start` function cannot be used to programmatically execute the task list.

### name

Type: `String` Default: `Runner <count-of-active-runners>`

* A unique name to identify the `TaskRunner` instance.

### onAdd

Type: `Function` Default: `undefined`

```javascript
import TaskRunner from 'concurrent-tasks';

const runner = new TaskRunner();
runner.onAdd = ({ tasks }) => {
    console.log(tasks);
    /*
     * {
     *   list: Array,
     *   completed: Number,
     *   running: Number,
     *   total: Number
     * }
    */
}
```

* Fired every time a task/tasks are added to the `TaskRunner` instance.
* Provides access to `tasks` property of the instance, via a `props` argument.

### onStart

Type: `Function` Default: `undefined`

```javascript
import TaskRunner from 'concurrent-tasks';

const runner = new TaskRunner();
runner.onStart = ({ duration }) => {
    console.log(duration);
    /*
     * {
     *   start: Date.Integer,
     *   end: Date.Integer,
     *   total: Date.Integer
     * }
    */
}
```

* Fired every time the runner goes from idle to working state.
* Provides access to `duration` property of instance, via a `props` argument.

### onDone

Type: `Function` Default: `undefined`

```javascript
import TaskRunner from 'concurrent-tasks';

const runner = new TaskRunner();
runner.onDone = ({ tasks }) => {
    console.log(tasks);
    /*
     * {
     *   list: Array,
     *   completed: Number,
     *   running: Number,
     *   total: Number
     * }
    */
}
```

* Fired after every task's completion, provided the each individual task call the `done` callback.
* Provides access to the `tasks` property of the instance, via a `props` argument.

{% hint style="danger" %}
Not calling the `done` callback will result in `onDone` never getting fired. This also means that your queue will never proceed if no task in the queue calls the `done` callback.

See: [The Done Callback](the-done-callback.md)
{% endhint %}

### onEnd

Type: `Function` Default: `undefined`

```javascript
import TaskRunner from 'concurrent-tasks';

const runner = new TaskRunner();
runner.onEnd = ({ completed, duration }) => {
    console.log({ completed, duration });
    /*
     * {
     *   completed: Number,
     *   duration: {
     *     start: Date.Integer,
     *     end: Sate.Integer,
     *     total: Date.Integer,
     *   }             
     * }
    */
}
```

* Fired every time the runner goes from working to idle state.
* Provides access to completed tasks and `duration` property of instance, via a `props` argument.

