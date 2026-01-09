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
      type: this.type === null ? null : this._getTypeName(this.type),
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
    return typeof type === "function" ? type.name : type;
  }

  /**
   *
   * @param {T} data
   * @returns
   */
  _isValidType(data) {
    if (this.type === null) return true;

    // Case A: Primitive check (passed as string, e.g., 'number')
    if (this.type === Number) return typeof data === "number";
    if (this.type === String) return typeof data === "string";
    if (this.type === Boolean) return typeof data === "boolean";
    if (this.type === BigInt) return typeof data === "bigint";
    if (this.type === Symbol) return typeof data === "symbol";

    // Case B: Class/Instance check (passed as Constructor, e.g., Date)
    if (
      typeof this.type === "function" &&
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
