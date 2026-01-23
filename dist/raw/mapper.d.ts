import type { DynamicEntity } from "./utility-types.js";
/**
 * Compares each property of two objects and returns an object with different properties.
 * If there are no changes, an empty object will be returned
 */
export declare const getChangedProperties: <TFirst extends DynamicEntity = DynamicEntity, TSecond extends DynamicEntity = DynamicEntity>(first: TFirst, second: TSecond) => DynamicEntity<any>;
export declare const deleteUndefinedProperties: <TEntity extends DynamicEntity = DynamicEntity>(obj: TEntity) => {
    [k: string]: any;
};
export declare const numCase: (num: number, words: string[]) => string | undefined;
//# sourceMappingURL=mapper.d.ts.map