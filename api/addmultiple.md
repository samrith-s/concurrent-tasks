# addMultiple

* Add an array of tasks to the task list. 
* Requires an array of functions which call the `done` callback upon completion. 
* The tasks are picked up by the task runner in the order in which they were added. 
* By default adds to the end of the task list. 
* Returns `true` upon successful addition. 

### Structure

```javascript
addMultiple(tasks: Array.Function, [first: Boolean])
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

runner.addMultiple(generateTasks());
```

### Further Reading

{% hint style="info" %}
Accepts an additional parameter called `first` as a `boolean`flag. Setting it as `true` will add the tasks to the top of the task list.

See: [`addMultipleFirst`](addmultiplefirst.md)\`\`
{% endhint %}

{% hint style="warning" %}
All created instances have `autoStart` enabled by default. This means, as soon as you add tasks to your instance, it will start executing it.
{% endhint %}

