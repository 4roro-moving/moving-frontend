"use client";

import Modal, { RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME } from "@/components/common/Modal/Modal";
import TermsContent from "@/components/terms/TermsContent";
import { cn } from "@/lib/utils/cn";
import type { PublishedTerms } from "@/types/terms";

interface TermsDetailModalProps {
  open: boolean;
  terms: PublishedTerms | null;
  onClose: () => void;
}

const TermsDetailModal = ({ open, terms, onClose }: TermsDetailModalProps) => (
  <Modal
    open={open && terms !== null}
    onClose={onClose}
    presentation="responsive"
    size="lg"
    className={cn(RESPONSIVE_FORM_MODAL_PANEL_CLASSNAME, "gap-24 overflow-hidden xl:gap-32")}
  >
    <div className="flex w-full items-start justify-between gap-12">
      <Modal.Title>{terms?.title ?? "약관"}</Modal.Title>
      <Modal.Close onClose={onClose} />
    </div>
    {terms ? (
      <div className="min-h-0 flex-1 overflow-y-auto">
        <TermsContent content={terms.content} />
      </div>
    ) : null}
  </Modal>
);

export default TermsDetailModal;
