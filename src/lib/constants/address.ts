export const ADDRESS_DIRECTION = {
  FROM: "from",
  TO: "to",
} as const;

export type AddressDirection = (typeof ADDRESS_DIRECTION)[keyof typeof ADDRESS_DIRECTION];
