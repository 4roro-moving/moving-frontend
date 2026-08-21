export type SearchParamsInput = Record<string, string | string[] | undefined>;

export const getSearchParam = (
  searchParams: SearchParamsInput,
  key: string,
): string | undefined => {
  const value = searchParams[key];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
};

export const parseAllowedValue = <TValue extends string>(
  value: string | undefined,
  allowed: ReadonlySet<string>,
  fallback: TValue,
): TValue => {
  if (value && allowed.has(value)) {
    return value as TValue;
  }
  return fallback;
};

export const parseFilterValue = (
  value: string | undefined,
  allowed: ReadonlySet<string>,
  allValue: string,
): string => {
  if (!value || value === allValue) {
    return allValue;
  }
  if (allowed.has(value)) {
    return value;
  }
  return allValue;
};

export const parseKeywordParam = (
  value: string | undefined,
  options: { fallback?: string; maxLength?: number } = {},
): string => {
  const keyword = value?.trim() ?? options.fallback ?? "";
  return options.maxLength === undefined ? keyword : keyword.slice(0, options.maxLength);
};
