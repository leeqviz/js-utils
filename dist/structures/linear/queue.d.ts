import { type GenericConstructor, type PrimitiveConstructor } from "../../utils/function.js";
type QueueType<T = unknown> = PrimitiveConstructor | GenericConstructor<T>;
interface QueueOptions<T = unknown> {
    array?: T[] | undefined;
    limit?: number | undefined;
    type?: QueueType<T> | undefined;
    validate?: ((value: T) => boolean) | undefined;
}
/**
 * Represents a single node in the queue
 */
declare class QueueNode<T = unknown> {
    next: QueueNode<T> | null;
    data: T;
    constructor(data: T, next?: QueueNode<T> | null);
}
export declare class Queue<T = unknown> {
    head: QueueNode<T> | null;
    tail: QueueNode<T> | null;
    size: number;
    readonly limit: number;
    readonly type: QueueType<T> | null;
    readonly validate: ((value: T) => boolean) | null;
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
    isFull(): boolean;
    toArray(): T[];
    /**
     * Iterator support (allows `for (const item of queue)`)
     */
    [Symbol.iterator](): Iterator<T>;
    /**
     * Checks if the type of the data matches the type of the stack.
     *
     * Allow primitives and Classes/Instances
     */
    private _isValidType;
}
export {};
//# sourceMappingURL=queue.d.ts.map