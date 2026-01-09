/**
 * @template [T = any]
 * @typedef {Object} SerializedStack
 * @property {T[]} array
 * @property {number | null} capacity
 * @property {string | null} type
 */

/**
 * Represents a single node in the stack
 * @template [T = any]
 */
class StackNode {
  /**
   * @param {T} data
   * @param {StackNode<T> | null} [prev]
   */
  constructor(data, prev = null) {
    this.data = data;
    /** @type {StackNode<T> | null} */
    this.prev = prev; // Pointer to the node below this one
  }
}

/**
 * A LIFO (Last-In, First-Out) data structure implemented using a Linked List.
 * * Features:
 * - O(1) Push/Pop operations
 * - Optional Size Limit (Capacity)
 * - Optional Type Safety
 * - Serialization/Deserialization (JSON support)
 *
 * @template [T = any]
 */
export class Stack {
  /**
   *
   * @param {{data?: T[], capacity?: number, type?: {new (...args: any[]): T} | {(...args: any[]): T} | NumberConstructor | StringConstructor | BooleanConstructor | BigIntConstructor | SymbolConstructor}} [options]
   */
  constructor(options = {}) {
    /** @type {StackNode<T> | null} */
    this.head = null;
    /** @type {number} */
    this.size = 0;
    /** @type {number} */
    this.capacity = options.capacity || Infinity; // Default to Infinity if no capacity is provided
    /** @type {{new (...args: any[]): T} | {(...args: any[]): T} | NumberConstructor | StringConstructor | BooleanConstructor | BigIntConstructor | SymbolConstructor | null} */
    this.type = options.type || null; // Default to null if no type is provided

    if (options.data && Array.isArray(options.data)) {
      for (const item of options.data) {
        this.push(item);
      }
    }
  }

  /**
   * @description Add data to the head
   * @param {T} data
   */
  push(data) {
    // Check if stack is full
    if (this.size >= this.capacity)
      throw new Error("Stack Overflow: Maximum capacity reached");

    // Check correct type
    if (this.type && !this._isValidType(data))
      throw new Error(
        `Invalid Type: Expected ${this._getTypeName(
          this.type
        )} but got ${typeof data}`
      );

    // Create a new node. If stack is not empty, point new node to the current head (place our node at the head and point to previous node)
    const newNode = new StackNode(data, this.head);

    // Update the head to be the new node
    this.head = newNode;

    // Update the size
    this.size++;

    return this;
  }

  /**
   *
   * @description Remove data from the head
   */
  pop() {
    if (this.head === null || this.size === 0) return undefined; // Stack Underflow

    const headNode = this.head; // Store current head to return later
    this.head = this.head.prev; // Move head pointer down to the prev node
    this.size--;
    headNode.prev = null; // Clean up for GC
    return headNode.data;
  }

  /**
   *
   * @description View the head
   */
  peek() {
    if (this.head === null || this.size === 0) return undefined;

    return this.head.data;
  }

  /**
   * Checks if a specific data exists in the stack.
   * Uses strict equality (===).
   *
   * Time: O(n)
   * Space: O(1)
   * @param {T} data
   * @returns {boolean}
   */
  contains(data) {
    let current = this.head;
    while (current) {
      if (current.data === data) {
        return true;
      }
      current = current.prev;
    }
    return false;
  }

  /**
   * Finds the first element satisfying a predicate.
   *
   * Time: O(n)
   * Space: O(1)
   * @param {(data: T) => boolean} callback - Return true to select the item.
   * @returns {T | undefined}
   */
  find(callback) {
    let current = this.head;
    while (current) {
      if (callback(current.data)) {
        return current.data;
      }
      current = current.prev;
    }
    return undefined;
  }

  /**
   * Finds all elements satisfying a predicate.
   *
   * Time: O(n)
   * Space: O(n)
   * @param {(data: T) => boolean} callback
   * @returns {Array<T>}
   */
  filter(callback) {
    const results = [];
    let current = this.head;
    while (current) {
      if (callback(current.data)) {
        results.push(current.data);
      }
      current = current.prev;
    }
    // Optional: Reverse to match insertion order (Bottom -> Top)
    // or keep as Stack order (Top -> Bottom).
    // Usually, search results matter by relevance (Top is most recent).
    return results;
  }

