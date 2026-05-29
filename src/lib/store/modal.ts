import { create } from 'zustand'

import type { ApplicationStage } from '#/validators/application'

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

type ModalMap = {
  deleteAccount: DeleteAccountPayload
  deleteApplication: DeleteApplicationPayload
  exportFile: ExportFilePayload
}

export type ModalId = keyof ModalMap

interface ModalStore {
  activeModal: ModalId | null
  payload: Partial<ModalMap>
  open: <K extends ModalId>(id: K, data: ModalMap[K]) => void
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
