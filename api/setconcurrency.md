# setConcurrency

* Set the concurrency limit on an already-running or a idle instance.
* Concurrency has to be a positive whole number.
* You can set `0` to run all tasks in the task list at one go.

### Structure

```javascript
setConcurrency(concurrency: Number)
```

### Example

```javascript
import TaskRunner from 'concurrent-tasks';

const runner = new TaskRunner();
runner.setConcurrency(10);
```

### Further Reading

{% hint style="info" %}
Increasing the concurrency will make the task runner fill up all remaining slots with tasks from the task list. Decreasing the concurrency will not stop executions of any currently executing.
{% endhint %}

