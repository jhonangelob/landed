import { useModalStore } from '#/lib/store/modal'

import ApplicationLandedModal from './modals/ApplicationLandedModal'
import DeleteAccountModal from './modals/DeleteAccountModal'
import DeleteApplicationModal from './modals/DeleteApplicationModal'
import ExportFileModal from './modals/ExportFileModal'
import PlanInformationModal from './modals/PlanInformationModal'
import UsageLimitModal from './modals/UsageLimitModal'

const noop = () => {}

interface ModalRegistryProps {
  /** Logged-in user's display name, used by the landed boarding-pass modal. */
  userName: string
}

export function ModalRegistry({ userName }: ModalRegistryProps) {
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
      {payload.planInformation && (
        <PlanInformationModal
          open={activeModal === 'planInformation'}
          onOpenChange={handleClose}
          currentPlan={payload.planInformation.currentPlan}
          newPlan={payload.planInformation.newPlan}
          currentExpiresAt={payload.planInformation.currentExpiresAt}
        />
      )}
      {payload.applicationLanded && (
        <ApplicationLandedModal
          open={activeModal === 'applicationLanded'}
          onOpenChange={handleClose}
          userName={userName}
          company={payload.applicationLanded.company}
          role={payload.applicationLanded.role}
          planTier={payload.applicationLanded.planTier}
          previousCompany={payload.applicationLanded.previousCompany}
          previousRole={payload.applicationLanded.previousRole}
          appliedAt={payload.applicationLanded.appliedAt}
          landedAt={payload.applicationLanded.landedAt}
          compensation={payload.applicationLanded.compensation}
          location={payload.applicationLanded.location}
          appliedCount={payload.applicationLanded.appliedCount}
          interviewedCount={payload.applicationLanded.interviewedCount}
          daysCount={payload.applicationLanded.daysCount}
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
