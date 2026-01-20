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
export function isSerializable<T = unknown>(
  data: T,
  options: IsSerializableOptions = {},
): boolean {
  const { isRestorable = false, maxDepth = undefined } = options;

  if (
    maxDepth &&
    (typeof maxDepth !== "number" ||
      Number.isNaN(maxDepth) ||
      !Number.isInteger(maxDepth) ||
      maxDepth < 0)
  )
    throw new TypeError(
      `Invalid option: 'maxDepth' must be a positive integer number. Got: ${typeof maxDepth}`,
    );

  function _validate(
    value: unknown,
    seen: WeakSet<object> = new WeakSet<object>(),
    currentDepth: number = 0,
  ): boolean {
    if (currentDepth > (maxDepth ?? Infinity)) return false;

    // Check for possible data loss (mutation to 'null' or '{}'): undefined, function, symbol, NaN, +-Infinity, and not serializable instances
    if (isRestorable) {
      if (
        value === undefined ||
        typeof value === "symbol" ||
        typeof value === "function" ||
        value instanceof Error ||
        value instanceof RegExp ||
        value instanceof Map ||
        value instanceof Set ||
        value instanceof WeakMap ||
        value instanceof WeakSet ||
        !Number.isFinite(value)
      )
        return false;
    }

    // Check for possible data crash: BigInt
    if (typeof value === "bigint") return false;

    // Check for safe primitive
    if (value === null || typeof value !== "object") return true;

    if (isRestorable) {
      // We only allow Plain Objects and Arrays.
      // Anything else (Date, RegExp, Custom Class) loses its prototype.
      const proto = Object.getPrototypeOf(value);
      if (!Array.isArray(value) && proto !== Object.prototype && proto !== null)
        return false;
    }

    // Check for circular references
    if (seen.has(value)) return false;

    // Add the current value to the seen set
    seen.add(value);

    // Handle the tree of objects and arrays
    try {
      // Check for custom .toJSON()
      if ("toJSON" in value && typeof value.toJSON === "function") {
        // Recurse on the output of toJSON, not the original object
        return _validate(value.toJSON(), seen, currentDepth + 1);
      }

      if (Array.isArray(value)) {
        for (const item of value) {
          // Accessing each item in the array
          if (!_validate(item, seen, currentDepth + 1)) return false;
        }
      } else {
        for (const key in value) {
          if (Object.hasOwn(value, key)) {
            // Accessing a property or method in the object
            if (
              !_validate(
                value[key as keyof typeof value],
                seen,
                currentDepth + 1,
              )
            )
              return false;
          }
        }
      }
    } catch {
      return false;
    } finally {
      // Remove from set so we can use the same object in a different valid branch
      seen.delete(value);
    }

    return true;
  }

  return _validate(data);
}

export function runExample() {
  const data = {
    name: "Alice",
    greet: () => console.log("Hi"), // Function
    id: Symbol("id"), // Symbol
    score: undefined, // Undefined
  };

  const arr = ["Alice", () => console.log("Hi"), Symbol("id"), undefined];

  console.log(isSerializable(data, { isRestorable: true }));
  console.log(JSON.stringify(data));
  console.log(isSerializable(arr, { isRestorable: true }));
  console.log(JSON.stringify(arr));
}
