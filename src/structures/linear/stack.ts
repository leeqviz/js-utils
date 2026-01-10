interface SerializedStack<T = any> {
  array: T[];
  capacity: number | null;
  type: string | null;
}

type StackType<T = any> =
  | { new (...args: any[]): T }
  | { (...args: any[]): T }
  | NumberConstructor
  | StringConstructor
  | BooleanConstructor
  | BigIntConstructor
  | SymbolConstructor;

/**
 * Represents a single node in the stack
 */
class StackNode<T = any> {
  public prev: StackNode<T> | null;
  public data: T;
  constructor(data: T, prev: StackNode<T> | null = null) {
    /**
     * Data stored in this node. Can be any type
     */
    this.data = data;

    /**
     * Pointer to the node below this one
     */
    this.prev = prev;
  }
}

interface StackOptions<T = any> {
  array?: T[] | null;
  capacity?: number | null;
  type?: StackType<T> | null;
}

interface FromJSONOptions<T = any> {
  type?: StackType<T> | null;
  inferred?: boolean;
  reviver?: (...args: any[]) => any;
}

/**
 * A LIFO (Last-In, First-Out) data structure implemented using a Linked List.
 * * Features:
 * - O(1) Push/Pop operations
 * - Optional Size Limit (Capacity)
 * - Optional Type Safety (Primitive types and Objects)
 * - Serialization/Deserialization (JSON support)
 * - Merge Sort algorithm for sorting
 *
 */
export class Stack<T = any> {
  public head: StackNode<T> | null = null;
  public size: number = 0;
  public capacity: number;
  public type: StackType<T> | null;
  constructor({ array, capacity, type }: StackOptions<T> = {}) {
    this.head = null;

    this.size = 0;

    /**
     * Default to Infinity if no capacity is provided
     */
    this.capacity =
      capacity && typeof capacity === "number" ? capacity : Infinity;

    /**
     * Default to null if no type is provided
     */
    this.type =
      type &&
      typeof type === "function" &&
      (type === Number ||
        type === String ||
        type === Boolean ||
        type === BigInt ||
        type === Symbol ||
        (type.prototype &&
          type.prototype.constructor &&
          type.prototype.constructor === type &&
          type.prototype.constructor.name))
        ? type
        : null;

    if (array && Array.isArray(array)) {
      for (const item of array) {
        this.push(item);
      }
    }
  }

  /**
   * Add data to the head
   */
  push(data: T) {
    // Check if stack is full
    if (this.size >= this.capacity)
      throw new RangeError("Maximum call stack size exceeded");

    // Check correct type
    if (this.type && !this._isValidType(data))
      throw new TypeError(
        `Expected ${this._getTypeName(this.type)} but got ${typeof data}`
      );

    // Create a new node.
    // If stack is not empty, point new node to the current head (place our node at the head and point to previous node)
    // Update the head to be the new node
    this.head = new StackNode(data, this.head);
    this.size++;

    // Allow chaining
    return this;
  }

  /**
   *
   * Remove data from the head
   */
  pop() {
    // Stack Underflow case check
    if (this.head === null || this.size === 0) return undefined;

    // Store current head to return later
    const head = this.head;

    // Move head pointer down to the prev node
    this.head = this.head.prev;
    this.size--;

    // Free the link to allow GC to clean it up (Optional)
    head.prev = null;
    return head.data;
  }

  /**
   *
   * View the head
   */
  peek() {
    if (this.head === null || this.size === 0) return undefined;

    return this.head.data;
  }

  /**
   *
   * Clear the stack
   */
  clear() {
    this.head = null;
    this.size = 0;
    return this;
  }

  /**
   *
   * Get the size of the stack
   */
  getSize() {
    return this.size;
  }

  /**
   *
   * Check if the stack is empty
   */
  isEmpty() {
    return this.head === null || this.size === 0;
  }

  /**
   *
   * Check if the stack is full
   */
  isFull() {
    return this.size >= this.capacity;
  }

