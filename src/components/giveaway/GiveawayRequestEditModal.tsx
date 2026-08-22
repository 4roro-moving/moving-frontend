"use client";

import { useState } from "react";

import GiveawayRequestFormModal from "@/components/giveaway/GiveawayRequestFormModal";
import type { MyGiveawayRequestItem } from "@/types/giveaway";

interface GiveawayRequestEditModalProps {
  open: boolean;
  request: MyGiveawayRequestItem | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const GiveawayRequestEditModal = ({
  open,
  request,
  onClose,
  onSuccess,
}: GiveawayRequestEditModalProps) => {
  const [cachedRequest, setCachedRequest] = useState(request);

  if (request !== null && request !== cachedRequest) {
    setCachedRequest(request);
  }

  if (!cachedRequest) {
    return null;
  }

  return (
    <GiveawayRequestFormModal
      open={open}
      mode="edit"
      giveawayId={cachedRequest.giveaway.id}
      request={{ id: cachedRequest.id, message: cachedRequest.message }}
      onClose={onClose}
      onSuccess={onSuccess}
    />
  );
};

export default GiveawayRequestEditModal;
