/** True when at least one property is present (`null` counts, `undefined` does not). */
export const hasDefinedValues = (value: object): boolean =>
  Object.values(value).some((property) => property !== undefined);
