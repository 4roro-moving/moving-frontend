import { describe, expect, it } from "vitest";

import { getRegionIdByAdministrativeCode } from "./administrativeCode";

describe("getRegionIdByAdministrativeCode", () => {
  it("통합 특별시 안의 기존 전남 권역을 전남으로 분류한다", () => {
    expect(getRegionIdByAdministrativeCode("1213057000")).toBe(14);
    expect(getRegionIdByAdministrativeCode("1217051000")).toBe(14);
  });

  it("통합 특별시 안의 기존 광주 권역을 광주로 분류한다", () => {
    expect(getRegionIdByAdministrativeCode("1221052500")).toBe(5);
  });

  it("기존 광역 행정코드를 서비스 지역으로 분류한다", () => {
    expect(getRegionIdByAdministrativeCode("1168010100")).toBe(1);
    expect(getRegionIdByAdministrativeCode("4111514100")).toBe(9);
  });

  it("알 수 없거나 유효하지 않은 코드는 null을 반환한다", () => {
    expect(getRegionIdByAdministrativeCode("")).toBe(null);
    expect(getRegionIdByAdministrativeCode("9999999999")).toBe(null);
  });
});
