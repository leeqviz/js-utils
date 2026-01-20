export type PrimitiveConstructor =
  | NumberConstructor
  | StringConstructor
  | BooleanConstructor
  | BigIntConstructor
  | SymbolConstructor;

export type GenericConstructor<T = unknown> = { new (...args: any[]): T };

export const PRIMITIVE_CONSTRUCTORS = new Set<Function>([
  Number,
  String,
  Boolean,
  BigInt,
  Symbol,
]);

export function isConstructor<T = unknown>(value: T): boolean {
  return (
    typeof value === "function" &&
    value.prototype &&
    value.prototype.constructor &&
    value.prototype.constructor === value &&
    value.prototype.constructor.name
  );
}

export function getFunctionName<T = unknown>(value: T): string | undefined {
  return typeof value === "function" ? value.name : undefined;
}
