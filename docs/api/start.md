# start

* Programmatically start processing the first batch of tasks from the task list.
* Fires `onStart`, `onDone` and `onEnd` as per usual.

### Structure

```javascript
start()
```

### Example

```javascript
import TaskRunner from 'concurrent-tasks';

const runner = new TaskRunner({
    autoStart: false
});

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
runner.start() /// Starts processing the first batch of tasks
```

### Further Reading

{% hint style="warning" %}
The `start` method cannot be called on an instance which has `autoStop` set to `true`. To programmatically start processing a task list, while generating the instance, you should set `autoStart` to `false`.

See: [Config &gt; `autoStart`](../configuration.md#autostart)\`\`
{% endhint %}

