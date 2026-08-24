export type MyContentType = "review" | "residence-review" | "giveaway";

export type MyContentDomainType = "REVIEW" | "RESIDENCE_REVIEW" | "GIVEAWAY";

export interface MyContentLatestModeration {
  action: "HIDE" | "UNHIDE";
  reason: string | null;
  adminName: string;
  createdAt: string;
}

export interface MyContentDetail {
  contentType: MyContentDomainType;
  id: number;
  isHidden: boolean;
  authorName: string;
  createdAt: string;
  rating: number | null;
  title: string | null;
  body: string;
  meta: string | null;
  latestModeration: MyContentLatestModeration | null;
}

export const MY_CONTENT_TYPES: readonly MyContentType[] = [
  "review",
  "residence-review",
  "giveaway",
] as const;

export function isMyContentType(value: string): value is MyContentType {
  return (MY_CONTENT_TYPES as readonly string[]).includes(value);
}
