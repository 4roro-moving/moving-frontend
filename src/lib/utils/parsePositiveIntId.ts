/** 라우트 파라미터용 양의 정수 ID. 유효하지 않으면 null */
export function parsePositiveIntId(raw: string): number | null {
  const id = Number(raw);
  if (!Number.isInteger(id) || id <= 0) {
    return null;
  }
  return id;
}
