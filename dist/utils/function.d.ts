export type PrimitiveConstructor = NumberConstructor | StringConstructor | BooleanConstructor | BigIntConstructor | SymbolConstructor;
export type GenericConstructor<T = unknown> = {
    new (...args: any[]): T;
};
export declare const PRIMITIVE_CONSTRUCTORS: Set<Function>;
export declare function isConstructor<T = unknown>(value: T): boolean;
export declare function getFunctionName<T = unknown>(value: T): string | undefined;
//# sourceMappingURL=function.d.ts.map