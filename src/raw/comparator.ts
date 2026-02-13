/**
 * This approach allows keys of object to be in different order.
 * But existence of this keys is important!
 * And the order of elements in arrays is important too, so first you will need to sort them!
 * Note that 'null' !== 'undefined'
 * In this approach {} === {}
 */
// @ts-nocheck

export const objectsAreEqual = <TFirst = unknown, TSecond = unknown>(
  first: TFirst,
  second: TSecond,
): boolean =>
  first !== null &&
  first !== undefined &&
  typeof first === "object" &&
  second !== null &&
  second !== undefined &&
  typeof second === "object"
    ? Object.keys(first).length === Object.keys(second).length &&
      Object.keys(first).every((key) =>
        objectsAreEqual<TFirst[keyof TFirst], TSecond[keyof TSecond]>(
          first[key as keyof typeof first],
          second[key as keyof typeof second],
        ),
      )
    : (first as unknown) === (second as unknown); //will be 'false' if first or second types are different (for example 'number' and 'string')

export const arraysAreEqual = <TFirst = unknown, TSecond = unknown>(
  first: TFirst[],
  second: TSecond[],
): boolean =>
  first.length === second.length &&
  first.every((element, index) =>
    objectsAreEqual<TFirst, TSecond>(element, second[index]),
  );
