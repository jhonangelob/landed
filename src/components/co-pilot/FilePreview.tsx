import { useState } from 'react'

import { formatDayTime } from '#/helper/date'
import type { GeneratedDoc } from '#/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DownloadIcon, HistoryIcon, PlusIcon, SparklesIcon } from 'lucide-react'

import { useModal } from '#/lib/store/modal'

import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

interface FilePreviewProps {
  showRetailorButton?: boolean
  documents?: GeneratedDoc[]
  history?: GeneratedDoc[]
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

  const [fileType, setFileType] = useState<'cv' | 'cover_letter'>('cv')

  const historyList = history?.filter((doc) => doc.type === fileType)

  const cvDoc = documents?.find((d) => d.type === 'cv')
  const clDoc = documents?.find((d) => d.type === 'cover_letter')

  const documentExist = {
    cv: !!cvDoc,
    cover_letter: !!clDoc,
  }

  const handleRetailor = () => {
    onRetailor && onRetailor(fileType)
  }

  return (
    <div className="bg-surface-subtle w-full rounded-lg border p-5.5">
      <Tabs defaultValue="cv">
        <TabsList variant="line" className="flex w-full flex-row items-center">
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

          <div className="ml-auto flex flex-row gap-2">
            {showRetailorButton ? (
              <Button
                className="text-primary-text flex h-fit flex-row gap-1.5 px-2.5 py-2 font-mono text-[11px] leading-[1.4] tracking-[1.1px] uppercase"
                variant="outline"
                onClick={handleRetailor}
              >
                <SparklesIcon className="size-2.75" />
                <p className="hidden md:block">
                  {documentExist[fileType] ? 'Retailor' : 'Generate'}{' '}
                  {fileType === 'cover_letter' ? 'Cover Letter' : 'CV'}
                </p>
              </Button>
            ) : (
              <span className="text-muted text-right font-sans text-[11px] leading-[1.4]">
                AI generation is unavailable for applications at
                <br /> or past the 'Applied' stage.
              </span>
            )}

            {documentExist[fileType] && applicationId && (
              <Button
                className="text-primary-text flex h-fit flex-row gap-1.5 px-2.5 py-2 font-mono text-[11px] leading-[1.4] tracking-[1.1px] uppercase"
                variant="outline"
                onClick={() =>
                  open('exportFile', {
                    applicationId,
                  })
                }
              >
                <DownloadIcon className="size-2.75" />
                <p className="hidden md:block">Download</p>
              </Button>
            )}

            {documentExist[fileType] && applicationId && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    className="text-primary-text flex h-fit flex-row gap-1.5 px-2.5 py-2 font-mono text-[11px] leading-[1.4] tracking-[1.1px] uppercase"
                    variant="outline"
                  >
                    <HistoryIcon className="size-2.75" />
                    <p className="hidden md:block">History</p>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-70 shadow-none" align="end">
                  <DropdownMenuLabel className="font-mono text-[11px] tracking-[1.1px] uppercase">
                    Version history
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {historyList && historyList.length > 0 ? (
                    historyList.map((doc) => (
                      <DropdownMenuItem
                        key={doc.id}
                        className="flex flex-row items-center justify-between gap-4"
                      >
                        <span className="text-ink-strong font-mono text-[12px] leading-[1.4] font-medium tracking-[0.1px]">
                          Version {doc.version}
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
        </TabsList>

        <TabsContent value="cv">
          {cvDoc?.contentHtml ? (
            <div
              className="prose prose-sm max-w-none p-8"
              dangerouslySetInnerHTML={{ __html: cvDoc.contentHtml }}
            />
          ) : (
            <EmptyFilePreview />
          )}
        </TabsContent>

        <TabsContent value="cl">
          {clDoc?.contentHtml ? (
            <div
              className="prose prose-sm max-w-none p-8"
              dangerouslySetInnerHTML={{ __html: clDoc.contentHtml }}
            />
          ) : (
            <EmptyFilePreview />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
