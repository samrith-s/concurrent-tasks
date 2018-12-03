const logs = {
    already_running:
        'Cannot start TaskRunner instance as it is already running!',
    auto_start_true:
        'Cannot programmatically start TaskRunner instance as autoStart is true!',
    add_requires_function:
        'The "add" operation requires a function. Check if the first argument is a function!',
    add_multiple_requires_array_of_functions:
        'The "addMultiple" operation requires an array of functions. Check if the first argument is an array and whether all the items in the array are functions!'
};

export default logKey => `TaskRunner: ${logs[logKey]}`;
