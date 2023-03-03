import {
  assignFunction,
  assignNumber,
  isArray,
  isEmptyString,
  isFunction,
  isNumber,
  isString,
} from "../src/Utils";

describe("Utils", () => {
  describe("isFunction", () => {
    it("should return `true` if item is a function", () => {
      expect(isFunction(() => void 0)).toBeTruthy();
      expect(
        isFunction(function () {
          void 0;
        })
      ).toBeTruthy();
    });

    it("should return `false` if item is not a function", () => {
      expect(isFunction(true)).toBeFalsy();
      expect(isFunction(100)).toBeFalsy();
      expect(isFunction("foo")).toBeFalsy();
      expect(isFunction({})).toBeFalsy();
      expect(isFunction([])).toBeFalsy();
    });
  });

  describe("isNumber", () => {
    it("should return `true` if item is a number", () => {
      expect(isNumber(1)).toBeTruthy();
      expect(isNumber(10.0)).toBeTruthy();
    });

    it("should return `false` if item is not a number or is NaN", () => {
      expect(isNumber(NaN)).toBeFalsy();
      expect(isNumber(true)).toBeFalsy();
      expect(isNumber("foo")).toBeFalsy();
      expect(isNumber({})).toBeFalsy();
      expect(isNumber([])).toBeFalsy();
      expect(isNumber(() => void 0)).toBeFalsy();
    });
  });

  describe("isString", () => {
    it("should return `true` if item is a string", () => {
      expect(isString("hello")).toBeTruthy();
      expect(isString("")).toBeTruthy();
      expect(isString(String("hello"))).toBeTruthy();
    });

    it("should return `false` if item is not a string", () => {
      expect(isString(true)).toBeFalsy();
      expect(isString(100)).toBeFalsy();
      expect(isString({})).toBeFalsy();
      expect(isString([])).toBeFalsy();
      expect(isString(() => void 0)).toBeFalsy();
    });
  });

  describe("isArray", () => {
    it("should return `true` if item is an array", () => {
      expect(isArray([])).toBeTruthy();
      expect(isArray(new Array(10))).toBeTruthy();
      expect(isArray(Array.from({ length: 10 }))).toBeTruthy();
      expect(isArray(Array.from([1, 2, 3, 4, 5]))).toBeTruthy();
    });

    it("should return `false` if item is not an array", () => {
      expect(isArray(true)).toBeFalsy();
      expect(isArray(100)).toBeFalsy();
      expect(isArray("foo")).toBeFalsy();
      expect(isArray({})).toBeFalsy();
      expect(isArray(() => void 0)).toBeFalsy();
    });
  });

  describe("isEmptyString", () => {
    it("should return `true` if item is an empty string", () => {
      expect(isEmptyString("")).toBeTruthy();
      expect(isEmptyString(String())).toBeTruthy();
    });

    it("should return `false` if item is not an empty string", () => {
      expect(isEmptyString(true)).toBeFalsy();
      expect(isEmptyString(100)).toBeFalsy();
      expect(isEmptyString("foo")).toBeFalsy();
      expect(isEmptyString({})).toBeFalsy();
      expect(isEmptyString([])).toBeFalsy();
      expect(isEmptyString(() => void 0)).toBeFalsy();
    });
  });

  describe("assignFunction", () => {
    it("should assign if item is a function", () => {
      const fn = jest.fn();
      expect(assignFunction(fn)).toBe(fn);
    });

    it("should not assign if item is not a function", () => {
      expect(assignFunction(true)).toBeUndefined();
      expect(assignFunction(100)).toBeUndefined();
      expect(assignFunction("foo")).toBeUndefined();
      expect(assignFunction({})).toBeUndefined();
      expect(assignFunction([])).toBeUndefined();
    });
  });

  describe("assignNumber", () => {
    it("should assign the number if it is >0 and <Infinity", () => {
      expect(assignNumber(10, 100, 1)).toBe(10);
      expect(assignNumber(5, 100, 1)).toBe(5);
      expect(assignNumber(2, 100, 1)).toBe(2);
      expect(assignNumber(2, 100, 1)).toBe(2);
    });

    it("should assign the list length if the number is 0 or Infinity", () => {
      expect(assignNumber(0, 100, 1)).toBe(1);
      expect(assignNumber(Infinity, 100, 1)).toBe(1);
    });

    it("should assign the default value if the value is not a number", () => {
      expect(assignNumber("hello" as any, 100, 1)).toBe(100);
      expect(assignNumber(true as any, 100, 1)).toBe(100);
      expect(assignNumber([] as any, 100, 1)).toBe(100);
      expect(assignNumber({} as any, 100, 1)).toBe(100);
    });
  });
});
