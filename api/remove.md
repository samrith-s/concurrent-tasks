# remove

* Remove the a task from the task list. 
* By default removes the task at the bottom of the list.
* Returns the removed `task` upon successful removal. 

{% hint style="warning" %}
A task already in execution will be removed.
{% endhint %}

### Structure

```javascript
remove([first: Boolean])
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

runner.remove(); // removes Task 5
```

### Further Reading

{% hint style="info" %}
Accepts an optional parameter called `first` as a `boolean`flag. Setting it as `true` will remove the task at the top of the task list.

See: [removeFirst](removefirst.md)
{% endhint %}

