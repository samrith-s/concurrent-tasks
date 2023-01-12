type IUtil = (item: any) => boolean;

export const isFunction: IUtil = (item) => typeof item === "function";
export const isNumber: IUtil = (item) => typeof item === "number" && !isNaN(item);
export const isString: IUtil = (item) => typeof item === "string";
export const isArray: IUtil = (item) => item.constructor === Array;
export const isEmptyString: IUtil = (item) => isString(item) && !item;

export const assignFunction = (item: any): typeof item => {
  if (isFunction(item)) {
    return item;
  }
};

export const assignNumber = (number: number, defaultNumber: number, listLength: number): number => {
  if (isNumber(number)) {
    if (number === 0 || number === Infinity) {
      return listLength;
    }

    return number;
  }

  return defaultNumber;
};
