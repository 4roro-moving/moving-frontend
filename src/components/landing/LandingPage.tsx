import LandingBottomBanner from "@/components/landing/LandingBottomBanner";
import LandingFeatureCompare from "@/components/landing/LandingFeatureCompare";
import LandingFeatureRequest from "@/components/landing/LandingFeatureRequest";
import LandingHero from "@/components/landing/LandingHero";
import LandingMoveTypes from "@/components/landing/LandingMoveTypes";

/**
 * MOVING 랜딩 페이지 (Desktop / Tablet / Mobile)
 * Header/Footer는 AppShell에서 제공
 * 섹션 간 상하 여백은 각 섹션 padding으로 맞춤 (추가 gap 없음)
 * Desktop 고정폭 레이아웃은 xl(1280+)에서 적용
 * // 2026.07.31 정슬기 - [추가]
 * // 2026.08.01 정슬기 - [수정] Desktop 섹션 간격·정렬 점검
 * // 2026.08.01 정슬기 - [수정] Design System img1–img4 (12종) 랜딩 에셋 적용
 */
export default function LandingPage() {
  return (
    <div className="bg-background-default flex w-full flex-col items-stretch">
      <LandingHero />
      <LandingMoveTypes />
      <LandingFeatureRequest />
      <LandingFeatureCompare />
      <LandingBottomBanner />
    </div>
  );
}
