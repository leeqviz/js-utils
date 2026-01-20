interface IsSerializableOptions {
    isRestorable?: boolean | undefined;
    maxDepth?: number | undefined;
}
/**
 * Checks if the data can be serialized to JSON.
 * You can use it to validate the data before serializing it.
 *
 * Features:
 * - Checks for circular references
 * - Checks for data loss (Functions, Symbols, Undefined)
 * - Checks for data mutation (NaN, Infinity, Map, Set, WeakMap, WeakSet, Error, RegExp)
 * - Checks for data crash (BigInt)
 * - Checks for primitives (Number, String, Boolean, Null)
 * - Checks for custom toJSON() method
 * - Checks for data that can throw an Error
 * - Checks for proxies objects
 * - Checks for restorable data
 */
export declare function isSerializable<T = unknown>(data: T, options?: IsSerializableOptions): boolean;
export {};
//# sourceMappingURL=serialization.d.ts.map