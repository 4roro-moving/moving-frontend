import Image from "next/image";

import { Text } from "@/components/common/Text";

export default function ReceivedRequestsHeader() {
  return (
    <>
      <header className="border-border-subtle border-b">
        <div className="mx-auto flex h-[54px] max-w-[1600px] items-center justify-between px-24 min-[744px]:px-[72px] lg:h-[88px] lg:px-80">
          <div className="flex items-center gap-32 lg:gap-80">
            <div className="flex items-center gap-8">
              <Image
                src="/icons/moving-logo-icon.svg"
                alt="무빙"
                width={44}
                height={44}
                className="h-32 w-32 lg:h-11 lg:w-11"
              />
              <Image
                src="/icons/moving-logo-text.svg"
                alt=""
                width={68}
                height={35}
                className="hidden h-auto w-[68px] lg:block"
              />
            </div>
            <nav className="hidden items-center gap-40 lg:flex">
              <Text as="span" variant="2lg-bold" className="text-text-primary">
                받은 요청
              </Text>
              <Text as="span" variant="2lg-bold" className="text-text-subtle">
                내 견적 관리
              </Text>
            </nav>
          </div>
          <Text
            as="span"
            variant="md-medium"
            className="text-text-primary lg:text-[length:var(--font-size-18)] lg:leading-[var(--line-height-26)]"
          >
            기사님
          </Text>
        </div>
      </header>

      <div className="border-border-subtle border-b">
        <div className="mx-auto flex h-[54px] max-w-[1200px] items-center px-24 min-[744px]:px-[72px] lg:h-[96px] lg:px-0">
          <Text
            as="h1"
            variant="2lg-semibold"
            className="text-text-primary lg:text-[length:var(--font-size-24)] lg:leading-[var(--line-height-32)]"
          >
            받은 요청
          </Text>
        </div>
      </div>
    </>
  );
}