  /**
   * Sorts the stack in place.
   * Rebuilds the stack so that the *last* item in the sorted order ends up at the *Top*.
   * @param {(first: T, second: T) => number} [compareFn] - Standard JS sort comparator.
   * @returns {Stack<T>} - Returns self for chaining.
   */
  sort(compareFn) {
    if (this.head === null || this.size === 0) return this;

    this.head = this._mergeSort(this.head, compareFn || this._compare);

    return this;
  }

  /**
   * @param {T} a
   * @param {T} b
   */
  _compare(a, b) {
    if (a < b) return -1;
    if (a > b) return 1;
    return 0;
  }

  /**
   * @param {StackNode<T> | null} head
   * @param {(first: T, second: T) => number} compare
   * @returns {StackNode<T> | null}
   */
  _mergeSort(head, compare) {
    if (!head || !head.prev) return head;

    // 1. Split list into two halves
    const middle = this._getMiddle(head);
    const nextToMiddle = middle?.prev || null;

    if (middle) middle.prev = null; // Break the link

    // 2. Recursive sorting
    const left = this._mergeSort(head, compare);
    const right = this._mergeSort(nextToMiddle, compare);

    // 3. Merge sorted halves
    return this._sortedMerge(left, right, compare);
  }

  /**
   * @param {StackNode<T> | null} a
   * @param {StackNode<T> | null} b
   * @param {(first: T, second: T) => number} compare
   */
  _sortedMerge(a, b, compare) {
    if (!a) return b;
    if (!b) return a;

    let result = null;

    // Note: Our 'next' is actually 'prev' in stack terminology (Top -> Bottom)
    // We want the 'largest' (or 'smallest' depending on sort) to be at Top.
    // Standard sort: Ascending means Smallest at Bottom, Largest at Top.

    if (compare(a.data, b.data) <= 0) {
      // a is larger/equal (for stack order) or smaller (standard)
      // Let's assume standard sort behavior:
      // compare(10, 5) -> Positive.
      result = a;
      result.prev = this._sortedMerge(a.prev, b, compare);
    } else {
      result = b;
      result.prev = this._sortedMerge(a, b.prev, compare);
    }

    return result;
  }

  /**
   * @param {StackNode<T> | null} head
   */
  _getMiddle(head) {
    if (!head) return head;

    /** @type {StackNode<T> | null} */
    let slow = head;
    let fast = head;

    while (fast.prev && fast.prev.prev) {
      slow = slow?.prev || null;
      fast = fast.prev.prev;
    }
    return slow;
  }

  /**
   *
   * @description Clear the stack
   */
  clear() {
    this.head = null;
    this.size = 0;
    return undefined;
  }

  /**
   *
   * @description Check if the stack is empty
   */
  isEmpty() {
    return this.head === null || this.size === 0;
  }

  /**
   *
   * @description Check if the stack is full
   */
  isFull() {
    return this.size >= this.capacity;
  }

  /**
   *
   * @description Get the size of the stack
   */
  getSize() {
    return this.size;
  }

  toString() {
    let result = "";
    let current = this.head;
    let counter = this.size - 1;
    while (current) {
      result += "[" + counter + ": " + current.data + "] " + " -> ";
      current = current.prev;
      counter--;
    }
    return result + "null";
  }

