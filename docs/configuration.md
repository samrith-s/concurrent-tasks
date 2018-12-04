---
description: >-
  The list of available configurations which will help you adjust Concurrent
  Tasks to suit your needs!
---

# ⚒ Configuration

### concurrency

Type: `Number`

* Set the batch size of the task runner. 
* Should be a positive integer.
* Set `0` which translates to `Infinity` to make all the tasks execute in parallel.

### autoStart

Type: `Boolean` 

* Decides whether to start executing tasks as soon as the first task/batch of tasks are pushed pushed into the task list.
* If set to `false`, the `start` function cannot be used to programmatically execute the task list.

### name

Type: `String` 

* A unique name to identify the `TaskRunner` instance.
* By default, the name is set to `Runner <count of runner instances>`

### onAdd

Type: `Function` 

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

Type: `Function` 

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

Type: `Function` 

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
{% endhint %}

### onEnd

Type: `Function` 

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

