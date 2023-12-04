type Item = any;

export function isFunction(item: Item): item is (...args: any) => any {
  return typeof item === "function";
}

export function isNumber(item: Item): item is number {
  return typeof item === "number" && !isNaN(item);
}

export function isString(item: Item): item is string {
  return typeof item === "string";
}

export function isArray(item: Item): item is Array<any> {
  return item.constructor === Array;
}

export function isEmptyString(item: Item): item is string {
  return isString(item) && !item;
}

export const assignFunction = (item: any): typeof item => {
  if (isFunction(item)) {
    return item;
  }
};

export const assignNumber = (
  number: number,
  defaultNumber: number,
  listLength: number
): number => {
  if (isNumber(number)) {
    if (number === 0 || number === Infinity) {
      return listLength;
    }

    return number;
  }

  return defaultNumber;
};
