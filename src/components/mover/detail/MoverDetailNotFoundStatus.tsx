import EmptyState from "@/components/common/EmptyState/EmptyState";

/** 잘못된 URL / 존재하지 않는 기사 공통 안내 UI */
export default function MoverDetailNotFoundStatus() {
  return (
    <div className="bg-background-default flex w-full flex-1 flex-col items-center justify-center">
      <EmptyState
        size="sm"
        imageSrc="/images/empty/character.png"
        description={
          <>
            기사님을 찾을 수 없습니다.
            <br />
            주소가 잘못되었거나, 존재하지 않는 기사님입니다.
          </>
        }
        buttonLabel="기사님 찾기로 돌아가기"
        href="/movers"
      />
    </div>
  );
}
