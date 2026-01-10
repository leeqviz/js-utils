// 1. The Node: Now has a 'prev' pointer
class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null; // New!
  }
}

// 2. The Doubly Linked List
class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // Push: Add to end (O(1))
  push(value) {
    const newNode = new Node(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode; // Old tail points forward to new node
      newNode.prev = this.tail; // New node points backward to old tail
      this.tail = newNode; // Update tail pointer
    }
    this.length++;
  }

  // Pop: Remove from end (O(1)) - FASTER than Singly Linked List
  pop() {
    if (!this.head) return undefined;

    const removedNode = this.tail;

    if (this.length === 1) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = removedNode.prev; // 1. Step back one node
      this.tail.next = null; // 2. Sever the connection to the old tail
      removedNode.prev = null; // 3. Clean up the removed node
    }

    this.length--;
    return removedNode.value;
  }
}

// Usage
const dll = new DoublyLinkedList();
dll.push("A");
dll.push("B");
dll.push("C");

console.log(dll.pop()); // "C" -> Instant O(1), no traversing needed!
