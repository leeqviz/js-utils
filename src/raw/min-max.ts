function findMax<T = any>(arr: T[]) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return null; // Return null for invalid input
  }

  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== null && typeof arr[i] === "number" && arr[i] > max) {
      max = arr[i];
    }
  }

  return max;
}

function findMin<T = any>(arr: T[]) {
  if (!Array.isArray(arr) || arr.length === 0) {
    return null; // Return null for invalid input
  }

  let min = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] !== null && typeof arr[i] === "number" && arr[i] < min) {
      min = arr[i];
    }
  }

  return min;
}

console.log("findMin tests:");
console.log(findMin([3, 5, 7, 2, 8])); // 2
console.log(findMin([-10, -5, -3, -1])); // -10
console.log(findMin([1, 2, null, 4, 5])); // 1
console.log(findMin([])); // null
// @ts-ignore
console.log(findMin("not an array")); // null
console.log("findMax tests:");
console.log(findMax([3, 5, 7, 2, 8])); // 8
console.log(findMax([-10, -5, -3, -1])); // -1
console.log(findMax([1, 2, null, 4, 5])); // 5
console.log(findMax([])); // null
// @ts-ignore
console.log(findMax("not an array")); // null
