import { useState } from 'react'

import { formatDayTime } from '#/helper/date'
import { downloadBase64Pdf } from '#/helper/download'
import { useExportCoverLetterMutation } from '#/hooks/useDocumentQueries'
import type { GeneratedDoc } from '#/types'
import { DownloadIcon, HistoryIcon, PlusIcon, SparklesIcon } from 'lucide-react'

import { useModal } from '#/lib/store/modal'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip'

interface FilePreviewProps {
  showRetailorButton?: boolean
  documents?: {
    cv?: GeneratedDoc[]
    cover_letter?: GeneratedDoc[]
  }
  history?: {
    cv?: GeneratedDoc[]
    cover_letter?: GeneratedDoc[]
  }
  onRetailor?: (type: 'cv' | 'cover_letter') => void
  applicationId?: string
}

function EmptyFilePreview() {
  return (
    <div className="mt-2 flex items-center justify-center rounded-lg border border-dashed py-20">
      <div className="flex flex-col items-center justify-center gap-4 text-center">
        <div className="bg-primary/20 text-primary flex size-14 items-center justify-center rounded-full">
          <PlusIcon className="size-4" />
        </div>
        <p className="font-display text-primary-text text-[20px] leading-[1.6] font-bold tracking-[-0.5px]">
          No CV Yet
        </p>
        <p className="text-primary-text max-w-2/3 font-sans text-[14px] leading-normal font-normal">
          Fill in the job posting on the left, then hit{' '}
          <span className="font-bold">Generate documents</span>
        </p>
        <p className="text-primary-text max-w-2/3 font-sans text-[14px] leading-normal font-normal">
          Co-Pilot will use your Pilot Profile to tailor a one-page CV for this
          role.
        </p>
      </div>
    </div>
  )
}

export default function FilePreview({
  showRetailorButton = false,
  documents,
  history,
  onRetailor,
  applicationId,
}: FilePreviewProps) {
  const { open } = useModal()

  const { mutateAsync: exportCoverLetter, isPending: isExportingCl } =
    useExportCoverLetterMutation()

  const [fileType, setFileType] = useState<'cv' | 'cover_letter'>('cv')

  const handleRetailor = () => {
    onRetailor && onRetailor(fileType)
  }

  const handleDownload = async () => {
    if (!applicationId) return

    if (fileType === 'cv') {
      open('exportFile', { applicationId })
      return
    }

    const result = await exportCoverLetter({ applicationId })
    downloadBase64Pdf(result.base64, result.filename)
  }

  return (
    <div className="flex flex-row gap-2">
      <div className="flex-1 rounded-lg border bg-white p-5.5">
        <Tabs defaultValue="cv">
          <TabsList
            variant="line"
            className="flex w-full flex-row justify-start"
          >
            <TabsTrigger
              value="cv"
              className="text-primary-text max-w-fit font-mono text-[11px] leading-[1.4] font-normal tracking-[1.3px] uppercase"
              onClick={() => setFileType('cv')}
            >
              Tailored CV
            </TabsTrigger>
            <TabsTrigger
              value="cl"
              className="text-primary-text max-w-fit font-mono text-[11px] leading-[1.4] font-normal tracking-[1.3px] uppercase"
              onClick={() => setFileType('cover_letter')}
            >
              Cover Letter
            </TabsTrigger>
          </TabsList>

          <TabsContent value="cv">
            {documents?.cv?.length ? (
              <div
                className="prose prose-sm max-w-none p-8"
                dangerouslySetInnerHTML={{
                  __html: documents.cv[0].contentHtml,
                }}
              />
            ) : (
              <EmptyFilePreview />
            )}
          </TabsContent>

          <TabsContent value="cl">
            {documents?.cover_letter?.length ? (
              <div
                className="prose prose-sm max-w-none p-8"
                dangerouslySetInnerHTML={{
                  __html: documents.cover_letter[0].contentHtml,
                }}
              />
            ) : (
              <EmptyFilePreview />
            )}
          </TabsContent>
        </Tabs>
      </div>
      <div className="sticky top-16 w-12 space-y-2 self-start">
        {showRetailorButton && (
          <Tooltip>
            <TooltipTrigger
              className="flex h-11! w-full flex-row items-center justify-center gap-1.5 rounded-lg border bg-white px-2.5 py-2 font-mono text-[11px] leading-[1.4] tracking-[1.1px] uppercase"
              onClick={handleRetailor}
            >
              <SparklesIcon className="text-primary size-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Re-Tailor</p>
            </TooltipContent>
          </Tooltip>
        )}
        {documents?.[fileType] && applicationId && (
          <Tooltip>
            <TooltipTrigger
              className="flex h-11! w-full flex-row items-center justify-center gap-1.5 rounded-lg border bg-white px-2.5 py-2 font-mono text-[11px] leading-[1.4] tracking-[1.1px] uppercase"
              onClick={handleDownload}
              disabled={isExportingCl}
            >
              <DownloadIcon className="text-primary size-4" />
            </TooltipTrigger>
            <TooltipContent>
              <p>Download File</p>
            </TooltipContent>
          </Tooltip>
        )}
        {documents?.[fileType] && applicationId && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex h-11! w-full flex-row items-center justify-center gap-1.5 rounded-lg border bg-white px-2.5 py-2 font-mono text-[11px] leading-[1.4] tracking-[1.1px] uppercase">
              <Tooltip>
                <TooltipTrigger>
                  <HistoryIcon className="text-primary size-4" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>View History</p>
                </TooltipContent>
              </Tooltip>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-70 rounded-lg shadow-none"
              align="end"
            >
              <DropdownMenuLabel className="font-mono text-[11px] tracking-[1.1px] uppercase">
                Version history
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              {history?.[fileType]?.length ? (
                history[fileType].map((doc) => (
                  <DropdownMenuItem
                    key={doc.id}
                    className="flex flex-row items-center justify-between gap-4"
                  >
                    <span className="text-ink-strong font-mono text-[12px] leading-[1.4] font-medium tracking-[0.1px]">
                      {doc.version}
                    </span>
                    <span className="text-muted font-mono text-[11px] leading-[1.4]">
                      {formatDayTime(doc.createdAt)}
                    </span>
                  </DropdownMenuItem>
                ))
              ) : (
                <DropdownMenuItem disabled>
                  No previous versions
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
