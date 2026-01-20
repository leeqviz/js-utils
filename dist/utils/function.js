export const PRIMITIVE_CONSTRUCTORS = new Set([
    Number,
    String,
    Boolean,
    BigInt,
    Symbol,
]);
export function isConstructor(value) {
    return (typeof value === "function" &&
        value.prototype &&
        value.prototype.constructor &&
        value.prototype.constructor === value &&
        value.prototype.constructor.name);
}
export function getFunctionName(value) {
    return typeof value === "function" ? value.name : undefined;
}
//# sourceMappingURL=function.js.map