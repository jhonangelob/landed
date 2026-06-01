import { useDeleteApplicationMutation } from '#/hooks/useApplicationQueries'
import { TrashIcon } from 'lucide-react'

import { Button } from '#/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'

import type { ApplicationStage } from '#/validators/application'

interface DeleteApplicationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  id: string
  company: string
  role: string
  stage: ApplicationStage
  appliedAt: Date | null
}

export default function DeleteApplicationModal({
  open,
  onOpenChange,
  id,
  company,
  role,
  stage,
  appliedAt,
}: DeleteApplicationModalProps) {
  const { mutateAsync: deleteApplication } = useDeleteApplicationMutation()

  const handleDelete = async () => {
    try {
      await deleteApplication(id)
      onOpenChange(false)
    } catch {}
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="space-y-4" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This will permanently remove this application and all generated
            documents. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="rounded-md border p-3">
          <p className="text-muted-foreground font-mono text-[12px] uppercase">
            {company}
          </p>
          <p className="text-primary-text font-sans text-[14px] font-bold">
            {role}
          </p>
          <div className="mt-1 flex flex-row items-center gap-2">
            <p className="rounded-full border px-2 py-0.5 font-mono text-[10px]">
              {stage}
            </p>
            {appliedAt && (
              <p className="text-muted-foreground font-mono text-[11px] font-medium">
                {new Date(appliedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            )}
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button className="text-muted-foreground border-muted-foreground hover:bg-muted-foreground/40 hover:text-primary-text border bg-transparent font-sans text-[13px] uppercase">
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive font-sans text-[13px] uppercase hover:opacity-80"
          >
            <TrashIcon />
            Delete Application
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
