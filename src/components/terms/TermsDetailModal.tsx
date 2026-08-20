"use client";

import { useState } from "react";

import Modal, { RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME } from "@/components/common/Modal/Modal";
import TermsContent from "@/components/terms/TermsContent";
import { cn } from "@/lib/utils/cn";
import type { PublishedTerms } from "@/types/terms";

interface TermsDetailModalProps {
  open: boolean;
  terms: PublishedTerms | null;
  onClose: () => void;
}

const TermsDetailModal = ({ open, terms, onClose }: TermsDetailModalProps) => {
  const [cachedTerms, setCachedTerms] = useState<PublishedTerms | null>(terms);

  if (terms != null && terms !== cachedTerms) {
    setCachedTerms(terms);
  }

  if (!cachedTerms) {
    return null;
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      onExitComplete={() => setCachedTerms(null)}
      presentation="responsive"
      size="lg"
      className={cn(RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME, "gap-24 overflow-hidden xl:gap-32")}
    >
      <div className="flex w-full items-start justify-between gap-12">
        <Modal.Title>{cachedTerms.title}</Modal.Title>
        <Modal.Close onClose={onClose} />
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <TermsContent content={cachedTerms.content} />
      </div>
    </Modal>
  );
};

export default TermsDetailModal;
