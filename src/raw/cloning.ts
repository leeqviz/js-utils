const original = {
  a: undefined,
  a_1: null,
  b: "test-name",
  c: {
    d: () => console.log("I am a function"),
    e: {
      f: 4,
      arr: [1, 2, { g: 4, c: [1, "4", { a: "test" }] }, 3, { g: 5 }],
    },
  },
  d: [1, 2, () => console.log("I am a second function"), 4, 5],
  e: function () {
    return "I am a function too";
  },
  f: true,
  g: Symbol("I am a symbol"),
};

let steps = 0;
function cloneDeep(obj) {
  steps++;
  console.log("Step: ", steps);
  if (obj === null || typeof obj !== "object") {
    console.log("primitive | function | null | undefined: ");
    console.log(obj);
    return obj;
  }

  if (Array.isArray(obj)) {
    console.log("Array: ");
    console.log(obj);
    return obj.map(cloneDeep);
  }

  console.log("Object: ");
  console.log(obj);
  const clonedObj = {};
  for (const key in obj) {
    clonedObj[key] = cloneDeep(obj[key]);
  }

  return clonedObj;
}

const copied = cloneDeep(original);
original.c.d = 5;
console.log(original);
console.log(copied);
