/**
 * Compares each property of two objects and returns an object with different properties.
 * If there are no changes, an empty object will be returned
 */
export const getChangedProperties = (first, second) => {
    const changedProperties = {};
    for (const key in second) {
        const initialKey = key;
        if (second[initialKey] !==
            first[initialKey] //will be 'true' if first prop or second prop types are different (for example 'number' and 'string')
        )
            changedProperties[initialKey] =
                second[initialKey];
    }
    return changedProperties;
};
export const deleteUndefinedProperties = (obj) => {
    return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));
};
export const numCase = (num, words) => {
    num = Math.abs(num) % 100;
    const lastDigit = num % 10;
    if (num > 10 && num < 20)
        return words[2];
    if (lastDigit > 1 && lastDigit < 5)
        return words[1];
    if (lastDigit == 1)
        return words[0];
    return words[2];
};
//# sourceMappingURL=mapper.js.map