export function whatIsLast(last: number) {
  return function isLast(value: number, callback: () => void) {
    if (value === last) {
      callback();
    }
  };
}

export type IsLast = ReturnType<typeof whatIsLast>;
