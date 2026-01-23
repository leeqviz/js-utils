export declare const isNumber: <TValue = unknown>(value: TValue) => boolean;
/**
 * this will show you an error if you have not handled all the cases in a switch statement
 */
export declare const exhaustiveCheck: (value: never) => never;
/**
 * to determine if a value is not nullish (undefined or null)
 */
export declare const isNotNullable: <TValue = unknown>(value: TValue) => value is TValue & {};
//# sourceMappingURL=validator.d.ts.map