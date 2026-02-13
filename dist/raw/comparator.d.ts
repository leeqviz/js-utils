/**
 * This approach allows keys of object to be in different order.
 * But existence of this keys is important!
 * And the order of elements in arrays is important too, so first you will need to sort them!
 * Note that 'null' !== 'undefined'
 * In this approach {} === {}
 */
export declare const objectsAreEqual: <TFirst = unknown, TSecond = unknown>(first: TFirst, second: TSecond) => boolean;
export declare const arraysAreEqual: <TFirst = unknown, TSecond = unknown>(first: TFirst[], second: TSecond[]) => boolean;
//# sourceMappingURL=comparator.d.ts.map