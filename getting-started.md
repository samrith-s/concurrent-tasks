---
description: >-
  Getting started with Concurrent Tasks is super easy. The practically
  nomenclature and the simplicity of it's API is what drives it.
---

# 🎬 Getting Started

## Installation

You can install via NPM

```bash
npm install concurrent-tasks
```

Or you can simple add add it via a script tag

```markup
<script src="https://unpkg.com/concurrent-tasks/umd/concurrent-tasks.min.js" type="text/javascript"></script>
```

## Usage

The below code should give you an idea of how simple it is to really start a task runner.

Some background: We are pushing a 1000 tasks to our `runner` which is an instance of the `TaskRunner` provided by Concurrent Tasks. Each "task" will resolve at a random time.

```javascript
import TaskRunner from 'concurrent-tasks';

const runner = new TaskRunner();

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

runner.addMultiple(generateTasks());
```

Thats it!

You will notice we have used [`addMultiple`](api/addmultiple.md) here, which is an in-built method that lets us add multiple tasks to our task runner.

