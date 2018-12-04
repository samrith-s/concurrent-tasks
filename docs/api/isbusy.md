# isBusy

* Get the current state of the instance \(idle or busy\).
* Returns `true` if the instance is processing tasks.

### Structure

```javascript
isBusy()
```

### Example

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

runner.addMultipleFirst(generateTasks());
runner.isBusy() // returns true
```

