# addFirst

* Adds a task to the beginning of the task list.
* Requires a function which calls the `done` callback upon completion. 
* The task inserted, will be executed as soon as any tasks currently being executed are done. 
* Returns `true` upon successful addition.

### Structure

```javascript
addFirst(task: Function, [first: Boolean])
```

### Example

```javascript
import TaskRunner from 'concurrent-tasks';

const runner = new TaskRunner();
runner.addFirst(done => setTimeout(() => done(), 2000));
```

### Further Reading

{% hint style="info" %}
Uses `add` internally with a flag. You can use `add` directly with an optional argument called `first` which when set to `true` adds the task to the top of the list.

See: [`add`](add.md)\`\`
{% endhint %}

{% hint style="warning" %}
All created instances have `autoStart` enabled by default. This means, as soon as you add a task to your instance, it will start executing it.
{% endhint %}

