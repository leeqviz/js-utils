import { type GenericConstructor, type PrimitiveConstructor } from "../../utils/function.js";
type StackType<T = unknown> = PrimitiveConstructor | GenericConstructor<T>;
interface StackOptions<T = unknown> {
    array?: T[] | undefined;
    limit?: number | undefined;
    type?: StackType<T> | undefined;
    validate?: ((value: T) => boolean) | undefined;
}
interface SerializedStack<T = unknown> {
    array: T[] | null;
    limit: number | null;
    type: string | null;
}
interface StackFromJSONOptions<T = unknown> {
    inferred?: boolean | undefined;
    reviver?: ((this: any, key: string, value: any) => any) | undefined;
    type?: StackType<T> | undefined;
    validate?: ((value: T) => boolean) | undefined;
}
/**
 * Represents a single node in the stack
 */
declare class StackNode<T = unknown> {
    prev: StackNode<T> | null;
    data: T;
    constructor(data: T, prev?: StackNode<T> | null);
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
export declare class Stack<T = unknown> {
    head: StackNode<T> | null;
    size: number;
    readonly limit: number;
    readonly type: StackType<T> | null;
    readonly validate: ((value: T) => boolean) | null;
    constructor(options?: StackOptions<T>);
    /**
     * Add data to the head
     */
    push(data: T): this;
    /**
     * Remove data from the head
     */
    pop(): T | undefined;
    /**
     * View the head
     */
    peek(): T | undefined;
    /**
     * Clear the stack
     */
    clear(): this;
    /**
     * Get the size of the stack
     */
    getSize(): number;
    /**
     * Check if the stack is empty
     */
    isEmpty(): boolean;
    /**
     * Check if the stack is full
     */
    isFull(): boolean;
    /**
     * Checks if a specific data exists in the stack.
     * Uses strict equality (===).
     *
     * Time: O(n);
     * Space: O(1);
     */
    contains(data: T): boolean;
    /**
     * Finds the first element satisfying a predicate.
     *
     * Time: O(n);
     * Space: O(1);
     */
    find(callback: (data: T) => boolean): T | undefined;
    /**
     * Finds all elements satisfying a predicate.
     *
     * Time: O(n);
     * Space: O(n);
     */
    filter(callback: (data: T) => boolean): T[];
    /**
     * Sorts the stack in place.
     * Rebuilds the stack so that the *last* item in the sorted order ends up at the *Top*.
     */
    sort(compare?: (first: T, second: T) => number): this;
    private _mergeSort;
    private _sortedMerge;
    private _getMiddle;
    toString(): string;
    /**
     * Converts the Linked List to a standard Array
     */
    toArray(): T[];
    /**
     * Prepares the stack instance for a conversion to a JSON string.
     * Does not work with Symbol and BigInt types.
     * You don't need to call this method explicitly.
     * JSON.stringify() will call it automatically if you pass a stack instance to it.
     */
    toJSON(): SerializedStack<T>;
    /**
     * Creates a new Stack from a JSON string
     * Static Factory Method: Creates a new Stack from a JSON string.
     * If you want to provide a type, you need to pass it as an option.
     * Use an 'inferred' option as a last resort to let the function try to infer the type.
     *
     */
    static fromJSON<U = unknown>(text: string, options?: StackFromJSONOptions<U>): Stack<U>;
    /**
     * Checks if the type of the data matches the type of the stack.
     *
     * Allow primitives and Classes/Instances
     */
    private _isValidType;
}
export declare function runExample(): void;
export {};
//# sourceMappingURL=stack.d.ts.map