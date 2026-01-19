type PrimitiveConstructor =
  | NumberConstructor
  | StringConstructor
  | BooleanConstructor
  | BigIntConstructor
  | SymbolConstructor;

type GenericConstructor<T = unknown> = { new (...args: any[]): T };

type ValidateFunction<T = unknown> = (value: T) => boolean;

type StackType<T = unknown> = PrimitiveConstructor | GenericConstructor<T>;

interface StackOptions<T = unknown> {
  array?: T[];
  limit?: number;
  type?: StackType<T>;
  validate?: ValidateFunction;
}

interface SerializedStack<T = unknown> {
  array: T[] | null;
  limit: number | null;
  type: string | null;
}

interface FromJSONOptions<T = unknown> {
  inferred?: boolean;
  reviver?: (this: any, key: string, value: any) => any;
  type?: StackType<T>;
  validate?: ValidateFunction;
}

const primitiveConstructors = new Set<Function>([
  Number,
  String,
  Boolean,
  BigInt,
  Symbol,
]);

function isConstructor<T = unknown>(value: T): boolean {
  return (
    typeof value === "function" &&
    value.prototype &&
    value.prototype.constructor &&
    value.prototype.constructor === value &&
    value.prototype.constructor.name
  );
}

function getFunctionName<T = unknown>(value: T): string | undefined {
  return typeof value === "function" ? value.name : undefined;
}

/**
 * Checks if the data can be serialized to JSON.
 * You can use it to validate the data before serializing it.
 */
function isSerializable<T = unknown>(data: T): boolean {
  if (
    data === undefined ||
    typeof data === "function" ||
    typeof data === "symbol" ||
    typeof data === "bigint"
  )
    return false;

  function _hasRef(value: unknown, seen = new WeakSet<object>()): boolean {
    if (value === null || typeof value !== "object") return false;

    if (seen.has(value)) return true;

    seen.add(value);

    if (Array.isArray(value)) {
      for (const item of value) {
        if (_hasRef(item, seen)) return true;
      }
    } else {
      for (const key in value) {
        if (Object.hasOwn(value, key)) {
          if (_hasRef(value[key as keyof typeof value], seen)) return true;
        }
      }
    }

    seen.delete(value);
    return false;
  }

  if (_hasRef(data)) return false;

  try {
    JSON.stringify(data);
    return true;
  } catch {
    return false;
  }
}

/**
 * Represents a single node in the stack
 */
class StackNode<T = unknown> {
  public prev: StackNode<T> | null = null; // Pointer to the node below this one
  public data: T; // Data stored in this node
  constructor(data: T, prev: StackNode<T> | null = null) {
    this.data = data;
    this.prev = prev;
  }
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
export class Stack<T = unknown> {
  public head: StackNode<T> | null = null;
  public size: number = 0;
  public readonly limit: number = Infinity;
  public readonly type: StackType<T> | null = null;
  public readonly validate: ValidateFunction | null = null;
  constructor(options: StackOptions<T> = {}) {
    this.head = null;
    this.size = 0;
    const { limit, type, array, validate } = options;

    if (limit && typeof limit !== "number")
      throw new TypeError(
        `Invalid Stack Configuration: 'limit' must be a number. Got: ${typeof limit}`,
      );
    this.limit = limit ?? Infinity;

    if (type && !primitiveConstructors.has(type) && !isConstructor(type))
      throw new TypeError(
        `Invalid Stack Configuration: 'type' must be a constructor or primitive function. Got: ${typeof type}`,
      );
    this.type = type ?? null;

    if (validate && typeof validate !== "function")
      throw new TypeError(
        `Invalid Stack Configuration: 'validate' must be a function. Got: ${typeof validate}`,
      );
    this.validate = validate ?? null;

    if (array && !Array.isArray(array))
      throw new TypeError(
        `Invalid Stack Configuration: 'array' must be an array. Got: ${typeof array}`,
      );
    if (array && Array.isArray(array)) {
      for (const item of array) {
        this.push(item);
      }
    }
  }

  /**
   * Add data to the head
   */
  public push(data: T): this {
    // Check if stack is full
    if (this.size >= this.limit)
      throw new RangeError("Maximum call stack size exceeded");

    // Check correct type
    if (this.type && !this._isValidType(data))
      throw new TypeError(
        `Expected ${getFunctionName(this.type)} but got ${typeof data}`,
      );

    // We run this second because it might involve complex logic.
    if (this.validate && !this.validate(data)) {
      throw new Error(
        "Validation Failed: Value rejected by custom validation rule.",
      );
    }

    // Create a new node.
    // If stack is not empty, point new node to the current head (place our node at the head and point to previous node)
    // Update the head to be the new node
    this.head = new StackNode(data, this.head);
    this.size++;

    // Allow chaining
    return this;
  }

