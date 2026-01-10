// 1. The Node: A simple container for data
class Node {
  constructor(value) {
    this.value = value;
    this.next = null; // Pointer to the next node
  }
}

// 2. The List: Managing the pointers
class LinkedListQueue {
  constructor() {
    this.head = null; // Start of the line
    this.tail = null; // End of the line
    this.length = 0;
  }

  // Enqueue: Add to the back (O(1))
  enqueue(value) {
    const newNode = new Node(value);

    if (!this.head) {
      // If list is empty, new node is both head and tail
      this.head = newNode;
      this.tail = newNode;
    } else {
      // Point the current tail to the new node...
      this.tail.next = newNode;
      // ...and update the tail pointer to the new node
      this.tail = newNode;
    }
    this.length++;
  }

  // Dequeue: Remove from the front (O(1)) - The Magic Part!
  dequeue() {
    if (!this.head) return null; // Queue is empty

    const removedNode = this.head; // Save the current head
    this.head = this.head.next; // Move the head pointer to the next node

    // If the list is now empty, reset the tail too
    if (!this.head) {
      this.tail = null;
    }

    this.length--;
    return removedNode.value;
  }
}

// Usage
const fastQueue = new LinkedListQueue();
fastQueue.enqueue("Alice");
fastQueue.enqueue("Bob");
fastQueue.enqueue("Charlie");

console.log(fastQueue.dequeue()); // "Alice" -> Instant! No shifting required.
console.log(fastQueue.dequeue()); // "Bob"
