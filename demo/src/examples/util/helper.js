export const getElements = id => {
    const element = document.getElementById(id);
    const progress = element.querySelector('.progress-inner');
    const button = element.querySelector('.btn');
    const concurrency = element.querySelector('.concurrency');
    const input = concurrency.querySelector('input');
    const set = concurrency.querySelector('.set-concurrency');
    const console = element.querySelector('.console');
    const info = console.querySelector('.console__info');
    const start = console.querySelector('.console__on-start');
    const done = console.querySelector('.console__on-done');
    const end = console.querySelector('.console__on-end');

    return {
        element,
        progress,
        concurrency: {
            input,
            set
        },
        button,
        console: {
            console,
            info,
            start,
            done,
            end
        }
    };
};
