import { isConstructor, PRIMITIVE_CONSTRUCTORS, } from "../../utils/function.js";
export class LinearStructureNode {
    data;
    constructor(data) {
        this.data = data;
    }
}
export class LinearStructure {
    // Shared Configuration
    size = 0;
    limit = 0;
    type = null;
    validate = null;
    constructor(options = {}) {
        this.size = 0;
        const { limit, type, array, validate } = options;
        if (limit &&
            (typeof limit !== "number" ||
                Number.isNaN(limit) ||
                !Number.isInteger(limit) ||
                limit < 0))
            throw new TypeError(`Invalid Configuration: 'limit' must be a positive integer number. Got: ${typeof limit}`);
        this.limit = limit ?? Infinity;
        if (type && !PRIMITIVE_CONSTRUCTORS.has(type) && !isConstructor(type))
            throw new TypeError(`Invalid Configuration: 'type' must be a constructor or primitive function. Got: ${typeof type}`);
        this.type = type ?? null;
        if (validate && (typeof validate !== "function" || validate.length !== 1))
            throw new TypeError(`Invalid Configuration: 'validate' must be a function with one argument. Got: ${typeof validate} with ${validate.length} arguments`);
        this.validate = validate ?? null;
        if (array && !Array.isArray(array))
            throw new TypeError(`Invalid Configuration: 'array' must be an array. Got: ${typeof array}`);
    }
    // --- Shared Logic ---
    // We can implement this once for everyone
    getSize() {
        return this.size;
    }
    isFull() {
        return this.size >= this.limit;
    }
    _isValidType(data) {
        // Case A: No type
        if (!this.type)
            return true;
        // Case B: Primitive check
        if (this.type === Number)
            return typeof data === "number";
        if (this.type === String)
            return typeof data === "string";
        if (this.type === Boolean)
            return typeof data === "boolean";
        if (this.type === BigInt)
            return typeof data === "bigint";
        if (this.type === Symbol)
            return typeof data === "symbol";
        // Case C: Class/Instance check (passed as Constructor, e.g., Date)
        if (isConstructor(this.type))
            return data instanceof this.type;
        return false;
    }
}
//# sourceMappingURL=liner-structure.js.map