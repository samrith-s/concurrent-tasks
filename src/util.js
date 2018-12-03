export const isFunction = item => typeof item === 'function';
export const isNumber = item => typeof item === 'number' && !isNaN(item);
export const isString = item => typeof item === 'string';
export const isArray = item => item.constructor === Array;
export const isEmptyString = item => isString(item) && !item;

export const assignFunction = item => {
    if (isFunction(item)) {
        return item;
    }
};

export const assignNumber = (number, defaultNumber, listLength) => {
    if (isNumber(number)) {
        if (number === 0) {
            return listLength;
        }

        return number;
    }

    return defaultNumber;
};
