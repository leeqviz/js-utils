/**
 * use this interface for all entities that hasn't their own types or interfaces
 * analog: Record<PropertyKey, TProp>
 */
export interface DynamicEntity<TProp = any> {
  [key: PropertyKey]: TProp;
}

/**
 * use this generic type to unite all prop values from object into one alias type
 * @example
 * type SomeValuesAlias = ValuesAliasFrom<typeof {a: string, b: number}> // string | number
 */
export type ValuesAliasFrom<TEntity extends DynamicEntity> =
  TEntity[keyof TEntity];

/**
 * use this generic type to unite all prop keys from object into one alias type
 * @example
 * type SomeKeysAlias = KeysAliasFrom<typeof {a: string, b: number}> // "a" | "b"
 */
export type KeysAliasFrom<TEntity extends DynamicEntity> = keyof TEntity;

/**
 * Constructs a type by including null and undefined in T.
 * The opposite of NonNullable<T>
 */
export type Nullable<T = unknown> = T | null | undefined;

/**
 * Constructs a type with all properties of TEntity set to optional and nullish.
 * It is an extension of Partial<TEntity>
 */
export type PartialNullable<TEntity extends DynamicEntity> = {
  [TProp in keyof TEntity]?: Nullable<TEntity[TProp]>;
};
