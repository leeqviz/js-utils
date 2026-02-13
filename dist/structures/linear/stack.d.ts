import { LinearStructure, type LinearStructureFromJSONOptions, type LinearStructureOptions, type SerializedLinearStructure } from "./liner-structure.js";
interface StackOptions<T = unknown> extends LinearStructureOptions<T> {
}
interface SerializedStack<T = unknown> extends SerializedLinearStructure<T> {
}
interface StackFromJSONOptions<T = unknown> extends LinearStructureFromJSONOptions<T> {
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
export declare class Stack<T = unknown> extends LinearStructure<T> {
    private head;
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
     * Check if the stack is empty
     */
    isEmpty(): boolean;
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
}
export declare function runExample(): void;
export {};
//# sourceMappingURL=stack.d.ts.map