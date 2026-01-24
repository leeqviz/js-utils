// @ts-nocheck
function sumArray(arr) {
  if (!Array.isArray(arr)) return 0;
  let sum = 0;
  for (let i = 0; i < arr.length; i++) {
    if (i in arr && typeof arr[i] === "number") {
      sum += arr[i];
    }
  }
  return sum;
}

console.log(sumArray([1, 2, , , , , 3.4, 4.0012, ",ww", 5]));

function isPalindrome(str) {
  if (typeof str !== "string") return false;
  const normalized = str.toLowerCase().replace(/[^a-z0-9]/g, "");
  for (let i = 0; i <= normalized.length / 2; i++) {
    if (normalized[i] !== normalized[normalized.length - 1 - i]) {
      return false;
    }
  }
  return true;
}

console.log(isPalindrome("he, l eh"));

function reverseStr(str) {
  if (typeof str !== "string") return "";
  let reversed = "";
  for (let i = str.length - 1; i >= 0; i--) {
    reversed += str[i];
  }
  return reversed;
}

console.log(reverseStr("hello"));

function findMaxDiff(arr) {
  if (!Array.isArray(arr) || arr.length < 2) return 0;

  // defaults
  let min = null;
  let max = null;
  if (0 in arr && typeof arr[0] === "number") {
    min = arr[0];
    max = arr[0];
  }

  for (let i = 1; i < arr.length; i++) {
    if (i in arr && typeof arr[i] === "number") {
      if (min === null || arr[i] < min) min = arr[i];
      if (max === null || arr[i] > max) max = arr[i];
    }
  }
  return max - min;
}

console.log(findMaxDiff([, , , 1, "qwq", 2, 3, 4, 5]));

function factorial(n) {
  if (n === 0) return 1;

  let res = 1;
  for (let i = 1; i <= n; i++) {
    res *= i;
  }

  return res;
}

console.log(factorial(5));

function fibonacciSequence(n) {
  if (n === 0) return [];
  if (n === 1) return [0];

  const sequence = [0, 1];
  for (let i = 2; i < n; i++) {
    sequence.push(sequence[i - 1] + sequence[i - 2]);
  }
  return sequence;
}

console.log(fibonacciSequence(10));

function arrayToObject(arr) {
  if (!Array.isArray(arr)) return {};
  const obj = {};
  for (let i = 0; i < arr.length; i++) {
    if (i in arr) {
      obj[i] = arr[i];
    }
  }
  return obj;
}

console.log(arrayToObject([1, 2, 3, 4, 5]));

function isAnagram(str1, str2) {
  if (typeof str1 !== "string" || typeof str2 !== "string") return false;
  if (str1.length !== str2.length) return false;

  const charCounts = {};

  for (let char of str1) {
    charCounts[char] = (charCounts[char] || 0) + 1;
  }

  for (let char of str2) {
    if (!charCounts[char] || charCounts[char] < 0) return false;
    charCounts[char] -= 1;
  }

  return true;
}

console.log(isAnagram("hello, r", "e, rhllo"));

// Private variable example
function createCounter() {
  // `count` is the private variable. It is only accessible within this function.
  let count = 0;

  // The function returns an object with methods.
  // These methods are the only way to interact with the private `count` variable.
  return {
    // The `increment` method has access to `count` through the closure.
    increment: function () {
      count++;
      console.log(`Count incremented to: ${count}`);
    },
    // The `getValue` method also has access to `count`.
    getValue: function () {
      return count;
    },
  };
}

function mergeWithoutDuplicates(arr1, arr2) {
  // Use the spread operator to combine the elements of both arrays.
  const mergedArray = [...arr1, ...arr2];

  // A Set can only hold unique values. We use it to automatically remove duplicates.
  const uniqueElements = new Set(mergedArray);

  // Convert the Set back into a new array using the spread operator.
  return [...uniqueElements];
}

function flatten(arr) {
  let result = [];
  arr.forEach((item) => {
    if (Array.isArray(item)) {
      // Recursively flatten and push elements to the results
      result.push(...flatten(item));
    } else {
      result.push(item);
    }
  });
  return result;
}

console.log(flatten([1, 2, [3, 4], [5, [6, 7]]]));

function flattenIterative(input) {
  const stack = [...input];
  const res = [];
  while (stack.length) {
    const next = stack.pop();
    if (Array.isArray(next)) {
      // Push back array items to process them in the next iteration
      stack.push(...next);
    } else {
      res.push(next);
    }
  }
  // Reverse to restore the original order because we used pop()
  return res.reverse();
}

console.log(flattenIterative([1, 2, [3, 4], [5, [6, 7]]]));

function deepEqual(val1, val2) {
  // 1. Base Case: Strict equality for primitives and identical references
  if (val1 === val2) return true;

  // 2. Handle nulls and different types (typeof null is 'object')
  if (
    val1 === null ||
    val2 === null ||
    typeof val1 !== "object" ||
    typeof val2 !== "object"
  ) {
    return val1 === val2;
  }

  // 3. Handle Arrays: Must check if both are arrays and have same length
  const isArr1 = Array.isArray(val1);
  const isArr2 = Array.isArray(val2);
  if (isArr1 !== isArr2) return false;

  if (isArr1 && isArr2) {
    if (val1.length !== val2.length) return false;
    for (let i = 0; i < val1.length; i++) {
      if (!deepEqual(val1[i], val2[i])) return false;
    }
    return true;
  }

  // 4. Handle Objects: Compare keys and their recursive values
  const keys1 = Object.keys(val1);
  const keys2 = Object.keys(val2);

  if (keys1.length !== keys2.length) return false;

  for (let key of keys1) {
    // Ensure key exists in both objects and values are deeply equal
    if (!val2.hasOwnProperty(key) || !deepEqual(val1[key], val2[key])) {
      return false;
    }
  }

  return true;
}

console.log(deepEqual({ a: 1 }, { a: 1 }));

function chunkArray(arr, chunkSize) {
  const result = [];

  for (let i = 0; i < arr.length; i += chunkSize) {
    // slice(start, end) takes elements from 'i' up to but not including 'i + chunkSize'
    const chunk = arr.slice(i, i + chunkSize);
    result.push(chunk);
  }

  return result;
}

// Example usage:
const data = [1, 2, 3, 4, 5, 6, 7, 8];
console.log(chunkArray(data, 3));
// Output: [[1, 2, 3], [4, 5, 6], [7, 8]]

const chunkArrayV2 = (arr, size) =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );

function deepMerge(obj1, obj2) {
  const result = structuredClone(obj1);

  for (const key in obj2) {
    const v1 = result[key];
    const v2 = obj2[key];

    if (
      v1 !== null &&
      typeof v1 === "object" &&
      !Array.isArray(v1) &&
      v2 !== null &&
      typeof v2 === "object" &&
      !Array.isArray(v2)
    ) {
      result[key] = deepMerge(v1, v2);
    } else if (Array.isArray(v1) && Array.isArray(v2)) {
      result[key] = [...v1, ...v2];
    } else {
      result[key] = v2 !== undefined ? structuredClone(v2) : undefined;
    }
  }

  return result;
}

console.log(deepMerge({ a: { b: 1 }, c: 3 }, { a: { b: 2 }, d: [4] }));
