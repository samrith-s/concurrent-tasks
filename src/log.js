const logs = {
    already_running: 'Cannot start ConcurrentTasks as it is already running!',
    auto_start_true:
        'Cannot programmatically start ConcurrentTasks as autoStart is true!'
};

export default logKey => console.warn(`ConcurrentTasks: ${logs[logKey]}`);
