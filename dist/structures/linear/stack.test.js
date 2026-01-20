import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Stack } from "./stack.js"; // Remember the .js extension!
describe("Stack Implementation", () => {
    it("should push and pop items", () => {
        const stack = new Stack();
        stack.push(10);
        stack.push(20);
        assert.strictEqual(stack.pop(), 20);
        assert.strictEqual(stack.pop(), 10);
        assert.strictEqual(stack.pop(), undefined);
    });
    it("should be robust", () => {
        const stack = new Stack({ type: Number });
        // assert.throws checks if function throws error
        assert.throws(() => {
            // @ts-expect-error Testing runtime safety against strict type
            stack.push(100n);
        }, /Expected/);
    });
});
//# sourceMappingURL=stack.test.js.map