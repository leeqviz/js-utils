interface SerializedStack<T = any> {
    array: T[];
    capacity: number | null;
    type: string | null;
}
type StackType<T = any> = {
    new (...args: any[]): T;
} | {
    (...args: any[]): T;
} | NumberConstructor | StringConstructor | BooleanConstructor | BigIntConstructor | SymbolConstructor;
/**
 * Represents a single node in the stack
 */
declare class StackNode<T = any> {
    prev: StackNode<T> | null;
    data: T;
    constructor(data: T, prev?: StackNode<T> | null);
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
export declare class Stack<T = any> {
    head: StackNode<T> | null;
    size: number;
    capacity: number;
    type: StackType<T> | null;
    constructor({ array, capacity, type }?: StackOptions<T>);
    /**
     * Add data to the head
     */
    push(data: T): this;
    /**
     *
     * Remove data from the head
     */
    pop(): T | undefined;
    /**
     *
     * View the head
     */
    peek(): T | undefined;
    /**
     *
     * Clear the stack
     */
    clear(): this;
    /**
     *
     * Get the size of the stack
     */
    getSize(): number;
    /**
     *
     * Check if the stack is empty
     */
    isEmpty(): boolean;
    /**
     *
     * Check if the stack is full
     */
    isFull(): boolean;
    /**
     * Checks if a specific data exists in the stack.
     * Uses strict equality (===).
     *
     * Time: O(n)
     * Space: O(1)
     */
    contains(data: T): boolean;
    /**
     * Finds the first element satisfying a predicate.
     *
     * Time: O(n)
     * Space: O(1)
     */
    find(callback: (data: T) => boolean): T | undefined;
    /**
     * Finds all elements satisfying a predicate.
     *
     * Time: O(n)
     * Space: O(n)
     */
    filter(callback: (data: T) => boolean): T[];
    /**
     * Sorts the stack in place.
     * Rebuilds the stack so that the *last* item in the sorted order ends up at the *Top*.
     */
    sort(compareFn?: (first: T, second: T) => number): this;
    _mergeSort(head: StackNode<T> | null, compare: (first: T, second: T) => number): StackNode<T> | null;
    _sortedMerge(a: StackNode<T> | null, b: StackNode<T> | null, compare: (first: T, second: T) => number): StackNode<T> | null;
    _getMiddle(head: StackNode<T> | null): StackNode<T> | null;
    toString(): string;
    /**
     * Converts the Linked List to a standard Array
     */
    toArray(): T[];
    /**
     * Converts the stack to a JSON string.
     * You don't need to call this method explicitly.
     * JSON.stringify() will call it automatically.
  
     */
    toJSON(): SerializedStack<T>;
    /**
     * Creates a new Stack from a JSON string
     * Static Factory Method: Creates a new Stack from a JSON string.
     * If you want to provide a type, you need to pass it as an option.
     * Use an 'inferred' option as a last resort to let the function try to infer the type.
     *
     */
    static fromJSON<U = any>(str: string, { type, inferred, reviver }?: FromJSONOptions<U>): Stack<U>;
    /**
     *
     * Helper to get a readable name for the error message
     */
    _getTypeName(type: StackType<T>): string | undefined;
    /**
     *
     * @returns
     */
    _isValidType(data: T): boolean;
}
export {};
