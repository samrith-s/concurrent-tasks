import { describe, expect, it, vitest } from "vitest";

import {
  assignFunction,
  assignNumber,
  isArray,
  isEmptyString,
  isFunction,
  isNumber,
  isString,
} from "src/Utils";

describe.concurrent("Utils", () => {
  describe("isFunction", () => {
    it("should return `true` if item is a function", () => {
      expect(isFunction(() => void 0)).true;
      expect(
        isFunction(function () {
          void 0;
        })
      ).true;
    });

    it("should return `false` if item is not a function", () => {
      expect(isFunction(true)).false;
      expect(isFunction(100)).false;
      expect(isFunction("foo")).false;
      expect(isFunction({})).false;
      expect(isFunction([])).false;
    });
  });

  describe("isNumber", () => {
    it("should return `true` if item is a number", () => {
      expect(isNumber(1)).true;
      expect(isNumber(10.0)).true;
    });

    it("should return `false` if item is not a number or is NaN", () => {
      expect(isNumber(NaN)).false;
      expect(isNumber(true)).false;
      expect(isNumber("foo")).false;
      expect(isNumber({})).false;
      expect(isNumber([])).false;
      expect(isNumber(() => void 0)).false;
    });
  });

  describe("isString", () => {
    it("should return `true` if item is a string", () => {
      expect(isString("hello")).true;
      expect(isString("")).true;
      expect(isString(String("hello"))).true;
    });

    it("should return `false` if item is not a string", () => {
      expect(isString(true)).false;
      expect(isString(100)).false;
      expect(isString({})).false;
      expect(isString([])).false;
      expect(isString(() => void 0)).false;
    });
  });

  describe("isArray", () => {
    it("should return `true` if item is an array", () => {
      expect(isArray([])).true;
      expect(isArray(new Array(10))).true;
      expect(isArray(Array.from({ length: 10 }))).true;
      expect(isArray(Array.from([1, 2, 3, 4, 5]))).true;
    });

    it("should return `false` if item is not an array", () => {
      expect(isArray(true)).false;
      expect(isArray(100)).false;
      expect(isArray("foo")).false;
      expect(isArray({})).false;
      expect(isArray(() => void 0)).false;
    });
  });

  describe("isEmptyString", () => {
    it("should return `true` if item is an empty string", () => {
      expect(isEmptyString("")).true;
      expect(isEmptyString(String())).true;
    });

    it("should return `false` if item is not an empty string", () => {
      expect(isEmptyString(true)).false;
      expect(isEmptyString(100)).false;
      expect(isEmptyString("foo")).false;
      expect(isEmptyString({})).false;
      expect(isEmptyString([])).false;
      expect(isEmptyString(() => void 0)).false;
    });
  });

  describe("assignFunction", () => {
    it("should assign if item is a function", () => {
      const fn = vitest.fn();
      expect(assignFunction(fn)).eq(fn);
    });

    it("should not assign if item is not a function", () => {
      expect(assignFunction(true)).undefined;
      expect(assignFunction(100)).undefined;
      expect(assignFunction("foo")).undefined;
      expect(assignFunction({})).undefined;
      expect(assignFunction([])).undefined;
    });
  });

  describe("assignNumber", () => {
    it("should assign the number if it is >0 and <Infinity", () => {
      expect(assignNumber(10, 100, 1)).eq(10);
      expect(assignNumber(5, 100, 1)).eq(5);
      expect(assignNumber(2, 100, 1)).eq(2);
      expect(assignNumber(2, 100, 1)).eq(2);
    });

    it("should assign the list length if the number is 0 or Infinity", () => {
      expect(assignNumber(0, 100, 1)).eq(1);
      expect(assignNumber(Infinity, 100, 1)).eq(1);
    });

    it("should assign the default value if the value is not a number", () => {
      expect(assignNumber("hello" as any, 100, 1)).eq(100);
      expect(assignNumber(true as any, 100, 1)).eq(100);
      expect(assignNumber([] as any, 100, 1)).eq(100);
      expect(assignNumber({} as any, 100, 1)).eq(100);
    });
  });
});
