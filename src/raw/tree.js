class Node {
  constructor(value) {
    this.value = value;
    this.left = null;
    this.right = null;
  }
}

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  // Insert a value
  insert(value) {
    const newNode = new Node(value);

    if (this.root === null) {
      this.root = newNode;
      return this;
    }

    let current = this.root;
    while (true) {
      if (value === current.value) return undefined; // No duplicates allowed

      // If value is smaller, go Left
      if (value < current.value) {
        if (current.left === null) {
          current.left = newNode;
          return this;
        }
        current = current.left;
      }
      // If value is larger, go Right
      else {
        if (current.right === null) {
          current.right = newNode;
          return this;
        }
        current = current.right;
      }
    }
  }

  // Find a value (The Magic Part)
  contains(value) {
    if (this.root === null) return false;

    let current = this.root;

    while (current) {
      if (value < current.value) {
        current = current.left; // Go Left
      } else if (value > current.value) {
        current = current.right; // Go Right
      } else {
        return true; // Found it!
      }
    }
    return false;
  }
}

// Usage
const tree = new BinarySearchTree();
tree.insert(10);
tree.insert(5);
tree.insert(13);
tree.insert(2);
tree.insert(7);

//    10
//   /  \
//  5    13
// / \
// 2  7

console.log(tree.contains(7)); // true
console.log(tree.contains(99)); // false
