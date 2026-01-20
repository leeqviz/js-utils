//@ts-nocheck
function curry(fn) {
    return function curried(...args) {
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        return curried.bind(this, ...args); // Return a new function with the current args bound
    };
}
// Example usage:
function add(a, b, c) {
    return a + b + c;
}
const curriedAdd = curry(add);
console.log(curriedAdd(1)(2)()()()()()()()()(3)); // 6
console.log(curriedAdd(1)(2)(3)); // 6
console.log(curriedAdd(1, 2, 3)); // 6
console.log(curriedAdd(1, 2)(3)); // 6
console.log(curriedAdd(1)(2, 3)); // 6
console.log(curriedAdd(1, 2, 3, 4, 5, 6)); // 6 (extra args ignored)
console.log(curriedAdd()(1)(2)(3)); // 6
console.log(curriedAdd()()()()()(1)(2)(3)()); // Exceptional case
console.log(curriedAdd()()()()()(1, 2, 3)()); // Exceptional case
export {};
//# sourceMappingURL=curry.js.map