import type { DynamicEntity } from "./utility-types.js";

/**
 * Compares each property of two objects and returns an object with different properties.
 * If there are no changes, an empty object will be returned
 */
export const getChangedProperties = <
  TFirst extends DynamicEntity = DynamicEntity,
  TSecond extends DynamicEntity = DynamicEntity,
>(
  first: TFirst,
  second: TSecond,
) => {
  const changedProperties: DynamicEntity = {};

  for (const key in second) {
    const initialKey = key as unknown as keyof typeof first;
    if (
      (second[initialKey as unknown as keyof typeof second] as unknown) !==
      (first[initialKey as unknown as keyof typeof first] as unknown) //will be 'true' if first prop or second prop types are different (for example 'number' and 'string')
    )
      changedProperties[initialKey] =
        second[initialKey as unknown as keyof typeof second];
  }

  return changedProperties;
};

export const deleteUndefinedProperties = <
  TEntity extends DynamicEntity = DynamicEntity,
>(
  obj: TEntity,
) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v !== undefined),
  );
};

export const numCase = (num: number, words: string[]) => {
  num = Math.abs(num) % 100;
  const lastDigit = num % 10;
  if (num > 10 && num < 20) return words[2];
  if (lastDigit > 1 && lastDigit < 5) return words[1];
  if (lastDigit == 1) return words[0];
  return words[2];
};
