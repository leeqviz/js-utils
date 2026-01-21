import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { Queue } from "./queue.js"; // Note: Importing from the same place, API is identical
describe("Linked List Queue", () => {
    it("should verify FIFO order", () => {
        const q = new Queue();
        q.push(1);
        q.push(2);
        q.push(3);
        assert.strictEqual(q.shift(), 1); // First In, First Out
        assert.strictEqual(q.shift(), 2);
        assert.strictEqual(q.shift(), 3);
        assert.strictEqual(q.shift(), undefined);
    });
    it("should track size correctly", () => {
        const q = new Queue();
        assert.strictEqual(q.isEmpty(), true);
        q.push("A");
        q.push("B");
        assert.strictEqual(q.getSize(), 2);
        assert.strictEqual(q.peek(), "A"); // Peek doesn't remove
        q.clear();
        assert.strictEqual(q.getSize(), 0);
        assert.strictEqual(q.isEmpty(), true);
    });
    it("should be iterable", () => {
        const q = new Queue();
        q.push(10);
        q.push(20);
        const result = [...q]; // Uses [Symbol.iterator]
        assert.deepStrictEqual(result, [10, 20]);
    });
});
//# sourceMappingURL=queue.test.js.map