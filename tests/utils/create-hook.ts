export function createHook<N extends string = string>(name: N) {
  let callCount = 0;

  return {
    name,
    get callCount() {
      return callCount;
    },
    fn() {
      callCount++;
    },
  };
}
