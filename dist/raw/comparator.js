/**
 * This approach allows keys of object to be in different order.
 * But existence of this keys is important!
 * And the order of elements in arrays is important too, so first you will need to sort them!
 * Note that 'null' !== 'undefined'
 * In this approach {} === {}
 */
// @ts-nocheck
export const objectsAreEqual = (first, second) => first !== null &&
    first !== undefined &&
    typeof first === "object" &&
    second !== null &&
    second !== undefined &&
    typeof second === "object"
    ? Object.keys(first).length === Object.keys(second).length &&
        Object.keys(first).every((key) => objectsAreEqual(first[key], second[key]))
    : first === second; //will be 'false' if first or second types are different (for example 'number' and 'string')
export const arraysAreEqual = (first, second) => first.length === second.length &&
    first.every((element, index) => objectsAreEqual(element, second[index]));
//# sourceMappingURL=comparator.js.map