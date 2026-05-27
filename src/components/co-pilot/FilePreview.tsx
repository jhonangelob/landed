import { CopyIcon, DownloadIcon, PlusIcon, SparklesIcon } from 'lucide-react'

import type { Document } from '#/validators/documents'

import { Button } from '../ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'

interface FilePreview {
  showRegenerateButton?: boolean
  documents?: Document[]
  onRetailor?: () => void
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
  showRegenerateButton = false,
  documents,
  onRetailor,
}: FilePreview) {
  return (
    <div className="w-full rounded-lg border bg-[#fafbfd] p-5.5">
      <Tabs defaultValue="cv">
        <TabsList variant="line" className="flex w-full flex-row items-center">
          <TabsTrigger
            value="cv"
            className="text-primary-text max-w-fit font-mono text-[11px] leading-[1.4] font-normal tracking-[1.3px] uppercase"
          >
            Tailored CV
          </TabsTrigger>
          <TabsTrigger
            value="cl"
            className="text-primary-text max-w-fit font-mono text-[11px] leading-[1.4] font-normal tracking-[1.3px] uppercase"
          >
            Cover Letter
          </TabsTrigger>
          <div className="ml-auto flex flex-row gap-2">
            {showRegenerateButton && (
              <Button
                className="text-primary-text flex h-fit flex-row gap-1.5 px-2.5 py-2 font-mono text-[11px] leading-[1.4] tracking-[1.1px] uppercase shadow-none"
                variant="outline"
                onClick={onRetailor}
              >
                <SparklesIcon className="size-2.75" />
                Retailor
              </Button>
            )}

            <Button
              className="text-primary-text flex h-fit flex-row gap-1.5 px-2.5 py-2 font-mono text-[11px] leading-[1.4] tracking-[1.1px] uppercase shadow-none"
              variant="outline"
            >
              <CopyIcon className="size-2.75" />
              <p className="hidden md:block">Copy</p>
            </Button>
            <Button
              className="text-primary-text flex h-fit flex-row gap-1.5 px-2.5 py-2 font-mono text-[11px] leading-[1.4] tracking-[1.1px] uppercase shadow-none"
              variant="outline"
            >
              <DownloadIcon className="size-2.75" />
              <p className="hidden md:block">Pdf</p>
            </Button>
          </div>
        </TabsList>
        <TabsContent value="cv">
          {documents?.[1] ? (
            <div
              className="prose prose-sm max-w-none p-8"
              dangerouslySetInnerHTML={{ __html: documents[1]?.contentHtml }}
            />
          ) : (
            <EmptyFilePreview />
          )}
        </TabsContent>
        <TabsContent value="cl">
          {documents?.[0] ? (
            <div
              className="prose prose-sm max-w-none p-8"
              dangerouslySetInnerHTML={{ __html: documents[0]?.contentHtml }}
            />
          ) : (
            <EmptyFilePreview />
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
