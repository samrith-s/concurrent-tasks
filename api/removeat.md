# removeAt

* Remove a task at a particular index from the task list.
* Returns the removed `task` upon successful removal.

{% hint style="warning" %}
A task already in execution will not be removed.
{% endhint %}

### Structure

```javascript
removeAt(index: Number)
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

runner.removeAt(2); // removes Task 3
```