  /**
   * Converts the Linked List to a standard Array
   */
  toArray() {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.prev;
    }
    return result;
  }

  /**
   * Converts the stack to a JSON string.
   * Useful for saving to localStorage or Databases.
   * @returns {SerializedStack<T>}
   */
  toJSON() {
    if (this.type === Symbol || this.type === BigInt) {
      throw new Error("Symbol and BigInt types cannot be serialized to JSON");
    }
    // We store the data AND the config (capacity/type)
    // so we can restore the rules later.

    return {
      array: this.toArray(),
      capacity: this.capacity === Infinity ? null : this.capacity,
      // Note: We can only serialize the type name if it's a primitive string.
      // Functions/Classes (like Date) cannot be serialized to JSON easily.
      type: this.type === null ? null : this._getTypeName(this.type) || null,
    };
  }

  /**
   * @description Creates a new Stack from a JSON string
   * @template U
   * @param {string} str
   * @param {{reviver?: (...args: any[]) => any, type?: {new (...args: any[]): U} | { (...args: any): U } | NumberConstructor | StringConstructor | BooleanConstructor | BigIntConstructor | SymbolConstructor}} [options]
   * @returns {Stack<U>}
   * Static Factory Method: Creates a new Stack from a JSON string.
   */
  static fromJSON(str, { reviver, type } = {}) {
    /** @type {SerializedStack<U>} */
    const data = JSON.parse(str);

    // 1. Resolve the Type
    // If the user passed a type manually, use it.
    // If not, look at the string in JSON and try to convert it.
    /** @type {{new (...args: any[]): U} | { (...args: any): U } | NumberConstructor | StringConstructor | BooleanConstructor | BigIntConstructor | SymbolConstructor | null} */
    let resolvedType = type || null;
    if (!resolvedType) {
      if (data.type && data.type === "Number") {
        resolvedType = Number;
      } else if (data.type && data.type === "String") {
        resolvedType = String;
      } else if (data.type && data.type === "Boolean") {
        resolvedType = Boolean;
      } else if (data.type && data.type === "BigInt") {
        resolvedType = BigInt;
      } else if (data.type && data.type === "Symbol") {
        resolvedType = Symbol;
      } else resolvedType = null;
    }

    // 1. Re-initialize the stack with saved config
    const newStack = new Stack({
      capacity: data.capacity || Infinity,
      type: resolvedType || undefined,
    });

    // 2. Rebuild the stack
    // The array is [Top, Next, ... Bottom].
    // To restore, we must push Bottom first!
    // So we iterate the array in REVERSE.
    if (Array.isArray(data.array)) {
      for (let i = data.array.length - 1; i >= 0; i--) {
        let value = data.array[i];
        if (reviver) value = reviver(value);
        else if (typeof type === "function") {
          if (
            type === BigInt ||
            type === Symbol ||
            type === Number ||
            type === String ||
            type === Boolean
          ) {
            const PrimitiveFactory = /** @type {Function} */ (type);
            value = PrimitiveFactory(value);
          } else {
            if (
              type.prototype &&
              type.prototype.constructor &&
              type.prototype.constructor === type &&
              type.prototype.constructor.name
            ) {
              const ObjectFactory = /** @type {{new (...args: any[]): U}} */ (
                type
              );
              value = new ObjectFactory(value);
            } else {
              const FunctionFactory = /** @type {{(...args: any[]): U}} */ (
                type
              );
              value = FunctionFactory(value);
            }
          }
        }

        newStack.push(value);
      }
    }

    return newStack;
  }

  /**
   *
   * @param {{new (...args: any[]): T} | {(...args: any[]): T} | NumberConstructor | StringConstructor | BooleanConstructor | BigIntConstructor | SymbolConstructor} type
   * @description Helper to get a readable name for the error message
   */
  _getTypeName(type) {
    return typeof type === "function" ? type.name : undefined;
  }

  /**
   *
   * @param {T} data
   * @returns
   */
  _isValidType(data) {
    if (this.type === null) return true;

    if (typeof this.type !== "function") return false;

    // Case A: Primitive check
    if (this.type === Number) return typeof data === "number";
    if (this.type === String) return typeof data === "string";
    if (this.type === Boolean) return typeof data === "boolean";
    if (this.type === BigInt) return typeof data === "bigint";
    if (this.type === Symbol) return typeof data === "symbol";

    // Case B: Class/Instance check (passed as Constructor, e.g., Date)
    if (
      this.type.prototype &&
      this.type.prototype.constructor &&
      this.type.prototype.constructor === this.type &&
      this.type.prototype.constructor.name
    ) {
      return data instanceof this.type;
    }

    return true;
  }
}

