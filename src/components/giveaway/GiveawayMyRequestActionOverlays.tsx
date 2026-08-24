import Toast from "@/components/common/Toast/Toast";
import GiveawayRequestCancelConfirmModal from "@/components/giveaway/GiveawayRequestCancelConfirmModal";
import GiveawayRequestEditModal from "@/components/giveaway/GiveawayRequestEditModal";
import type { MyGiveawayRequestActions } from "@/hooks/giveaway/useMyGiveawayRequestActions";

interface GiveawayMyRequestActionOverlaysProps {
  actions: MyGiveawayRequestActions;
}

const GiveawayMyRequestActionOverlays = ({ actions }: GiveawayMyRequestActionOverlaysProps) => {
  return (
    <>
      <GiveawayRequestEditModal
        open={actions.requestToEdit !== null}
        request={actions.requestToEdit}
        onClose={actions.closeEdit}
        onSuccess={actions.handleEditSuccess}
      />
      <GiveawayRequestCancelConfirmModal
        open={actions.requestToCancel !== null}
        request={actions.requestToCancel}
        isPending={actions.isCancelPending}
        onClose={actions.closeCancel}
        onConfirm={actions.confirmCancel}
      />
      {actions.toastMessage ? (
        <Toast onClose={actions.closeToast}>{actions.toastMessage}</Toast>
      ) : null}
    </>
  );
};

export default GiveawayMyRequestActionOverlays;
