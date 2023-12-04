import { generateTask } from "../../testing-utils/utils/generate-tasks";
import { List } from "../List";
import { Task } from "../Task";

function createTask(id?: number): Task<number> {
  return new Task(id ?? Math.random(), generateTask());
}
let list: List<number>;

beforeEach(() => {
  list = new List();
});

afterEach(() => {
  list.clear();
});

describe("List", () => {
  describe("properties", () => {
    describe("size", () => {
      it("should print the correct size", () => {
        list.add(createTask());

        expect(list.size).toBe(1);

        list.remove();

        expect(list.size).toBe(0);
      });
    });
  });

  describe("methods", () => {
    describe("entries", () => {
      it("should return the correct entries", () => {
        const ids = [1, 2, 3];

        ids.forEach((id) => {
          list.add(createTask(id));
        });

        list.entries().forEach((task, index) => {
          expect(task.id).toBe(ids[index]);
        });
      });
    });

    describe("first", () => {
      it("should return the first item in the list", () => {
        list.add(createTask(0));
        list.add(createTask(1));
        list.add(createTask(2));

        expect(list.first()?.id).toBe(0);
      });

      it("should return undefined if the list is empty", () => {
        expect(list.first()).toBeUndefined();
      });
    });

    describe("last", () => {
      it("should return the last item in the list", () => {
        list.add(createTask(0));
        list.add(createTask(1));
        list.add(createTask(2));

        expect(list.last()?.id).toBe(2);
      });

      it("should return undefined if the list is empty", () => {
        expect(list.last()).toBeUndefined();
      });
    });

    describe("at", () => {
      it("should return the item at the index", () => {
        list.add(createTask(0));
        list.add(createTask(1));
        list.add(createTask(2));

        expect(list.at(1)?.id).toBe(1);
      });

      it("should throw an error if index is out of bounds", () => {
        list.add(createTask(0));

        expect(() => list.at(1)).toThrow(RangeError);
      });
    });

    describe("range", () => {
      it("should return the range", () => {
        list.add(createTask(0));
        list.add(createTask(1));
        list.add(createTask(2));
        list.add(createTask(3));

        const range = list.range(1, 2);

        expect(range?.length).toBe(2);

        range?.forEach((task, index) => {
          expect(task.id).toBe(index + 1);
        });
      });

      it("should return all elements from index to end if no count provided", () => {
        list.add(createTask(0));
        list.add(createTask(1));
        list.add(createTask(2));
        list.add(createTask(3));
        list.add(createTask(4));
        list.add(createTask(5));

        const range = list.range(1);

        expect(range?.length).toBe(5);

        range?.forEach((task, index) => {
          expect(task.id).toBe(index + 1);
        });
      });

      it("should throw an error if index is out of bounds", () => {
        list.add(createTask(0));

        expect(() => list.range(1, 2)).toThrow(RangeError);
      });
    });

    describe("add", () => {
      it("should add an item to the end of the list", () => {
        expect(list.add(createTask(1))).toBe(list.size);
        expect(list.at(0)?.id).toBe(1);
      });
    });

    describe("addFirst", () => {
      it("should add an item to the start of the list", () => {
        list.add(createTask(0));
        list.add(createTask(1));
        list.add(createTask(2));

        expect(list.addFirst(createTask(3))).toBe(list.size);
        expect(list.entries().shift()?.id).toBe(3);
      });
    });

    describe("addAt", () => {
      it("should add at a particular index", () => {
        list.add(createTask(0));
        list.add(createTask(1));
        list.add(createTask(2));

        list.addAt(1, createTask(3));

        expect(list.at(1)?.id).toBe(3);
      });

      it("should throw an error if index is out of bounds", () => {
        list.add(createTask(0));
        list.add(createTask(1));
        list.add(createTask(2));

        expect(() => list.addAt(4, createTask(3))).toThrow(RangeError);
      });
    });

    describe("remove", () => {
      it("should remove an item from the end of the list", () => {
        list.add(createTask(0));
        list.add(createTask(1));

        const task = list.remove();

        expect(list.size).toBe(1);
        expect(task?.id).toBe(1);
      });

      it("should return undefined if there are no items", () => {
        expect(list.remove()).toBeUndefined();
      });
    });

    describe("removeFirst", () => {
      it("should remove an item from the beginning of the list", () => {
        list.add(createTask(0));
        list.add(createTask(1));

        const task = list.removeFirst();

        expect(list.size).toBe(1);
        expect(task?.id).toBe(0);
      });

      it("should return undefined if there are no items", () => {
        expect(list.removeFirst()).toBeUndefined();
      });
    });

    describe("removeAt", () => {
      it("should remove at a particular index", () => {
        list.add(createTask(0));
        list.add(createTask(1));
        list.add(createTask(2));

        const task = list.removeAt(1);

        expect(task?.id).toBe(1);
      });

      it("should throw an error if index is out of bounds", () => {
        list.add(createTask(0));
        list.add(createTask(1));
        list.add(createTask(2));

        expect(() => list.removeAt(4)).toThrow(RangeError);
      });
    });

    describe("removeRange", () => {
      it("should remove a particular range", () => {
        list.add(createTask(0));
        list.add(createTask(1));
        list.add(createTask(2));

        const tasks = list.removeRange(1, 2);

        tasks?.forEach((task, index) => {
          expect(task.id).toBe(index + 1);
        });
      });

      it("should throw an error if index is out of bounds", () => {
        list.add(createTask(0));
        list.add(createTask(1));
        list.add(createTask(2));

        expect(() => list.removeRange(4, 2)).toThrow(RangeError);
      });
    });

    describe("removeById", () => {
      it("should remove a task by id", () => {
        list.add(createTask(0));
        list.add(createTask(1));
        list.add(createTask(2));

        const task = list.removeById(1);

        expect(task?.id).toBe(1);
        expect(list.size).toBe(2);
      });

      it("should return undefined if a task by that id does not exist", () => {
        expect(list.removeById(1)).toBeUndefined();
      });
    });

    describe("clear", () => {
      it("should clear the list", () => {
        list.clear();

        expect(list.size).toBe(0);
      });
    });
  });
});
