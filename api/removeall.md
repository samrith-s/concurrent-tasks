# removeAll

* Removes all tasks in the task list. 
* Returns the `tasks.list` value which was set to a new empty array.

{% hint style="warning" %}
Tasks already in execution will not be removed.
{% endhint %}

### Structure

```javascript
removeAll()
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

runner.removeAll(); // removes all tasks
```

