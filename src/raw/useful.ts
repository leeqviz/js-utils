// @ts-nocheck
Array.prototype.myMap = function (callback) {
  const result = [];
  for (let i = 0; i < this.length; i++) {
    // Only process indexes that exist (skips sparse array holes)
    if (i in this) {
      result[i] = callback(this[i], i, this);
    }
  }
  return result;
};

// Usage Example
const names = ["alice", "bob"];
const uppercase = names.myMap((name) => name.toUpperCase());
console.log(uppercase); // ['ALICE', 'BOB']

/**
 * Flattens a nested object into a single level.
 * @param {Object} obj - The object to flatten.
 * @param {string} prefix - Internal use for tracking keys during recursion.
 * @param {string} separator - The character used to join keys.
 */
function flattenObject(obj, prefix = "", separator = ".") {
  return Object.keys(obj).reduce((acc, key) => {
    const newKey = prefix ? `${prefix}${separator}${key}` : key;
    const value = obj[key];

    // Check if value is a plain object (not null and not an array)
    if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      Object.assign(acc, flattenObject(value, newKey, separator));
    } else {
      acc[newKey] = value;
    }

    return acc;
  }, {});
}

// Example Usage:
const nested = {
  id: 1,
  info: {
    name: "John",
    address: { city: "New York", zip: 10001 },
  },
};

const flat = flattenObject(nested);
// Result: { "id": 1, "info.name": "John", "info.address.city": "New York", "info.address.zip": 10001 }

function deepFreeze(object) {
  const propertyNames = Object.getOwnPropertyNames(object);
  for (const name of propertyNames) {
    const value = object[name];
    if (value && typeof value === "object" && !Object.isFrozen(value)) {
      deepFreeze(value); // Recursively freeze
    }
  }
  return Object.freeze(object);
}

const compose = (...functions) => {
  return (input) => {
    return functions.reduceRight((acc, fn) => {
      return fn(acc);
    }, input);
  };
};

const add5 = (x) => x + 5;
const multiplyBy3 = (x) => x * 3;
const subtract10 = (x) => x - 10;

const composedFunction = compose(subtract10, multiplyBy3, add5);
const result = composedFunction(7);

console.log(result); // Output: 36
