import { useState } from 'react'

import { useExportDocumentsMutation } from '#/hooks/useDocumentQueries'
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
import { DownloadIcon, FileIcon, TicketsPlaneIcon } from 'lucide-react'

import { cn } from '#/lib/utils'

import { CV_TEMPLATES, type CvTemplateId } from '#/constants/templates'

import { Button } from '../ui/button'

interface ExportFileDialogProps {
  applicationId: string
  children: React.ReactNode
}

export default function ExportFileDialog({
  applicationId,
  children,
}: ExportFileDialogProps) {
  const [template, setTemplate] = useState<'classic' | 'modern' | 'minimal'>(
    'classic',
  )

  const { mutateAsync: exportDocuments } = useExportDocumentsMutation()

  const handleClickRunway = () => {
    console.log('unimplemented: runway')
  }

  const handleExport = async () => {
    const result = await exportDocuments({ applicationId, template })
    const bytes = Uint8Array.from(atob(result.base64), (c) => c.charCodeAt(0))
    const blob = new Blob([bytes], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = result.filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
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
              )}
              key={item.id}
              onClick={() =>
                setTemplate(item.id as 'classic' | 'modern' | 'minimal')
              }
            >
              <div className="flex h-40 items-center justify-center rounded-sm bg-gray-200 text-white">
                <FileIcon />
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
        <div className="flex justify-center rounded-md border border-dashed p-4 text-center text-[12px]">
          <TicketsPlaneIcon className="mr-2 size-4" />
          Unlock Premium templates with
          <span
            className="text-primary ml-1 cursor-pointer font-medium"
            onClick={handleClickRunway}
          >
            Runway
          </span>
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
