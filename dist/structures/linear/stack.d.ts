type PrimitiveConstructor = NumberConstructor | StringConstructor | BooleanConstructor | BigIntConstructor | SymbolConstructor;
type GenericConstructor<T = unknown> = {
    new (...args: any[]): T;
};
type ValidateFunction<T = unknown> = (value: T) => boolean;
type StackType<T = unknown> = PrimitiveConstructor | GenericConstructor<T>;
interface StackOptions<T = unknown> {
    array?: T[];
    capacity?: number;
    type?: StackType<T>;
    validate?: ValidateFunction;
}
interface SerializedStack<T = unknown> {
    array: T[] | null;
    capacity: number | null;
    type: string | null;
}
interface FromJSONOptions<T = unknown> {
    inferred?: boolean;
    reviver?: (this: any, key: string, value: any) => any;
    type?: StackType<T>;
    validate?: ValidateFunction;
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
    readonly capacity: number;
    readonly type: StackType<T> | null;
    readonly validate: ValidateFunction | null;
    constructor(options?: StackOptions<T>);
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
    static fromJSON<U = unknown>(text: string, options?: FromJSONOptions<U>): Stack<U>;
    /**
     * Checks if the type of the data matches the type of the stack.
     *
     * Allow primitives and Classes/Instances
     */
    private _isValidType;
}
export {};
