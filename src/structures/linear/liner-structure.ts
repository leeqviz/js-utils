import {
  isConstructor,
  PRIMITIVE_CONSTRUCTORS,
  type GenericConstructor,
  type PrimitiveConstructor,
} from "../../utils/function.js";

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

export abstract class LinearStructureNode<T = unknown> {
  public data: T;
  constructor(data: T) {
    this.data = data;
  }
}

export abstract class LinearStructure<T = unknown> {
  // Shared Configuration
  protected size: number = 0;
  protected readonly limit: number = 0;
  protected readonly type: PrimitiveConstructor | GenericConstructor<T> | null =
    null;
  protected readonly validate: ((value: T) => boolean) | null = null;

  constructor(options: LinearStructureOptions<T> = {}) {
    this.size = 0;
    const { limit, type, array, validate } = options;

    if (
      limit &&
      (typeof limit !== "number" ||
        Number.isNaN(limit) ||
        !Number.isInteger(limit) ||
        limit < 0)
    )
      throw new TypeError(
        `Invalid Configuration: 'limit' must be a positive integer number. Got: ${typeof limit}`,
      );
    this.limit = limit ?? Infinity;

    if (type && !PRIMITIVE_CONSTRUCTORS.has(type) && !isConstructor(type))
      throw new TypeError(
        `Invalid Configuration: 'type' must be a constructor or primitive function. Got: ${typeof type}`,
      );
    this.type = type ?? null;

    if (validate && (typeof validate !== "function" || validate.length !== 1))
      throw new TypeError(
        `Invalid Configuration: 'validate' must be a function with one argument. Got: ${typeof validate} with ${validate.length} arguments`,
      );
    this.validate = validate ?? null;

    if (array && !Array.isArray(array))
      throw new TypeError(
        `Invalid Configuration: 'array' must be an array. Got: ${typeof array}`,
      );
  }

  // --- Abstract Contracts ---
  // Children MUST implement these methods
  abstract isEmpty(): boolean;
  abstract clear(): this;
  abstract peek(): T | undefined;
  abstract toArray(): T[];
  abstract toString(): string;
  abstract toJSON(): SerializedLinearStructure<T>;

  // --- Shared Logic ---
  // We can implement this once for everyone
  public getSize(): number {
    return this.size;
  }
  public isFull(): boolean {
    return this.size >= this.limit;
  }
  protected _isValidType(data: T): boolean {
    // Case A: No type
    if (!this.type) return true;

    // Case B: Primitive check
    if (this.type === Number) return typeof data === "number";
    if (this.type === String) return typeof data === "string";
    if (this.type === Boolean) return typeof data === "boolean";
    if (this.type === BigInt) return typeof data === "bigint";
    if (this.type === Symbol) return typeof data === "symbol";

    // Case C: Class/Instance check (passed as Constructor, e.g., Date)
    if (isConstructor(this.type)) return data instanceof this.type;

    return false;
  }
}
