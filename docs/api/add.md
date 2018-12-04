# add

* Adds a task to the task list. 
* Requires a function which calls the `done` callback upon completion. 
* Returns `true` upon successful addition.

### Structure

```javascript
add(task: Function, [first: Boolean])
```

### Example

```javascript
import TaskRunner from 'concurrent-tasks';

const runner = new TaskRunner();
runner.add(done => setTimeout(() => done(), 2000));
```

### Further Reading

{% hint style="info" %}
Accepts an additional parameter called `first` as a `boolean`flag. Setting it as `true` will add the task to the top of the task list.

See: [`addFirst`](addfirst.md)\`\`
{% endhint %}

{% hint style="warning" %}
All created instances have `autoStart` enabled by default. This means, as soon as you add a task to your instance, it will start executing it.
{% endhint %}

