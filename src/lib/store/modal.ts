import { create } from 'zustand'

import type { ApplicationStage } from '#/validators/application'
import type { Plan, PlanId } from '#/validators/subscription'

export type DeleteAccountPayload = {
  onDelete: () => void
}

export type DeleteApplicationPayload = {
  id: string
  company: string
  role: string
  stage: ApplicationStage
  appliedAt: Date | null
}

export type ExportFilePayload = {
  applicationId: string
}

export type UpdateSubscriptionPayload = {
  currentPlan: Plan
  newPlan: Plan
}

export type ApplicationLandedPayload = {
  applicationId: string
  company: string
  role: string
  planTier: string
  previousCompany?: string
  previousRole?: string
  appliedAt: Date | null
  landedAt: Date
  compensation?: string
  location?: string
  appliedCount: number
  interviewedCount: number
  daysCount: number
}

export type UsageLimitReason = 'generation' | 'application'

export type UsageLimitPayload = {
  reason: UsageLimitReason
  planId: PlanId
  used: number
  limit: number
  resetAt: Date | null
}

type ModalMap = {
  deleteAccount: DeleteAccountPayload
  deleteApplication: DeleteApplicationPayload
  exportFile: ExportFilePayload
  updateSubscription: UpdateSubscriptionPayload
  applicationLanded: ApplicationLandedPayload
  usageLimit: UsageLimitPayload
}

export type ModalId = keyof ModalMap

interface ModalStore {
  activeModal: ModalId | null
  payload: Partial<ModalMap>
  open: <TModalId extends ModalId>(
    id: TModalId,
    data: ModalMap[TModalId],
  ) => void
  close: () => void
}

export const useModalStore = create<ModalStore>((set) => ({
  activeModal: null,
  payload: {},
  open: (id, data) =>
    set((state) => ({
      activeModal: id,
      payload: { ...state.payload, [id]: data },
    })),
  close: () => set({ activeModal: null }),
}))

export function useModal() {
  const open = useModalStore((s) => s.open)
  const close = useModalStore((s) => s.close)
  return { open, close }
}
