export const isFunction = item => typeof item === 'function';
export const isNumber = item => typeof item === 'number';
export const isArray = item => item.constructor === Array;

export const assignFunction = item => {
    if (isFunction(item)) {
        return item;
    }
};
