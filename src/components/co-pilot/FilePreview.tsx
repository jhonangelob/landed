import { useState } from 'react'

import { formatDayTime } from '#/helper/date'
import { downloadBase64Pdf } from '#/helper/download'
import { useExportCoverLetterMutation } from '#/hooks/useDocumentQueries'
import type { GeneratedDoc } from '#/types'
import {
  DownloadIcon,
  HistoryIcon,
  SparkleIcon,
  SparklesIcon,
} from 'lucide-react'

import { useModal } from '#/lib/store/modal'
import { cn } from '#/lib/utils'

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

interface EmptyFilePreviewProps {
  variant: 'cv' | 'cover_letter'
}

function EmptyFilePreview({ variant }: EmptyFilePreviewProps) {
  return (
    <div className="mt-2 flex flex-col items-center justify-center gap-8 rounded-lg border border-dashed px-4 py-10 text-center">
      <div className="relative w-44 space-y-1.5 rounded-md border p-3">
        <div className="h-2 w-1/2 rounded-lg bg-[#e2e3e9]"></div>
        <div className="h-1.5 w-1/4 rounded-sm bg-[#f2f3f7]"></div>

        <div className="mt-3 h-2 w-full rounded-sm border-t"></div>
        <div className="h-1.5 w-1/5 rounded-lg bg-[#dbe6f9]"></div>
        <div className="h-1.5 w-full rounded-lg bg-[#f2f3f7]"></div>
        <div className="h-1.5 w-4/5 rounded-lg bg-[#f2f3f7]"></div>
        <div className="h-1.5 w-4/6 rounded-lg bg-[#f2f3f7]"></div>

        <div className="mt-3 h-2 w-full rounded-sm border-t"></div>
        <div className="h-1.5 w-1/5 rounded-lg bg-[#dbe6f9]"></div>
        <div className="h-1.5 w-full rounded-lg bg-[#f2f3f7]"></div>
        <div className="h-1.5 w-4/5 rounded-lg bg-[#f2f3f7]"></div>
        <div className="h-1.5 w-4/6 rounded-lg bg-[#f2f3f7]"></div>

        <div className="mt-3 h-2 w-full rounded-sm border-t"></div>
        <div className="h-1.5 w-1/5 rounded-lg bg-[#dbe6f9]"></div>
        <div className="h-1.5 w-2/5 rounded-lg bg-[#f2f3f7]"></div>
        <div className="h-1.5 w-4/5 rounded-lg bg-[#f2f3f7]"></div>

        <div className="absolute top-23 right-14 rounded-full border bg-white p-6">
          <SparkleIcon className="text-primary/20 fill-primary size-3" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <p className="font-display text-ink-strong text-[19px] leading-[1.6] font-bold tracking-[-0.5px]">
          {variant === 'cover_letter'
            ? 'Your cover letter.'
            : 'Your tailored CV.'}
        </p>
        <p className="text-ink-muted max-w-75 font-sans text-[13px] leading-[1.55]">
          {variant === 'cover_letter'
            ? 'Paste the job description on the left and hit Generate — Co-Pilot will write a short, specific cover letter in your voice.'
            : 'Paste the job description on the left and hit Generate — Co-Pilot will tailor your CV to match the role using your Pilot Profile.'}
        </p>
        <p className="text-muted w-fit rounded-full border px-3 py-1 font-mono text-[10px] leading-[1.6] tracking-[1.2px] uppercase">
          ← paste job details to get started
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

  const documentExist = (file: 'cv' | 'cover_letter') =>
    !!documents?.[file]?.length

  const hasDoc = documentExist(fileType)
  // Each control's visual state must mirror its own disabled condition.
  const canGenerate = showRetailorButton
  const canDownload = hasDoc && !isExportingCl
  const canViewHistory = hasDoc

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
    <div className="flex flex-col-reverse gap-2 md:flex-row">
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
              <EmptyFilePreview variant="cv" />
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
              <EmptyFilePreview variant="cover_letter" />
            )}
          </TabsContent>
        </Tabs>
      </div>
      <div className="top-16 grid w-full grid-cols-3 gap-2 self-start md:sticky md:flex md:w-12 md:flex-col">
        <Tooltip>
          <TooltipTrigger
            className="flex h-11! w-full flex-row items-center justify-center gap-1.5 rounded-lg border bg-white px-2.5 py-2 font-mono text-[11px] leading-[1.4] tracking-[1.1px] uppercase disabled:cursor-not-allowed"
            onClick={handleRetailor}
            disabled={!canGenerate}
          >
            <SparklesIcon
              className={cn(
                'size-4',
                canGenerate ? 'text-primary' : 'text-muted',
              )}
            />
            <p className="block md:hidden">{hasDoc ? 'Refine' : 'Generate'}</p>
          </TooltipTrigger>
          <TooltipContent>
            <p>{hasDoc ? 'Refine' : 'Generate'}</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger
            className="flex h-11! w-full flex-row items-center justify-center gap-1.5 rounded-lg border bg-white px-2.5 py-2 font-mono text-[11px] leading-[1.4] tracking-[1.1px] uppercase disabled:cursor-not-allowed"
            onClick={handleDownload}
            disabled={!canDownload}
          >
            <DownloadIcon
              className={cn(
                'size-4',
                canDownload ? 'text-primary' : 'text-muted',
              )}
            />
            <p className="block md:hidden">Download</p>
          </TooltipTrigger>
          <TooltipContent>
            <p>Download File</p>
          </TooltipContent>
        </Tooltip>

        <DropdownMenu>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger
                className="flex h-11! w-full flex-row items-center justify-center gap-1.5 rounded-lg border bg-white px-2.5 py-2 font-mono text-[11px] leading-[1.4] tracking-[1.1px] uppercase disabled:cursor-not-allowed"
                disabled={!canViewHistory}
              >
                <HistoryIcon
                  className={cn(
                    'size-4',
                    canViewHistory ? 'text-primary' : 'text-muted',
                  )}
                />
                <p className="block md:hidden">History</p>
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>View History</p>
            </TooltipContent>
          </Tooltip>
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
              <DropdownMenuItem disabled>No previous versions</DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
