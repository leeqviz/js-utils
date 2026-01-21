import { LinearStructure, type LinearStructureFromJSONOptions, type LinearStructureOptions, type SerializedLinearStructure } from "./liner-structure.js";
interface QueueOptions<T = unknown> extends LinearStructureOptions<T> {
}
export declare class Queue<T = unknown> extends LinearStructure<T> {
    private head;
    private tail;
    constructor(options?: QueueOptions<T>);
    /**
     * Adds an item to the back of the queue.
     * Time Complexity: O(1)
     */
    push(item: T): this;
    /**
     * Removes and returns the item from the front.
     * Time Complexity: O(1)
     */
    shift(): T | undefined;
    /**
     * Peeks at the front item without removing it.
     */
    peek(): T | undefined;
    isEmpty(): boolean;
    clear(): this;
    toArray(): T[];
    toString(): string;
    toJSON(): SerializedLinearStructure<T>;
    static fromJSON<U = unknown>(text: string, options: LinearStructureFromJSONOptions<U>): LinearStructure<U>;
    /**
     * Iterator support (allows `for (const item of queue)`)
     */
    [Symbol.iterator](): Iterator<T>;
}
export {};
//# sourceMappingURL=queue.d.ts.map