export const isNumber = (value) => typeof value === "number"
    ? !isNaN(value) && isFinite(value)
    : typeof value === "string"
        ? value !== "" && !isNaN(parseFloat(value)) && isFinite(parseFloat(value))
        : false;
/**
 * this will show you an error if you have not handled all the cases in a switch statement
 */
export const exhaustiveCheck = (value) => value;
/**
 * to determine if a value is not nullish (undefined or null)
 */
export const isNotNullable = (value) => value !== null && value !== undefined;
//# sourceMappingURL=validator.js.map