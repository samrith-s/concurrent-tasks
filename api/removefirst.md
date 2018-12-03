# removeFirst

* Remove the the first task from the task list. 
* Returns the removed `task` upon successful removal. 

{% hint style="warning" %}
A task already in execution will not be removed.
{% endhint %}

### Structure

```javascript
removeFirst()
```

### Example

```javascript
import TaskRunner from 'concurrent-tasks';

const runner = new TaskRunner();

runner.addMultiple([
    done => setTimeout(() => done(), 1000) // Task 1 
    done => setTimeout(() => done(), 2000) // Task 2
    done => setTimeout(() => done(), 3000) // Task 3
    done => setTimeout(() => done(), 4000) // Task 4
    done => setTimeout(() => done(), 5000) // Task 5
]);

runner.removeFirst(); // removes Task 1
```

### Further Reading

{% hint style="info" %}
Uses `remove` internally with a flag. You can use `remove` directly with an optional argument called `first` which when set to `true` removes the task at the top of the list. 

See: [`remove`](removefirst.md)\`\`
{% endhint %}