// Usage
const stack = new Stack({
  capacity: 3,
  type: String,
  data: ["Apple", "Banana", "Cherry"],
});

/* stack.push("Apple");
stack.push("Banana");
stack.push("Cherry"); */

console.log(stack.toString());
// Output: Cherry -> Banana -> Apple -> null

console.log("popping: " + stack.pop()); // Output: "Cherry"
console.log("picking: " + stack.peek()); // Output: "Banana"

console.log(stack.toArray());
// Output: Banana -> Apple -> null

// 1. Create a Stack for Dates only, max 10 items
const myStack = new Stack({
  capacity: 10,
  type: Date,
});

// 2. Add items
myStack.push(new Date("2023-01-01"));
myStack.push(new Date("2024-01-01"));

// 3. Save it (Serialize)
const savedData = JSON.stringify(myStack); // This will call toJSON()

// 4. Load it back (Deserialize with Reviver)
const reviver = (/** @type {string | number | Date} */ val) => new Date(val);

const restoredStack = Stack.fromJSON(savedData, { type: Date, reviver });

console.log(restoredStack.type);

console.log(restoredStack.peek()?.getFullYear()); // 2024

const stackNumber = new Stack({ type: Number });
stackNumber.push(10);
stackNumber.push(20);
stackNumber.push(30);

console.log(stackNumber.contains(20)); // true
console.log(stackNumber.contains(99)); // false

class User {
  /**
   * @param {number} id
   * @param {string} name
   */
  constructor(id, name) {
    this.id = id;
    this.name = name;
  }
}

const users = new Stack({ type: User });
users.push(new User(1, "Alice"));
users.push(new User(2, "Bob"));
users.push(new User(3, "Charlie")); // Top

// Find the user with ID 2
// The search goes: Charlie (id 3) -> Bob (id 2) ✅ Found!
const foundUser = users.find((u) => u.id === 2);

console.log(foundUser?.name); // "Bob"

const evenUsers = users.filter((u) => u.id % 2 === 0);
console.log(evenUsers); // [ User(Bob) ]

const users1 = new Stack({ type: User });
users1.push(new User(3, "Charlie"));
users1.push(new User(1, "Alice"));
users1.push(new User(2, "Bob"));

// Sort by ID (Ascending)
// Logic: User 1 will be at Bottom, User 3 will be at Top.
users1.sort((u1, u2) => u1.id - u2.id);

console.log(users1.peek()?.name); // "Charlie" (ID 3 is Top)

const numbers = new Stack({ type: Number });
numbers.push(10);
numbers.push(50);
numbers.push(5);

// SCENARIO A: Ascending Sort (Smallest -> Largest)
// Array becomes: [5, 10, 50]
// Stack becomes: Bottom [5] -> [10] -> [50] Top
numbers.sort((a, b) => {
  if (a > b) return 1; // a > b, swap
  if (a < b) return -1; // a < b, don't swap
  return 0;
});

console.log(numbers.pop()); // 50 (Largest is at Top)
console.log(numbers.pop()); // 10
console.log(numbers.pop()); // 5

// SCENARIO B: Descending Sort (Largest -> Smallest)
// Array becomes: [50, 10, 5]
// Stack becomes: Bottom [50] -> [10] -> [5] Top
numbers.push(10);
numbers.push(50);
numbers.push(5); // Reset

numbers.sort((a, b) => {
  if (a > b) return 1; // a > b, swap
  if (a < b) return -1; // a < b, don't swap
  return 0;
});

console.log(numbers.pop()); // 5 (Smallest is at Top)

const sorted = new Stack({ type: Number });

sorted.push(10);
sorted.push(5);
sorted.push(15);
sorted.sort((a, b) => b.valueOf() - a.valueOf());

console.log(sorted.toString());