  /**
   * Checks if a specific data exists in the stack.
   * Uses strict equality (===).
   *
   * Time: O(n)
   * Space: O(1)
   */
  contains(data: T) {
    // Check correct type
    if (this.type && !this._isValidType(data))
      throw new TypeError(
        `Expected ${this._getTypeName(this.type)} but got ${typeof data}`
      );

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
   */
  find(callback: (data: T) => boolean) {
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
   */
  filter(callback: (data: T) => boolean) {
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
   */
  sort(compareFn?: (first: T, second: T) => number) {
    if (this.head === null || this.size === 0) return this;

    function _compare(a: T, b: T) {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    }

    this.head = this._mergeSort(this.head, compareFn || _compare);

    return this;
  }

  _mergeSort(
    head: StackNode<T> | null,
    compare: (first: T, second: T) => number
  ): StackNode<T> | null {
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

  _sortedMerge(
    a: StackNode<T> | null,
    b: StackNode<T> | null,
    compare: (first: T, second: T) => number
  ) {
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

  _getMiddle(head: StackNode<T> | null) {
    if (!head) return head;

    let slow: StackNode<T> | null = head;
    let fast = head;

    while (fast.prev && fast.prev.prev) {
      slow = slow?.prev || null;
      fast = fast.prev.prev;
    }
    return slow;
  }

  toString() {
    let result = "";
    let current = this.head;
    let counter = this.size - 1;
    while (current) {
      result += "(" + counter + ": " + current.data + ")" + " -> ";
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
   * You don't need to call this method explicitly.
   * JSON.stringify() will call it automatically.

   */
  toJSON(): SerializedStack<T> {
    if (this.type === Symbol || this.type === BigInt) {
      throw new TypeError(
        "Symbol and BigInt types cannot be serialized to JSON"
      );
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
   * Creates a new Stack from a JSON string
   * Static Factory Method: Creates a new Stack from a JSON string.
   * If you want to provide a type, you need to pass it as an option.
   * Use an 'inferred' option as a last resort to let the function try to infer the type.
   *
   */
  static fromJSON<U = any>(
    str: string,
    { type, inferred, reviver }: FromJSONOptions<U> = {}
  ): Stack<U> {
    const data: SerializedStack<U> = JSON.parse(str);

    // Resolve the Type
    // If the user passed a type manually, use it.
    // If not, look at the string in JSON and try to convert it.
    let resolvedType: StackType<U> | null = type || null;
    if (inferred && !resolvedType && data.type) {
      if (data.type === "Number") {
        resolvedType = Number;
      } else if (data.type === "String") {
        resolvedType = String;
      } else if (data.type === "Boolean") {
        resolvedType = Boolean;
      } else if (data.type === "BigInt") {
        resolvedType = BigInt;
      } else if (data.type === "Symbol") {
        resolvedType = Symbol;
      } else {
        // Try to resolve the type as a last resort (Unsafe)
        const environment = typeof window !== "undefined" ? window : globalThis;
        if (environment) {
          try {
            // @ts-ignore
            resolvedType = environment[data.type] || eval(data.type) || null;
          } catch {
            resolvedType = null;
          }
        }
      }
    }

    // Re-initialize the stack with saved config
    const restored = new Stack({
      capacity: data.capacity || Infinity,
      type: resolvedType || undefined,
    });

    // Rebuild the stack
    // The array is [Top, Next, ... Bottom].
    // To restore, we must push Bottom first!
    // So we iterate the array in REVERSE.
    if (Array.isArray(data.array)) {
      for (let i = data.array.length - 1; i >= 0; i--) {
        let value = data.array[i];
        if (reviver) value = reviver(value);
        else if (typeof resolvedType === "function") {
          if (
            resolvedType === BigInt ||
            resolvedType === Symbol ||
            resolvedType === Number ||
            resolvedType === String ||
            resolvedType === Boolean
          ) {
            value = (resolvedType as Function)(value);
          } else {
            if (
              resolvedType.prototype &&
              resolvedType.prototype.constructor &&
              resolvedType.prototype.constructor === type &&
              resolvedType.prototype.constructor.name
            ) {
              value = new (resolvedType as { new (...args: any[]): U })(value);
            } else {
              value = (resolvedType as { (...args: any[]): U })(value);
            }
          }
        }

        restored.push(value);
      }
    }

    return restored;
  }

  /**
   *
   * Helper to get a readable name for the error message
   */
  _getTypeName(type: StackType<T>) {
    return typeof type === "function" ? type.name : undefined;
  }

  /**
   *
   * @returns
   */
  _isValidType(data: T) {
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
  array: ["Apple", "Banana", "Cherry"],
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
const reviver = (val: string | number | Date) => new Date(val);

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
  public id: number;
  public name: string;
  constructor(id: number, name: string) {
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

const testType = () => 3;

const testStack = new Stack({ type: testType, capacity: 3 });

testStack.push(4);
testStack.push(4);
testStack.push(4);
testStack.pop();
testStack.clear().push(1);

console.log(testStack.toString());

const checkType = new Stack({ type: User, capacity: 3 });
const jStr = JSON.stringify(checkType);
/** @type {Stack<User>} */
const restoredType = Stack.fromJSON(jStr, { inferred: true });

console.log(restoredType.type);
