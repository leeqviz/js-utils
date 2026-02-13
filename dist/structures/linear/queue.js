import { getFunctionName } from "../../utils/function.js";
import { LinearStructure, LinearStructureNode, } from "./liner-structure.js";
/**
 * Represents a single node in the queue
 */
class QueueNode extends LinearStructureNode {
    next = null; // Pointer to the next node
    constructor(data, next = null) {
        super(data);
        this.next = next;
    }
}
export class Queue extends LinearStructure {
    head = null; // Pointer to the head of the queue
    tail = null; // Pointer to the tail of the queue
    constructor(options = {}) {
        super(options);
        this.head = null;
        this.tail = null;
        const { array } = options;
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
        // Validation & Safety Checks
        if (this.validate) {
            const isValid = this.validate(item);
            if (typeof isValid !== "boolean")
                throw new Error(`Validator must return a boolean, returned ${typeof isValid}`);
            if (!isValid)
                throw new Error("Validation Failed: Value rejected by custom validation rule.");
        }
        // Create Node
        const node = new QueueNode(item);
        // Check if queue is empty, new node becomes both head and tail
        if (this.tail)
            this.tail.next = node; // If not empty, node in tail points to new node
        else
            this.head = node; // Queue was empty
        this.tail = node; // New node always becomes the tail
        this.size++;
        return this;
    }
    /**
     * Removes and returns the item from the front.
     * Time Complexity: O(1)
     */
    shift() {
        if (!this.head)
            return undefined;
        // Store current head to return later
        const head = this.head;
        // Move head pointer forward to the next node
        this.head = this.head.next;
        this.size--;
        // Cleanup the tail if the head became empty
        if (!this.head)
            this.tail = null;
        head.next = null; // Free the link to allow GC to clean it up (Optional)
        return head.data;
    }
    /**
     * Peeks at the front item without removing it.
     */
    peek() {
        return this.head?.data;
    }
    isEmpty() {
        return !this.head;
    }
    clear() {
        this.head = null;
        this.tail = null;
        this.size = 0;
        return this;
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
    toString() {
        throw new Error("Method not implemented.");
    }
    toJSON() {
        throw new Error("Method not implemented.");
    }
    static fromJSON(text, options) {
        throw new Error("Method not implemented.");
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
}
//# sourceMappingURL=queue.js.map