  /**
   * Remove data from the head
   */
  public pop(): T | undefined {
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
   * View the head
   */
  public peek(): T | undefined {
    if (this.head === null || this.size === 0) return undefined;

    return this.head.data;
  }

  /**
   * Clear the stack
   */
  public clear(): this {
    this.head = null;
    this.size = 0;
    return this;
  }

  /**
   * Get the size of the stack
   */
  public getSize(): number {
    return this.size;
  }

  /**
   * Check if the stack is empty
   */
  public isEmpty(): boolean {
    return this.head === null || this.size === 0;
  }

  /**
   * Check if the stack is full
   */
  public isFull(): boolean {
    return this.size >= this.limit;
  }

  /**
   * Checks if a specific data exists in the stack.
   * Uses strict equality (===).
   *
   * Time: O(n);
   * Space: O(1);
   */
  public contains(data: T): boolean {
    // Check correct type
    if (this.type && !this._isValidType(data))
      throw new TypeError(
        `Expected ${getFunctionName(this.type)} but got ${typeof data}`,
      );

    // We run this second because it might involve complex logic.
    if (this.validate && !this.validate(data)) {
      throw new Error(
        "Validation Failed: Value rejected by custom validation rule.",
      );
    }

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
   * Time: O(n);
   * Space: O(1);
   */
  public find(callback: (data: T) => boolean): T | undefined {
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
   * Time: O(n);
   * Space: O(n);
   */
  public filter(callback: (data: T) => boolean): T[] {
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
  public sort(compare?: (first: T, second: T) => number): this {
    if (this.head === null || this.size === 0) return this;

    function _compare(first: T, second: T) {
      if (first < second) return -1;
      if (first > second) return 1;
      return 0;
    }

    this.head = this._mergeSort(this.head, compare ?? _compare);

    return this;
  }

  private _mergeSort(
    head: StackNode<T> | null,
    compare: (first: T, second: T) => number,
  ): StackNode<T> | null {
    if (!head || !head.prev) return head;

    // 1. Split list into two halves
    const middle = this._getMiddle(head);
    const nextToMiddle = middle?.prev ?? null;

    if (middle) middle.prev = null; // Break the link

    // 2. Recursive sorting
    const left = this._mergeSort(head, compare);
    const right = this._mergeSort(nextToMiddle, compare);

    // 3. Merge sorted halves
    return this._sortedMerge(left, right, compare);
  }

  private _sortedMerge(
    left: StackNode<T> | null,
    right: StackNode<T> | null,
    compare: (first: T, second: T) => number,
  ): StackNode<T> | null {
    if (!left) return right;
    if (!right) return left;

    let result: StackNode<T> | null = null;

    // Note: Our 'next' is actually 'prev' in stack terminology (Top -> Bottom)
    // We want the 'largest' (or 'smallest' depending on sort) to be at Top.
    // Standard sort: Ascending means Smallest at Bottom, Largest at Top.

    if (compare(left.data, right.data) <= 0) {
      // left is larger/equal (for stack order) or smaller (standard)
      // Let's assume standard sort behavior:
      // compare(10, 5) -> Positive.
      result = left;
      result.prev = this._sortedMerge(left.prev, right, compare);
    } else {
      result = right;
      result.prev = this._sortedMerge(left, right.prev, compare);
    }

    return result;
  }

  private _getMiddle(head: StackNode<T> | null): StackNode<T> | null {
    if (!head) return head;

    let slow: StackNode<T> | null = head;
    let fast = head;

    while (fast.prev && fast.prev.prev) {
      slow = slow?.prev ?? null;
      fast = fast.prev.prev;
    }
    return slow;
  }

  public toString(): string {
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
  public toArray(): T[] {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.prev;
    }
    return result;
  }

  /**
   * Prepares the stack instance for a conversion to a JSON string.
   * Does not work with Symbol and BigInt types.
   * You don't need to call this method explicitly.
   * JSON.stringify() will call it automatically if you pass a stack instance to it.
   */
  public toJSON(): SerializedStack<T> {
    if (this.type === Symbol || this.type === BigInt) {
      throw new TypeError(
        "Symbol and BigInt types cannot be serialized to JSON",
      );
    }

    // We store the data AND the config (limit/type)
    // so we can restore the rules later.
    return {
      array: this.toArray() ?? null,
      limit: this.limit === Infinity ? null : (this.limit ?? null),
      type: this.type ? (getFunctionName(this.type) ?? null) : null,
    };
  }

  /**
   * Creates a new Stack from a JSON string
   * Static Factory Method: Creates a new Stack from a JSON string.
   * If you want to provide a type, you need to pass it as an option.
   * Use an 'inferred' option as a last resort to let the function try to infer the type.
   *
   */
  static fromJSON<U = unknown>(
    text: string,
    options: FromJSONOptions<U> = {},
  ): Stack<U> {
    const { type, validate, inferred, reviver } = options;

    if (type && !primitiveConstructors.has(type) && !isConstructor(type))
      throw new TypeError(
        `Invalid Stack Configuration: 'type' must be a Constructor or Primitive function. Got: ${typeof type}`,
      );

    if (inferred && typeof inferred !== "boolean")
      throw new TypeError(
        `Invalid Stack Configuration: 'inferred' must be a boolean. Got: ${typeof inferred}`,
      );

    if (reviver && typeof reviver !== "function")
      throw new TypeError(
        `Invalid Stack Configuration: 'reviver' must be a function. Got: ${typeof reviver}`,
      );

    if (validate && typeof validate !== "function")
      throw new TypeError(
        `Invalid Stack Configuration: 'validate' must be a function. Got: ${typeof validate}`,
      );

    const data: SerializedStack<U> = JSON.parse(text);

    // Resolve the Type
    // If the user passed a type manually, use it.
    // If not, look at the string in JSON and try to convert it.
    let resolvedType = type ?? null;
    if (!resolvedType && inferred && data.type) {
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
      limit: data.limit ?? undefined,
      type: resolvedType ?? undefined,
      validate: validate ?? undefined,
    });

    // Rebuild the stack
    // The array is [Top, Next, ... Bottom].
    // To restore, we must push Bottom first!
    // So we iterate the array in REVERSE.
    if (Array.isArray(data.array)) {
      const context = data.array;
      for (let i = context.length - 1; i >= 0; i--) {
        let value = context[i];
        // Standard JSON Reviver behavior (with 'this' binding)
        if (reviver) value = reviver.call(context, String(i), value);
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
            if (isConstructor(resolvedType)) {
              value = new (resolvedType as GenericConstructor<U>)(value);
            }
          }
        }

        restored.push(value);
      }
    }

    return restored;
  }

  /**
   * Checks if the type of the data matches the type of the stack.
   *
   * Allow primitives and Classes/Instances
   */
  private _isValidType(data: T): boolean {
    // Case A: No type
    if (this.type === null) return true;

    // Case B: Primitive check
    if (this.type === Number) return typeof data === "number";
    if (this.type === String) return typeof data === "string";
    if (this.type === Boolean) return typeof data === "boolean";
    if (this.type === BigInt) return typeof data === "bigint";
    if (this.type === Symbol) return typeof data === "symbol";

    // Case C: Class/Instance check (passed as Constructor, e.g., Date)
    if (isConstructor(this.type)) return data instanceof this.type;

    return false;
  }
}

// Usage
const stack = new Stack({
  limit: 3,
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
  limit: 10,
  type: Date,
});

// 2. Add items
myStack.push(new Date("2023-01-01"));
myStack.push(new Date("2024-01-01"));

// 3. Save it (Serialize)
const savedData = JSON.stringify(myStack); // This will call toJSON()

// 4. Load it back (Deserialize with Reviver)
const restoredStack = Stack.fromJSON(savedData, {
  type: Date,
  // Example of Reviver function with 'this' usage
  reviver: function (key, val) {
    if (key === "0" && Array.isArray(this)) {
      console.log(this[0]);
    }
    return new Date(val);
  },
});

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

const testStack = new Stack({ limit: 3 });

testStack.push(4);
testStack.push(4);
testStack.push("4erjre");
/* testStack.pop();
testStack.clear().push(1); */

console.log(testStack.toString());

const checkType = new Stack({ type: User, limit: 3 });
const jStr = JSON.stringify(checkType);
const restoredType = Stack.fromJSON(jStr, { inferred: true });

console.dir(restoredType.type);
