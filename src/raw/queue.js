class Queue {
  constructor() {
    this.items = [];
  }

  // Enqueue: Add to the back
  enqueue(element) {
    this.items.push(element);
  }

  // Dequeue: Remove from the front
  dequeue() {
    if (this.items.length === 0) return "Underflow";
    return this.items.shift(); // Warning: O(N) operation
  }

  // Front: View the first element
  front() {
    return this.items[0];
  }
}

// Usage
const queue = new Queue();
queue.enqueue("Alice");
queue.enqueue("Bob");
console.log(queue.dequeue()); // "Alice" (The first one in was the first one out)
