export const getElements = id => {
    const element = document.getElementById('example-1');
    const button = element.querySelector('.btn');
    const console = element.querySelector('.console');
    const start = console.querySelector('.console__on-start');
    const done = console.querySelector('.console__on-done');
    const end = console.querySelector('.console__on-end');

    return {
        element,
        console: {
            console,
            start,
            done,
            end
        },
        button
    };
};
