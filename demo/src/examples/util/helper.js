export const getElements = id => {
    const element = document.getElementById('example-1');
    const button = element.querySelector('.btn');
    const concurrency = element.querySelector('.concurrency');
    const console = element.querySelector('.console');
    const start = console.querySelector('.console__on-start');
    const done = console.querySelector('.console__on-done');
    const end = console.querySelector('.console__on-end');

    return {
        element,
        concurrency,
        button,
        console: {
            console,
            start,
            done,
            end
        }
    };
};
