import { getFunctionName } from "../../utils/function.js";
import {
  LinearStructure,
  LinearStructureNode,
  type LinearStructureFromJSONOptions,
  type LinearStructureOptions,
  type SerializedLinearStructure,
} from "./liner-structure.js";

interface QueueOptions<T = unknown> extends LinearStructureOptions<T> {}
interface SerializedQueue<T = unknown> extends SerializedLinearStructure<T> {}
interface QueueFromJSONOptions<
  T = unknown,
> extends LinearStructureFromJSONOptions<T> {}

/**
 * Represents a single node in the queue
 */
class QueueNode<T = unknown> extends LinearStructureNode<T> {
  public next: QueueNode<T> | null = null; // Pointer to the next node
  constructor(data: T, next: QueueNode<T> | null = null) {
    super(data);
    this.next = next;
  }
}

export class Queue<T = unknown> extends LinearStructure<T> {
  private head: QueueNode<T> | null = null; // Pointer to the head of the queue
  private tail: QueueNode<T> | null = null; // Pointer to the tail of the queue
  constructor(options: QueueOptions<T> = {}) {
    super(options);
    this.head = null;
    this.tail = null;
    const { array } = options;

    if (array && Array.isArray(array)) {
      for (const item of array) {
        this.push(item);
      }
    }
  }

  /**
   * Adds an item to the back of the queue.
   * Time Complexity: O(1)
   */
  public push(item: T): this {
    if (this.size >= this.limit) {
      throw new RangeError("Queue Overflow: Capacity reached");
    }

    // Check correct type
    if (this.type && !this._isValidType(item))
      throw new TypeError(
        `Expected ${getFunctionName(this.type)} but got ${typeof item}`,
      );

    // Validation & Safety Checks
    if (this.validate) {
      const isValid = this.validate(item);

      if (typeof isValid !== "boolean")
        throw new Error(
          `Validator must return a boolean, returned ${typeof isValid}`,
        );

      if (!isValid)
        throw new Error(
          "Validation Failed: Value rejected by custom validation rule.",
        );
    }

    // Create Node
    const node = new QueueNode(item);

    // Check if queue is empty, new node becomes both head and tail
    if (this.tail)
      this.tail.next = node; // If not empty, node in tail points to new node
    else this.head = node; // Queue was empty

    this.tail = node; // New node always becomes the tail
    this.size++;

    return this;
  }

  /**
   * Removes and returns the item from the front.
   * Time Complexity: O(1)
   */
  public shift(): T | undefined {
    if (!this.head) return undefined;

    // Store current head to return later
    const head = this.head;

    // Move head pointer forward to the next node
    this.head = this.head.next;
    this.size--;

    // Cleanup the tail if the head became empty
    if (!this.head) this.tail = null;
    head.next = null; // Free the link to allow GC to clean it up (Optional)

    return head.data;
  }

  /**
   * Peeks at the front item without removing it.
   */
  override peek(): T | undefined {
    return this.head?.data;
  }

  override isEmpty(): boolean {
    return !this.head;
  }

  override clear(): this {
    this.head = null;
    this.tail = null;
    this.size = 0;
    return this;
  }

  override toArray(): T[] {
    const result = [];
    let current = this.head;
    while (current) {
      result.push(current.data);
      current = current.next;
    }
    return result;
  }

  override toString(): string {
    throw new Error("Method not implemented.");
  }
  override toJSON(): SerializedLinearStructure<T> {
    throw new Error("Method not implemented.");
  }
  static fromJSON<U = unknown>(
    text: string,
    options: LinearStructureFromJSONOptions<U>,
  ): LinearStructure<U> {
    throw new Error("Method not implemented.");
  }

  /**
   * Iterator support (allows `for (const item of queue)`)
   */
  *[Symbol.iterator](): Iterator<T> {
    let current = this.head;
    while (current) {
      yield current.data;
      current = current.next;
    }
  }
}
