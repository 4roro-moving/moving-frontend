"use client";

import { useTranslations } from "next-intl";

import { Text } from "@/components/common/Text";

interface AccountSuspensionNoticeProps {
  reason: string;
  onAppealClick?: () => void;
}

/** 정지 로그인과 OAuth 콜백에서 공통으로 사용하는 계정 이용 제한 안내입니다. */
const AccountSuspensionNotice = ({ reason, onAppealClick }: AccountSuspensionNoticeProps) => {
  const t = useTranslations("auth");

  return (
    <div
      className="border-border-error rounded-12 flex w-full flex-col gap-8 border bg-red-100 px-16 py-12 text-left"
      role="alert"
    >
      <Text as="p" variant="md-semibold" className="text-text-error">
        {t("accountSuspendedTitle")}
      </Text>
      <div className="flex flex-col gap-2">
        <Text as="span" variant="xs-medium" className="text-text-description">
          {t("suspensionReasonLabel")}
        </Text>
        <Text as="p" variant="sm-medium" className="text-text-error">
          {reason}
        </Text>
      </div>
      <Text as="p" variant="xs-regular" className="text-text-description">
        {t("accountSuspendedHint")}
      </Text>
      {onAppealClick ? (
        <button type="button" onClick={onAppealClick} className="text-text-brand self-start">
          <Text as="span" variant="sm-semibold">
            {t("suspensionAppealAction")}
          </Text>
        </button>
      ) : null}
    </div>
  );
};

export default AccountSuspensionNotice;
