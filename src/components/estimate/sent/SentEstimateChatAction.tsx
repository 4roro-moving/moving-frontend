import EstimateChatAction from "@/components/estimate/detail/EstimateChatAction";

interface SentEstimateChatActionProps {
  estimateId: number;
  onClick?: () => void;
}

/**
 * // 2026.08.06 김성현 - [추가] 보낸 견적 상세 채팅방 진입 CTA
 * // 2026.08.06 김성현 - [수정] 공통 EstimateChatAction 재사용
 */
export default function SentEstimateChatAction({
  estimateId,
  onClick,
}: SentEstimateChatActionProps) {
  return <EstimateChatAction estimateId={estimateId} onClick={onClick} />;
}
