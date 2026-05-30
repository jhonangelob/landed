import { useModalStore } from '#/lib/store/modal'

import ApplicationLandedModal from './modals/ApplicationLandedModal'
import DeleteAccountModal from './modals/DeleteAccountModal'
import DeleteApplicationModal from './modals/DeleteApplicationModal'
import ExportFileModal from './modals/ExportFileModal'
import UpdateSubscriptionModal from './modals/UpdateSubscriptionModal'
import UsageLimitModal from './modals/UsageLimitModal'

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
      {payload.applicationLanded && (
        <ApplicationLandedModal
          open={activeModal === 'applicationLanded'}
          onOpenChange={handleClose}
          company={payload.applicationLanded.company}
          role={payload.applicationLanded.role}
        />
      )}
      {payload.usageLimit && (
        <UsageLimitModal
          open={activeModal === 'usageLimit'}
          onOpenChange={handleClose}
          reason={payload.usageLimit.reason}
          planId={payload.usageLimit.planId}
          used={payload.usageLimit.used}
          limit={payload.usageLimit.limit}
          resetAt={payload.usageLimit.resetAt}
        />
      )}
    </>
  )
}
