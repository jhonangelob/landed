import { useState } from 'react'

import { formatDayTime } from '#/helper/date'
import { downloadBase64Pdf } from '#/helper/download'
import { useExportCoverLetterMutation } from '#/hooks/useDocumentQueries'
import type { Application, GenerateDocumentInput, GeneratedDoc } from '#/types'
import { DownloadIcon, HistoryIcon, SparklesIcon } from 'lucide-react'

import { useModal } from '#/lib/store/modal'

import { Button } from '../ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import DocumentPreviewEmpty from './DocumentPreviewEmpty'
import DocumentPreviewSkeleton from './DocumentPreviewSkeleton'

type FilePreviewFileTypes = 'cv' | 'cover_letter'

type FilePreviewFiles = {
  cv?: GeneratedDoc[]
  cover_letter?: GeneratedDoc[]
}

interface DocumentPreviewProps {
  application?: Application
  documents?: FilePreviewFiles
  history?: FilePreviewFiles
  onGenerateDocument?: (data: GenerateDocumentInput) => void
  showControls?: boolean
  isLoading?: boolean
}

interface DocumentPreviewPane {
  isLoading?: boolean
  document?: GeneratedDoc[]
  variant: FilePreviewFileTypes
}

function DocumentPreviewPane({
  isLoading,
  document,
  variant,
}: DocumentPreviewPane) {
  if (isLoading) return <DocumentPreviewSkeleton />
  if (!document?.length) return <DocumentPreviewEmpty variant={variant} />

  return (
    <div
      className="prose prose-sm max-w-none p-4"
      dangerouslySetInnerHTML={{
        __html: document[0].contentHtml,
      }}
    />
  )
}

export default function DocumentPreview({
  application,
  documents,
  history,
  onGenerateDocument,
  showControls = false,
  isLoading = false,
}: DocumentPreviewProps) {
  const { open } = useModal()
  const { mutateAsync: exportCoverLetter } = useExportCoverLetterMutation()

  const [fileType, setFileType] = useState<FilePreviewFileTypes>('cv')

  const handleGenerateDocument = async () => {
    onGenerateDocument &&
      application &&
      (await onGenerateDocument({
        applicationId: application.id,
        type: fileType,
      }))
  }

  const handleDownloadFile = async () => {
    if (!application?.id) return

    if (fileType === 'cv') {
      open('exportFile', { applicationId: application.id })
      return
    }

    const result = await exportCoverLetter({ applicationId: application.id })
    downloadBase64Pdf(result.base64, result.filename)
  }

  const cv = documents && documents.cv
  const cover_letter = documents && documents.cover_letter

  return (
    <div className="flex h-fit w-full flex-1 flex-col-reverse gap-2 md:flex-row">
      <Tabs defaultValue="cv" className="flex-1 rounded-lg border bg-white p-4">
        <TabsList variant="line" className="flex w-full flex-row justify-start">
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

          {showControls && (
            <div className="border-primary/40 ml-auto flex h-fit flex-row gap-2">
              <Button
                onClick={handleGenerateDocument}
                disabled={isLoading || !application}
              >
                <SparklesIcon />
              </Button>
              <Button
                onClick={handleDownloadFile}
                disabled={isLoading || !documents?.[fileType]?.length}
              >
                <DownloadIcon />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button disabled={isLoading} className="relative">
                    <HistoryIcon />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  className="absolute top-2 right-0 w-70 rounded-lg shadow-none"
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
            </div>
          )}
        </TabsList>

        <TabsContent value="cv">
          <DocumentPreviewPane
            document={cv}
            variant="cv"
            isLoading={isLoading}
          />
        </TabsContent>

        <TabsContent value="cl">
          <DocumentPreviewPane
            document={cover_letter}
            variant="cover_letter"
            isLoading={isLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  )
}
