import { type GenericConstructor, type PrimitiveConstructor } from "../../utils/function.js";
type AllowedType<T = unknown> = PrimitiveConstructor | GenericConstructor<T>;
export interface LinearStructureOptions<T = unknown> {
    array?: T[] | undefined;
    limit?: number | undefined;
    type?: AllowedType<T> | undefined;
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
    type?: AllowedType<T> | undefined;
    validate?: ((value: T) => boolean) | undefined;
}
export declare abstract class LinearStructureNode<T = unknown> {
    data: T;
    constructor(data: T);
}
export declare abstract class LinearStructure<T = unknown> {
    protected size: number;
    protected readonly limit: number;
    protected readonly type: AllowedType<T> | null;
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
export {};
//# sourceMappingURL=liner-structure.d.ts.map