import {
  useUpdateApplicationMutation,
  useUpdateApplicationStageMutation,
} from '#/hooks/useApplicationQueries'
import {
  useDocumentsHistoryQuery,
  useDocumentsQuery,
  useGenerateDocumentsMutation,
} from '#/hooks/useDocumentQueries'
import type { Application, ApplicationStage } from '#/types'

import { Button } from '#/components/ui/button'

import SectionCard from '#/components/layout/SectionCard'
import SectionHeader from '#/components/layout/SectionHeader'

import { useModal } from '#/lib/store/modal'

import ApplicationTimeline from './ApplicationTimeline'
import ApplicationUpdateForm from './ApplicationUpdateForm'
import DocumentPreview from './DocumentPreview'
import StageBar from './StageBar'

interface ApplicationUpdateProps {
  applicationId: string
  application?: Application
}

export default function ApplicationUpdate({
  applicationId,
  application,
}: ApplicationUpdateProps) {
  const { open } = useModal()

  const { data: documents, isLoading: loadingDocuments } =
    useDocumentsQuery(applicationId)
  const { data: history, isLoading: loadingHistory } =
    useDocumentsHistoryQuery(applicationId)

  const { mutateAsync: updateStage, isPending: pendingUpdateStage } =
    useUpdateApplicationStageMutation(applicationId)
  const {
    mutateAsync: updateApplicationDetails,
    isPending: pendingUpdateDetails,
  } = useUpdateApplicationMutation(applicationId)
  const { mutateAsync: generateDocuments, isPending: pendingGenerate } =
    useGenerateDocumentsMutation(applicationId)

  const handleUpdateStage = (stage: ApplicationStage) => {
    updateStage({ id: applicationId, stage })
  }

  const handleDeleteApplication = () => {
    application &&
      open('deleteApplication', {
        id: application.id,
        company: application.company,
        role: application.role,
        stage: application.stage,
        appliedAt: application.appliedAt,
      })
  }

  const totalDocuments =
    (history?.cover_letter.length || 0) + (history?.cv.length || 0)

  const loading =
    pendingGenerate ||
    loadingDocuments ||
    loadingHistory ||
    pendingUpdateDetails ||
    pendingUpdateStage

  if (!application) return null

  return (
    <>
      <SectionHeader
        subTitle={`${application.role} @ ${application.company}`}
        title1="Update"
        title2="Application"
        description="Changes saved here will update this application on your Flight Deck."
      />
      <StageBar stage={application.stage} onUpdateStage={handleUpdateStage} />
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex w-full flex-col gap-4 lg:w-1/2">
          <ApplicationUpdateForm
            application={application}
            onUpdate={updateApplicationDetails}
            isLoading={loading}
          />

          <SectionCard
            variant="copilot"
            title="Application  Timeline"
            order="summary"
          >
            <ApplicationTimeline
              application={application}
              generatedDocuments={totalDocuments}
            />
          </SectionCard>
        </div>
        <div className="w-full space-y-4 lg:w-1/2">
          <DocumentPreview
            application={application}
            documents={documents}
            history={history}
            onGenerateDocument={generateDocuments}
            isLoading={loading}
            showControls
          />

          <SectionCard
            variant="copilot"
            title="Delete Application"
            order="danger"
            className="border-border-danger! bg-surface-danger! w-full"
          >
            <div className="flex flex-col space-y-2">
              <p className="text-muted font-sans text-[14px] leading-[1.4]">
                Permanently removes this application from your Flight Deck along
                with
                <br /> any generated CV/Cover Letter for it. This cannot be
                undone.
              </p>
              <Button
                className="bg-destructive hover:bg-destructive/80 ml-auto h-8.75 w-fit font-mono text-[12px] leading-[1.4] uppercase"
                onClick={handleDeleteApplication}
              >
                Delete Application...
              </Button>
            </div>
          </SectionCard>
        </div>
      </div>
    </>
  )
}
