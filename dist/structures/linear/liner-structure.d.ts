import { type GenericConstructor, type PrimitiveConstructor } from "../../utils/function.js";
export interface LinearStructureOptions<T = unknown> {
    array?: T[] | undefined;
    limit?: number | undefined;
    type?: PrimitiveConstructor | GenericConstructor<T> | undefined;
    validate?: ((item: T) => boolean) | undefined;
}
export interface SerializedLinearStructure<T = unknown> {
    array: T[] | null;
    limit: number | null;
    type: string | null;
}
export interface LinearStructureFromJSONOptions<T = unknown> {
    inferred?: boolean | undefined;
    reviver?: ((this: any, key: string, value: any) => any) | undefined;
    type?: PrimitiveConstructor | GenericConstructor<T> | undefined;
    validate?: ((value: T) => boolean) | undefined;
}
export declare abstract class LinearStructureNode<T = unknown> {
    data: T;
    constructor(data: T);
}
export declare abstract class LinearStructure<T = unknown> {
    protected size: number;
    protected readonly limit: number;
    protected readonly type: PrimitiveConstructor | GenericConstructor<T> | null;
    protected readonly validate: ((value: T) => boolean) | null;
    constructor(options?: LinearStructureOptions<T>);
    abstract isEmpty(): boolean;
    abstract clear(): this;
    abstract peek(): T | undefined;
    abstract toArray(): T[];
    abstract toString(): string;
    abstract toJSON(): SerializedLinearStructure<T>;
    getSize(): number;
    isFull(): boolean;
    protected _isValidType(data: T): boolean;
}
//# sourceMappingURL=liner-structure.d.ts.map