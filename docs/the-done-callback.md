---
description: Remember Gulp?
---

# 🏁 The Done Callback

### Problem

In JavaScript, it gets very difficult for tasks to talk to each other. A lot of times, we need to maintain a map of running tasks and call a function which will update the value and call the next task. 

Concurrent Tasks is a JavaScript module, which runs multiple tasks in parallel until all the tasks are complete. It needs a way to figure out when a particular task has been completed. 

### Solution

Gulp solves this problem by either accepting a return of a Gulp task, or by calling a function `done`. Similarly, to solve the exact same problem, each task passed to the `TaskRunner` has access to a special function called `done` \(ingenuity max\). 

### Purpose

The purpose of this function is simple: Tell the instance when a particular task is complete!

Internally, the done function does a fair amount of work. It:

* Makes a free slot available for the internal runner.
* Updates completion counts and calls the internal runner.
* Updates the time elapsed from start, until the function calling `done`'s completion.
* Calls the internal runner to pick up the next task in the priority queue.

### Examples

It's a very simplistic approach, which can be used across anything. Be it functions, Promises, timeouts etc. 

Below are a few common ways of using the `done` callback:

#### In a regular function

```javascript
import TaskRunner from 'concurrent-tasks';

const runner = new TaskRunner();

function randomNumbers(done) {
    const numbers = [];
    let count = 1000;
    while(count) {
        numbers.push(Math.round(Math.random() * 100));
        count--;
    }
    done();
}

runner.add(randomNumbers);
```

#### In a Promise

```javascript
import TaskRunner from 'concurrent-tasks';

const runner = new TaskRunner();

function getGoogle(done) {
    fetch('http://www.google.com')
        .then(data => {
            console.log('data', data);
            done();
        })
        .catch(error => {
            console.log('error', error);
            done();
            runner.add(getGoogle); // retry fetching data
        });
}

runner.add(getGoogle);
```

#### In a timeout

```javascript
import TaskRunner from 'concurrent-tasks';

const runner = new TaskRunner();

function afterTimeout(done) {
    const timeout = Math.floor(Math.random() * 1000);
    setTimeout(() => {
        console.log(`This resolved after ${timeout}ms`);
        done();
    }, timeout);
}

runner.add(afterTimeout);
```

