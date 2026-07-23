"use client";

import { useState, type ReactNode } from "react";

import Button from "@/components/common/Button/Button";
import FormField from "@/components/common/FormField/FormField";
import Input from "@/components/common/Input/Input";
import PasswordInput from "@/components/common/Input/PasswordInput";
import Textarea from "@/components/common/Input/Textarea";
import Modal from "@/components/common/Modal/Modal";
import Pagination from "@/components/common/Pagination/Pagination";
import Search from "@/components/common/Search/Search";
import Select from "@/components/common/Select/Select";
import { Text } from "@/components/common/Text";
import Toast from "@/components/common/Toast/Toast";
import Image from "next/image";

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section className="border-border-subtle flex flex-col gap-16 border-b pb-32">
    <Text as="h2" variant="lg-semibold" className="text-text-primary">
      {title}
    </Text>
    <div className="flex flex-col gap-16">{children}</div>
  </section>
);

export default function ComponentsTestPage() {
  const [name, setName] = useState("");
  const [showNameError, setShowNameError] = useState(false);

  const [price, setPrice] = useState("");

  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const [description, setDescription] = useState("");
  const [showDescError, setShowDescError] = useState(false);

  const [region, setRegion] = useState<string>("");
  const [showSelectError, setShowSelectError] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(20);

  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  return (
    <div className="relative mx-auto flex max-w-[600px] flex-col gap-40 px-20 py-40">
      <Text as="h1" variant="2xl-bold" className="text-text-primary">
        공통 컴포넌트 테스트
      </Text>

      {/* Input */}
      <Section title="Input">
        <FormField label="이름" labelFor="name">
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해주세요"
            error={showNameError ? "이름은 필수 입력사항입니다." : undefined}
          />
        </FormField>
        <button
          type="button"
          onClick={() => setShowNameError((prev) => !prev)}
          className="text-text-muted text-xs underline"
        >
          에러 상태 토글
        </button>

        <FormField label="숫자만 입력 (numericOnly)" labelFor="price">
          <Input
            id="price"
            numericOnly
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            rightSlot={<span className="text-text-muted">원</span>}
            placeholder="0"
          />
        </FormField>

        <FormField label="비활성화" labelFor="disabled-input">
          <Input id="disabled-input" value="" onChange={() => {}} disabled placeholder="disabled" />
        </FormField>
      </Section>

      {/* PasswordInput */}
      <Section title="PasswordInput">
        <FormField label="비밀번호" labelFor="password">
          <PasswordInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해주세요"
          />
        </FormField>
        <FormField label="비밀번호 확인" labelFor="password-check">
          <PasswordInput
            id="password-check"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            placeholder="비밀번호를 다시 입력해주세요"
            error={
              passwordCheck && passwordCheck !== password
                ? "비밀번호가 일치하지 않습니다."
                : undefined
            }
          />
        </FormField>
      </Section>

      {/* Textarea */}
      <Section title="Textarea">
        <FormField label="설명" labelFor="description">
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="내용을 입력해주세요"
            error={showDescError ? "설명은 필수 입력사항입니다." : undefined}
          />
        </FormField>
        <button
          type="button"
          onClick={() => setShowDescError((prev) => !prev)}
          className="text-text-muted text-xs underline"
        >
          에러 상태 토글
        </button>
      </Section>

      {/* Search */}
      <Section title="Search">
        <div className="flex flex-wrap gap-16">
          <Search size="sm" />
          <Search size="md" />
        </div>
      </Section>

      {/* Button */}
      <Section title="Button">
        <div className="flex flex-wrap items-center gap-12">
          <Button variant="solid" size="sm">
            Primary sm
          </Button>
          <Button
            variant="solid"
            size="md"
            rightIcon={<Image alt="arrow-right" src="/icons/ic_write.svg" width={24} height={24} />}
          >
            Primary md
          </Button>
        </div>
        <div className="flex flex-wrap items-center gap-12">
          <Button variant="outline">Secondary</Button>
          <Button variant="solid" disabled>
            Disabled
          </Button>
        </div>
        <Button variant="solid" fullWidth>
          Full Width
        </Button>
      </Section>

      {/* Select */}
      <Section title="Select">
        <Select
          desc="지역을 선택해주세요"
          size="lg"
          onChange={setRegion}
          error={showSelectError ? "지역을 선택해주세요." : undefined}
        >
          <Select.Option value="seoul">서울</Select.Option>
          <Select.Option value="busan">부산</Select.Option>
          <Select.Option value="incheon">인천</Select.Option>
        </Select>
        <Text variant="sm-medium" className="text-text-muted">
          선택된 값: {region || "(없음)"}
        </Text>
        <button
          type="button"
          onClick={() => setShowSelectError((prev) => !prev)}
          className="text-text-muted text-xs underline"
        >
          에러 상태 토글
        </button>
      </Section>

      {/* Modal */}
      <Section title="Modal">
        <Button variant="solid" onClick={() => setIsModalOpen(true)}>
          모달 열기
        </Button>
        {isModalOpen && (
          <Modal onClose={() => setIsModalOpen(false)}>
            <Modal.Close onClose={() => setIsModalOpen(false)} />
            <Modal.Title>테스트 모달입니다</Modal.Title>
            <Modal.Desc>오버레이 클릭, ESC 키로 닫힐 수 있는지 확인해보세요.</Modal.Desc>
            <Modal.Button variant="solid" onClick={() => setIsModalOpen(false)}>
              확인
            </Modal.Button>
          </Modal>
        )}
      </Section>

      {/* Pagination */}
      <Section title="Pagination">
        <Pagination currentPage={page} pageCount={pageCount} onPageChange={setPage} />
        <Text variant="sm-medium" className="text-text-muted">
          현재 페이지: {page} / 전체 {pageCount}페이지
        </Text>
        <div className="flex gap-8">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPageCount((prev) => Math.max(1, prev - 5))}
          >
            전체 페이지 -5
          </Button>
          <Button variant="outline" size="sm" onClick={() => setPageCount((prev) => prev + 5)}>
            전체 페이지 +5
          </Button>
        </div>
      </Section>

      {/* Toast */}
      <Section title="Toast">
        <div className="flex flex-wrap gap-12">
          <Button
            variant="solid"
            size="sm"
            onClick={() => setToast({ type: "success", message: "링크가 복사되었어요." })}
          >
            토스트 띄우기
          </Button>
        </div>
        {toast && (
          <Toast key={toast.message} onClose={() => setToast(null)}>
            {toast.message}
          </Toast>
        )}
      </Section>
    </div>
  );
}
