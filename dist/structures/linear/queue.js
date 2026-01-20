import { getFunctionName, isConstructor, PRIMITIVE_CONSTRUCTORS, } from "../../utils/function.js";
/**
 * Represents a single node in the queue
 */
class QueueNode {
    next = null; // Pointer to the next node
    data; // Data stored in this node
    constructor(data, next = null) {
        this.data = data;
        this.next = next;
    }
}
export class Queue {
    head = null; // Pointer to the head of the queue
    tail = null; // Pointer to the tail of the queue
    size = 0; // Number of elements in the queue
    limit = Infinity;
    type = null;
    validate = null;
    constructor(options = {}) {
        this.head = null;
        this.tail = null;
        this.size = 0;
        const { limit, type, array, validate } = options;
        if (limit &&
            (typeof limit !== "number" ||
                Number.isNaN(limit) ||
                !Number.isInteger(limit) ||
                limit < 0))
            throw new TypeError(`Invalid Queue Configuration: 'limit' must be a positive integer number. Got: ${typeof limit}`);
        this.limit = limit ?? Infinity;
        if (type && !PRIMITIVE_CONSTRUCTORS.has(type) && !isConstructor(type))
            throw new TypeError(`Invalid Queue Configuration: 'type' must be a constructor or primitive function. Got: ${typeof type}`);
        this.type = type ?? null;
        if (validate && (typeof validate !== "function" || validate.length !== 1))
            throw new TypeError(`Invalid Queue Configuration: 'validate' must be a function with one argument. Got: ${typeof validate} with ${validate.length} arguments`);
        this.validate = validate ?? null;
        if (array && !Array.isArray(array))
            throw new TypeError(`Invalid Queue Configuration: 'array' must be an array. Got: ${typeof array}`);
        if (array && Array.isArray(array)) {
            for (const item of array) {
                this.push(item);
            }
        }
    }
    /**
     * Adds an item to the back of the queue.
     * Time Complexity: O(1)
     */
    push(item) {
        if (this.size >= this.limit) {
            throw new RangeError("Queue Overflow: Capacity reached");
        }
        // Check correct type
        if (this.type && !this._isValidType(item))
            throw new TypeError(`Expected ${getFunctionName(this.type)} but got ${typeof item}`);
        // 1. Validation & Safety Checks
        if (this.validate) {
            const isValid = this.validate(item);
            if (typeof isValid !== "boolean")
                throw new Error(`Validator must return a boolean, returned ${typeof isValid}`);
            if (!isValid)
                throw new Error("Validation Failed: Value rejected by custom validation rule.");
        }
        // 2. Create Node
        const node = new QueueNode(item);
        // 3. Link it
        if (this.tail) {
            this.tail.next = node; // Old tail points to new node
            this.tail = node; // New node becomes the tail
        }
        else {
            // Queue was empty
            this.head = node;
            this.tail = node;
        }
        this.size++;
        return this;
    }
    /**
     * Removes and returns the item from the front.
     * Time Complexity: O(1)
     */
    shift() {
        if (!this.head) {
            return undefined;
        }
        // 1. Save value
        const item = this.head.data;
        // 2. Move head forward
        this.head = this.head.next;
        this.size--;
        // 3. Cleanup if empty
        if (this.head === null) {
            this.tail = null;
        }
        return item;
    }
    /**
     * Peeks at the front item without removing it.
     */
    peek() {
        return this.head?.data;
    }
    isEmpty() {
        return this.size === 0;
    }
    clear() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        return this;
    }
    isFull() {
        return this.size >= this.limit;
    }
    toArray() {
        const result = [];
        let current = this.head;
        while (current) {
            result.push(current.data);
            current = current.next;
        }
        return result;
    }
    /**
     * Iterator support (allows `for (const item of queue)`)
     */
    *[Symbol.iterator]() {
        let current = this.head;
        while (current) {
            yield current.data;
            current = current.next;
        }
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
//# sourceMappingURL=queue.js.map