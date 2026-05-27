import type React from 'react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { TrashIcon } from 'lucide-react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { deleteApplication } from '#/server/applications'

import type { ApplicationStage } from '#/validators/application'

type DisplayDataProps = {
  id: string
  company: string
  role: string
  stage: ApplicationStage
  appliedAt: Date | null
}

interface DeleteApplicationDialogProps {
  children: React.ReactNode
  data: DisplayDataProps
}

export default function DeleteApplicationDialog({
  children,
  data,
}: DeleteApplicationDialogProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const [isOpen, setIsOpen] = useState(false)

  const { mutateAsync: deleteApplicationItem } = useMutation({
    mutationFn: (value: string) => deleteApplication({ data: { id: value } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
      navigate({ to: '/flight-deck' })
    },
  })

  const handleDeleteApplication = () => {
    deleteApplicationItem(data.id)
  }

  return (
    <Dialog open={isOpen}>
      <DialogTrigger asChild onClick={() => setIsOpen(true)}>
        {children}
      </DialogTrigger>
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
            {data.company}
          </p>
          <p className="text-primary-text font-sans text-[14px] font-bold">
            {data.role}
          </p>
          <div className="mt-1 flex flex-row items-center gap-2">
            <p className="rounded-full border px-2 py-0.5 font-mono text-[10px]">
              {data.stage}
            </p>
            {data.appliedAt && (
              <p className="text-muted-foreground font-mono text-[11px] font-medium">
                {new Date(data.appliedAt).toLocaleDateString('en-US', {
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
            <Button
              className="text-muted-foreground border-muted-foreground hover:bg-muted-foreground/40 hover:text-primary-text border bg-transparent font-sans text-[13px] uppercase"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            onClick={handleDeleteApplication}
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
