const primitiveConstructors = new Set([
    Number,
    String,
    Boolean,
    BigInt,
    Symbol,
]);
function isConstructor(value) {
    return (typeof value === "function" &&
        value.prototype &&
        value.prototype.constructor &&
        value.prototype.constructor === value &&
        value.prototype.constructor.name);
}
function getFunctionName(value) {
    return typeof value === "function" ? value.name : undefined;
}
/**
 * Checks if the data can be serialized to JSON.
 * You can use it to validate the data before serializing it.
 *
 * Features:
 * - Checks for circular references
 * - Checks for data loss (Functions, Symbols, Undefined)
 * - Checks for data mutation (NaN, Infinity, Map, Set, WeakMap, WeakSet, Error, RegExp)
 * - Checks for data crash (BigInt)
 * - Checks for primitives (Number, String, Boolean, Null)
 * - Checks for custom toJSON() method
 * - Checks for data that can throw an Error
 * - Checks for proxies objects
 * - Checks for restorable data
 */
function isSerializable(data, options = {}) {
    const { isRestorable = false, maxDepth = undefined } = options;
    if (maxDepth &&
        (typeof maxDepth !== "number" ||
            Number.isNaN(maxDepth) ||
            !Number.isInteger(maxDepth) ||
            maxDepth < 0))
        throw new TypeError(`Invalid Stack Configuration: 'maxDepth' must be a positive integer number. Got: ${typeof maxDepth}`);
    function _validateRecursively(value, seen = new WeakSet(), currentDepth = 0) {
        if (currentDepth > (maxDepth ?? Infinity))
            return false;
        // Check for possible data loss (mutation to 'null' or '{}'): undefined, function, symbol, NaN, +-Infinity, and not serializable instances
        if (isRestorable) {
            if (value === undefined ||
                typeof value === "symbol" ||
                typeof value === "function" ||
                value instanceof Error ||
                value instanceof RegExp ||
                value instanceof Map ||
                value instanceof Set ||
                value instanceof WeakMap ||
                value instanceof WeakSet ||
                !Number.isFinite(value))
                return false;
        }
        // Check for possible data crash: BigInt
        if (typeof value === "bigint")
            return false;
        // Check for safe primitive
        if (value === null || typeof value !== "object")
            return true;
        if (isRestorable) {
            // We only allow Plain Objects and Arrays.
            // Anything else (Date, RegExp, Custom Class) loses its prototype.
            const proto = Object.getPrototypeOf(value);
            if (!Array.isArray(value) && proto !== Object.prototype && proto !== null)
                return false;
        }
        // Check for circular references
        if (seen.has(value))
            return false;
        // Add the current value to the seen set
        seen.add(value);
        // Handle the tree of objects and arrays
        try {
            // Check for custom .toJSON()
            if ("toJSON" in value && typeof value.toJSON === "function") {
                // Recurse on the output of toJSON, not the original object
                return _validateRecursively(value.toJSON(), seen, currentDepth + 1);
            }
            if (Array.isArray(value)) {
                for (const item of value) {
                    // Accessing each item in the array
                    if (!_validateRecursively(item, seen, currentDepth + 1))
                        return false;
                }
            }
            else {
                for (const key in value) {
                    if (Object.hasOwn(value, key)) {
                        // Accessing a property or method in the object
                        if (!_validateRecursively(value[key], seen, currentDepth + 1))
                            return false;
                    }
                }
            }
        }
        catch {
            return false;
        }
        finally {
            // Remove from set so we can use the same object in a different valid branch
            seen.delete(value);
        }
        return true;
    }
    return _validateRecursively(data);
}
/**
 * Represents a single node in the stack
 */
