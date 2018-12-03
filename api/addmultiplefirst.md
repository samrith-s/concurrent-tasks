# addMultipleFirst

* Add an collection of tasks to the beginning task list. 
* Requires a function which calls the `done` callback upon completion. 
* The tasks are picked up by the task runner in the order in which they were added. 
* Returns `true` upon successful addition.

### Structure

```javascript
addMultipleFirst(tasks: Array.Function)
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
runner.addMultipleFirst(generateTasks());
```

### Further Reading

{% hint style="info" %}
Uses `addMultiple` internally with a flag. You can use `addMultiple` directly with an optional argument called `first` which when set to `true` adds the task to the top of the list. 

See: [`addMultiple`](addmultiple.md)\`\`
{% endhint %}

{% hint style="warning" %}
All created instances have `autoStart` enabled by default. This means, as soon as you add tasks to your instance, it will start executing it.
{% endhint %}

