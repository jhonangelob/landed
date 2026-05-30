import { useModalStore } from '#/lib/store/modal'

import DeleteAccountModal from './modals/DeleteAccountModal'
import DeleteApplicationModal from './modals/DeleteApplicationModal'
import ExportFileModal from './modals/ExportFileModal'
import UpdateSubscriptionModal from './modals/UpdateSubscriptionModal'

const noop = () => {}

export function ModalRegistry() {
  const { activeModal, payload, close } = useModalStore()

  const handleClose = (open: boolean) => {
    if (!open) close()
  }

  return (
    <>
      <DeleteAccountModal
        open={activeModal === 'deleteAccount'}
        onOpenChange={handleClose}
        onDelete={payload.deleteAccount?.onDelete ?? noop}
      />
      <DeleteApplicationModal
        open={activeModal === 'deleteApplication'}
        onOpenChange={handleClose}
        id={payload.deleteApplication?.id ?? ''}
        company={payload.deleteApplication?.company ?? ''}
        role={payload.deleteApplication?.role ?? ''}
        stage={payload.deleteApplication?.stage ?? 'spotted'}
        appliedAt={payload.deleteApplication?.appliedAt ?? null}
      />
      <ExportFileModal
        open={activeModal === 'exportFile'}
        onOpenChange={handleClose}
        applicationId={payload.exportFile?.applicationId ?? ''}
      />
      {payload.updateSubscription && (
        <UpdateSubscriptionModal
          open={activeModal === 'updateSubscription'}
          onOpenChange={handleClose}
          currentPlan={payload.updateSubscription.currentPlan}
          newPlan={payload.updateSubscription.newPlan}
        />
      )}
    </>
  )
}