class StackNode {
    prev = null; // Pointer to the node below this one
    data; // Data stored in this node
    constructor(data, prev = null) {
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
export class Stack {
    head = null;
    size = 0;
    limit = Infinity;
    type = null;
    validate = null;
    constructor(options = {}) {
        this.head = null;
        this.size = 0;
        const { limit, type, array, validate } = options;
        if (limit &&
            (typeof limit !== "number" ||
                Number.isNaN(limit) ||
                !Number.isInteger(limit) ||
                limit < 0))
            throw new TypeError(`Invalid Stack Configuration: 'limit' must be a positive integer number. Got: ${typeof limit}`);
        this.limit = limit ?? Infinity;
        if (type && !primitiveConstructors.has(type) && !isConstructor(type))
            throw new TypeError(`Invalid Stack Configuration: 'type' must be a constructor or primitive function. Got: ${typeof type}`);
        this.type = type ?? null;
        if (validate && typeof validate !== "function")
            throw new TypeError(`Invalid Stack Configuration: 'validate' must be a function. Got: ${typeof validate}`);
        this.validate = validate ?? null;
        if (array && !Array.isArray(array))
            throw new TypeError(`Invalid Stack Configuration: 'array' must be an array. Got: ${typeof array}`);
        if (array && Array.isArray(array)) {
            for (const item of array) {
                this.push(item);
            }
        }
    }
    /**
     * Add data to the head
     */
    push(data) {
        // Check if stack is full
        if (this.size >= this.limit)
            throw new RangeError("Maximum call stack size exceeded");
        // Check correct type
        if (this.type && !this._isValidType(data))
            throw new TypeError(`Expected ${getFunctionName(this.type)} but got ${typeof data}`);
        // We run this second because it might involve complex logic.
        if (this.validate && !this.validate(data)) {
            throw new Error("Validation Failed: Value rejected by custom validation rule.");
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
    pop() {
        // Stack Underflow case check
        if (this.head === null || this.size === 0)
            return undefined;
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
    peek() {
        if (this.head === null || this.size === 0)
            return undefined;
        return this.head.data;
    }
    /**
     * Clear the stack
     */
    clear() {
        this.head = null;
        this.size = 0;
        return this;
    }
    /**
     * Get the size of the stack
     */
    getSize() {
        return this.size;
    }
    /**
     * Check if the stack is empty
     */
    isEmpty() {
        return this.head === null || this.size === 0;
    }
    /**
     * Check if the stack is full
     */
    isFull() {
        return this.size >= this.limit;
    }
    /**
     * Checks if a specific data exists in the stack.
     * Uses strict equality (===).
     *
     * Time: O(n);
     * Space: O(1);
     */
    contains(data) {
        // Check correct type
        if (this.type && !this._isValidType(data))
            throw new TypeError(`Expected ${getFunctionName(this.type)} but got ${typeof data}`);
        // We run this second because it might involve complex logic.
        if (this.validate && !this.validate(data)) {
            throw new Error("Validation Failed: Value rejected by custom validation rule.");
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
     * Time: O(n);
     * Space: O(n);
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
     */
    sort(compare) {
        if (this.head === null || this.size === 0)
            return this;
        function _compare(first, second) {
            if (first < second)
                return -1;
            if (first > second)
                return 1;
            return 0;
        }
        this.head = this._mergeSort(this.head, compare ?? _compare);
        return this;
    }
    _mergeSort(head, compare) {
        if (!head || !head.prev)
            return head;
        // 1. Split list into two halves
        const middle = this._getMiddle(head);
        const nextToMiddle = middle?.prev ?? null;
        if (middle)
            middle.prev = null; // Break the link
        // 2. Recursive sorting
        const left = this._mergeSort(head, compare);
        const right = this._mergeSort(nextToMiddle, compare);
        // 3. Merge sorted halves
        return this._sortedMerge(left, right, compare);
    }
    _sortedMerge(left, right, compare) {
        if (!left)
            return right;
        if (!right)
            return left;
        let result = null;
        // Note: Our 'next' is actually 'prev' in stack terminology (Top -> Bottom)
        // We want the 'largest' (or 'smallest' depending on sort) to be at Top.
        // Standard sort: Ascending means Smallest at Bottom, Largest at Top.
        if (compare(left.data, right.data) <= 0) {
            // left is larger/equal (for stack order) or smaller (standard)
            // Let's assume standard sort behavior:
            // compare(10, 5) -> Positive.
            result = left;
            result.prev = this._sortedMerge(left.prev, right, compare);
        }
        else {
            result = right;
            result.prev = this._sortedMerge(left, right.prev, compare);
        }
        return result;
    }
    _getMiddle(head) {
        if (!head)
            return head;
        let slow = head;
        let fast = head;
        while (fast.prev && fast.prev.prev) {
            slow = slow?.prev ?? null;
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
     * Prepares the stack instance for a conversion to a JSON string.
     * Does not work with Symbol and BigInt types.
     * You don't need to call this method explicitly.
     * JSON.stringify() will call it automatically if you pass a stack instance to it.
     */
    toJSON() {
        if (this.type === Symbol || this.type === BigInt) {
            throw new TypeError("Symbol and BigInt types cannot be serialized to JSON");
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
    static fromJSON(text, options = {}) {
        const { type, validate, inferred, reviver } = options;
        if (type && !primitiveConstructors.has(type) && !isConstructor(type))
            throw new TypeError(`Invalid Stack Configuration: 'type' must be a Constructor or Primitive function. Got: ${typeof type}`);
        if (inferred && typeof inferred !== "boolean")
            throw new TypeError(`Invalid Stack Configuration: 'inferred' must be a boolean. Got: ${typeof inferred}`);
        if (reviver && typeof reviver !== "function")
            throw new TypeError(`Invalid Stack Configuration: 'reviver' must be a function. Got: ${typeof reviver}`);
        if (validate && typeof validate !== "function")
            throw new TypeError(`Invalid Stack Configuration: 'validate' must be a function. Got: ${typeof validate}`);
        const data = JSON.parse(text);
        // Resolve the Type
        // If the user passed a type manually, use it.
        // If not, look at the string in JSON and try to convert it.
        let resolvedType = type ?? null;
        if (!resolvedType && inferred && data.type) {
            if (data.type === "Number") {
                resolvedType = Number;
            }
            else if (data.type === "String") {
                resolvedType = String;
            }
            else if (data.type === "Boolean") {
                resolvedType = Boolean;
            }
            else if (data.type === "BigInt") {
                resolvedType = BigInt;
            }
            else if (data.type === "Symbol") {
                resolvedType = Symbol;
            }
            else {
                // Try to resolve the type as a last resort (Unsafe)
                const environment = typeof window !== "undefined" ? window : globalThis;
                if (environment) {
                    try {
                        // @ts-ignore
                        resolvedType = environment[data.type] || eval(data.type) || null;
                    }
                    catch {
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
                if (reviver)
                    value = reviver.call(context, String(i), value);
                else if (typeof resolvedType === "function") {
                    if (resolvedType === BigInt ||
                        resolvedType === Symbol ||
                        resolvedType === Number ||
                        resolvedType === String ||
                        resolvedType === Boolean) {
                        value = resolvedType(value);
                    }
                    else {
                        if (isConstructor(resolvedType)) {
                            value = new resolvedType(value);
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
    _isValidType(data) {
        // Case A: No type
        if (this.type === null)
            return true;
        // Case B: Primitive check
        if (this.type === Number)
            return typeof data === "number";
        if (this.type === String)
            return typeof data === "string";
        if (this.type === Boolean)
            return typeof data === "boolean";
        if (this.type === BigInt)
            return typeof data === "bigint";
        if (this.type === Symbol)
            return typeof data === "symbol";
        // Case C: Class/Instance check (passed as Constructor, e.g., Date)
        if (isConstructor(this.type))
            return data instanceof this.type;
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
    id;
    name;
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
    if (a > b)
        return 1; // a > b, swap
    if (a < b)
        return -1; // a < b, don't swap
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
    if (a > b)
        return 1; // a > b, swap
    if (a < b)
        return -1; // a < b, don't swap
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
const data = {
    name: "Alice",
    greet: () => console.log("Hi"), // Function
    id: Symbol("id"), // Symbol
    score: undefined, // Undefined
};
const arr = ["Alice", () => console.log("Hi"), Symbol("id"), undefined];
console.log(isSerializable(data, { isRestorable: true }));
console.log(JSON.stringify(data));
console.log(isSerializable(arr, { isRestorable: true }));
console.log(JSON.stringify(arr));
//# sourceMappingURL=stack.js.map