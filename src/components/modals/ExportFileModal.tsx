import { useState } from 'react'

import { downloadBase64Pdf } from '#/helper/download'
import { useExportDocumentsMutation } from '#/hooks/useDocumentQueries'
import { DownloadIcon } from 'lucide-react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '#/components/ui/dialog'

import { cn } from '#/lib/utils'

import { CV_TEMPLATES } from '#/constants/templates'

import { Button } from '../ui/button'

interface ExportFileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  applicationId: string
  docId?: string
}

export default function ExportFileModal({
  open,
  onOpenChange,
  applicationId,
  docId,
}: ExportFileModalProps) {
  const [template, setTemplate] = useState<'classic' | 'modern' | 'minimal'>(
    'classic',
  )

  const { mutateAsync: exportDocuments } = useExportDocumentsMutation()

  const handleExport = async () => {
    const result = await exportDocuments({ applicationId, template, docId })
    downloadBase64Pdf(result.base64, result.filename)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="min-w-140!">
        <DialogHeader>
          <DialogTitle>Choose a Template</DialogTitle>
          <DialogDescription>
            Choose a visual style for your generated document
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-row gap-3">
          {CV_TEMPLATES.map((item) => (
            <div
              className={cn(
                'flex-1 cursor-pointer space-y-2 rounded-md border p-3',
                template === item.id && 'border-primary',
                !item.enabled && 'cursor-not-allowed opacity-50',
              )}
              key={item.id}
              onClick={() =>
                item.enabled &&
                setTemplate(item.id as 'classic' | 'modern' | 'minimal')
              }
            >
              <div className="flex h-40 items-center justify-center rounded-sm bg-gray-200 text-white">
                <img src={item.preview} alt={item.id} />
              </div>
              <div>
                <p className="text-primary h-4 font-mono text-[11px] font-semibold uppercase">
                  {template === item.id ? 'Selected' : ' '}
                </p>
                <p className="text-primary-text font-sans text-[12px] font-medium">
                  {item.name}
                </p>
                <p className="text-muted font-sans text-[12px]">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="outline"
              className="font-sans text-[13px] uppercase"
            >
              Cancel
            </Button>
          </DialogClose>
          <Button
            className="font-sans text-[13px] uppercase"
            onClick={handleExport}
          >
            <DownloadIcon /> Download {template}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
