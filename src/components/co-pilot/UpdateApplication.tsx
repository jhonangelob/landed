import { useState } from 'react'

import { formatNumber, parseNumber } from '#/helper/number'
import {
  useShareApplicationQuery,
  useUpdateApplicationMutation,
  useUpdateApplicationStageMutation,
} from '#/hooks/useApplicationQueries'
import {
  useDocumentsHistoryQuery,
  useDocumentsQuery,
  useGenerateDocumentsMutation,
} from '#/hooks/useDocumentQueries'
import type {
  Application,
  ApplicationStage,
  UpdateApplicationInput,
} from '#/types'
import { CheckIcon, CopyIcon, SaveIcon } from 'lucide-react'

import { useForm } from '@tanstack/react-form'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'
import { Textarea } from '#/components/ui/textarea'

import SectionCard from '#/components/layout/SectionCard'
import SectionHeader from '#/components/layout/SectionHeader'

import { useModal } from '#/lib/store/modal'
import { notify } from '#/lib/toast'

import { updateApplicationSchema } from '#/validators/application'
import { applicationStageSchema } from '#/validators/shared'

import ApplicationSummary from './ApplicationSummary'
import FilePreview from './FilePreview'
import StageBar from './StageBar'

interface UpdateApplicationProps {
  applicationId: string
  application?: Application
}

export default function UpdateApplication({
  applicationId,
  application,
}: UpdateApplicationProps) {
  const { open } = useModal()
  const isLanded = application?.stage === 'landed'
  const [copied, setCopied] = useState(false)

  const { data: shareToken } = useShareApplicationQuery(applicationId, isLanded)

  const shareUrl = shareToken
    ? `${window.location.origin}/share/${shareToken}`
    : null

  const handleCopyLink = async () => {
    if (!shareUrl) return
    await navigator.clipboard.writeText(shareUrl)
    notify.success('Saved!', 'Link copied to clipboard')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const { mutateAsync: updateStage } =
    useUpdateApplicationStageMutation(applicationId)
  const { mutateAsync: updateApplicationDetails } =
    useUpdateApplicationMutation(applicationId)
  const { mutateAsync: generateDocuments } =
    useGenerateDocumentsMutation(applicationId)

  const { data: documents } = useDocumentsQuery(applicationId)
  const { data: history } = useDocumentsHistoryQuery(applicationId)

  const form = useForm({
    defaultValues: {
      id: applicationId,
      company: application?.company ?? '',
      role: application?.role ?? '',
      url: application?.url ?? '',
      location: application?.location ?? '',
      salaryRange: application?.salaryRange ?? '',
      notes: application?.notes ?? '',
      stage: application?.stage ?? 'spotted',
      status: application?.status ?? '',
      description: application?.description ?? '',
    } satisfies UpdateApplicationInput,
    validators: {
      onSubmit: updateApplicationSchema,
    },
    onSubmit: async ({ value }) => {
      await updateApplicationDetails(value)
    },
  })

  const handleUpdateStage = (stage: ApplicationStage) => {
    updateStage({ id: applicationId, stage })
    form.setFieldValue('stage', stage)
  }

  const handleRetailorDocument = (type: 'cv' | 'cover_letter') => {
    generateDocuments({ applicationId, type })
  }

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
        <div className="flex flex-1 flex-col gap-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="w-full space-y-4"
          >
            <SectionCard
              variant="copilot"
              title="Application details"
              order="details"
            >
              <div className="space-y-4">
                <div className="flex flex-col gap-4 md:flex-row">
                  <form.Field
                    name="company"
                    children={(field) => (
                      <div className="w-full space-y-1.5">
                        <Label htmlFor="company">Company Name</Label>
                        <Input
                          id="company"
                          placeholder="e.g. Landed"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          disabled={isLanded}
                        />
                        {field.state.meta.errors.map((err, i) => (
                          <p key={i} className="text-destructive text-xs">
                            {err?.message as string}
                          </p>
                        ))}
                      </div>
                    )}
                  />

                  <form.Field
                    name="role"
                    children={(field) => (
                      <div className="w-full space-y-1.5">
                        <Label htmlFor="role">Job Title</Label>
                        <Input
                          id="role"
                          placeholder="e.g. Software Engineer"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          disabled={isLanded}
                        />
                        {field.state.meta.errors.map((err, i) => (
                          <p key={i} className="text-destructive text-xs">
                            {err?.message as string}
                          </p>
                        ))}
                      </div>
                    )}
                  />
                </div>
                <form.Field
                  name="url"
                  children={(field) => (
                    <div className="w-full space-y-1.5">
                      <Label htmlFor="url">Job URL</Label>
                      <Input
                        id="url"
                        placeholder="e.g. https://jobs.example.com/12345"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        disabled={isLanded}
                      />
                      {field.state.meta.errors.map((err, i) => (
                        <p key={i} className="text-destructive text-xs">
                          {err?.message as string}
                        </p>
                      ))}
                    </div>
                  )}
                />
                <div className="flex flex-col gap-4 md:flex-row">
                  <form.Field
                    name="salaryRange"
                    children={(field) => (
                      <div className="w-full space-y-1.5">
                        <Label htmlFor="salaryRange">Salary Range</Label>
                        <Input
                          id="salaryRange"
                          placeholder="e.g. 120,000"
                          value={formatNumber(field.state.value)}
                          onChange={(e) =>
                            field.handleChange(parseNumber(e.target.value))
                          }
                          onBlur={field.handleBlur}
                          disabled={isLanded}
                        />
                        {field.state.meta.errors.map((err, i) => (
                          <p key={i} className="text-destructive text-xs">
                            {err?.message as string}
                          </p>
                        ))}
                      </div>
                    )}
                  />
                  <form.Field
                    name="location"
                    children={(field) => (
                      <div className="w-full space-y-1.5">
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="Manila, Philippines"
                          value={field.state.value}
                          onChange={(e) => field.handleChange(e.target.value)}
                          onBlur={field.handleBlur}
                          disabled={isLanded}
                        />
                        {field.state.meta.errors.map((err, i) => (
                          <p key={i} className="text-destructive text-xs">
                            {err?.message as string}
                          </p>
                        ))}
                      </div>
                    )}
                  />
                </div>

                <form.Field
                  name="description"
                  children={(field) => (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="description"
                        className="text-muted-foreground font-sans text-[12px] font-medium"
                      >
                        Job Description
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Paste the full job requirements and role description here..."
                        rows={10}
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        disabled={isLanded}
                      />
                      {field.state.meta.errors.map((err, i) => (
                        <p key={i} className="text-destructive text-xs">
                          {err?.message as string}
                        </p>
                      ))}
                    </div>
                  )}
                />
              </div>
            </SectionCard>

            <SectionCard variant="copilot" title="Status update" order="status">
              <div className="flex flex-col gap-4 sm:flex-row">
                <form.Field
                  name="status"
                  children={(field) => (
                    <div className="w-full space-y-1.5">
                      <Label htmlFor="status">Sub-Status</Label>
                      <Input
                        id="status"
                        placeholder="e.g. Landed"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                        onBlur={field.handleBlur}
                        disabled={isLanded}
                      />
                      {field.state.meta.errors.map((err, i) => (
                        <p key={i} className="text-destructive text-xs">
                          {err?.message as string}
                        </p>
                      ))}
                    </div>
                  )}
                />
                <form.Field
                  name="stage"
                  children={(field) => (
                    <div className="w-full space-y-1.5">
                      <Label htmlFor="stage">Stage</Label>
                      <Select
                        value={field.state.value}
                        onValueChange={(v) =>
                          field.handleChange(v as ApplicationStage)
                        }
                      >
                        <SelectTrigger
                          id="stage"
                          onBlur={field.handleBlur}
                          className="bg-surface-muted! h-10.5! w-full capitalize shadow-none!"
                          disabled={isLanded}
                        >
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          {applicationStageSchema.options.map((s) => (
                            <SelectItem
                              key={s}
                              value={s}
                              className="capitalize"
                            >
                              {s.replace('_', ' ')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {field.state.meta.errors.map((err, i) => (
                        <p key={i} className="text-destructive text-xs">
                          {err?.message as string}
                        </p>
                      ))}
                    </div>
                  )}
                />
              </div>
            </SectionCard>

            <SectionCard variant="copilot" title="Notes" order="notes">
              <form.Field
                name="notes"
                children={(field) => (
                  <div className="space-y-1.5">
                    <Label htmlFor="notes">Notes</Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any personal notes about this application..."
                      rows={5}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      disabled={isLanded}
                    />
                    {field.state.meta.errors.map((err, i) => (
                      <p key={i} className="text-destructive text-xs">
                        {err?.message as string}
                      </p>
                    ))}
                  </div>
                )}
              />
            </SectionCard>

            <div className="border-primary/20 sticky bottom-4 flex justify-end rounded-lg border bg-white p-4 pt-3.5">
              {isLanded ? (
                <Button
                  type="button"
                  variant="outline"
                  className="w-full text-[12px] uppercase md:w-auto"
                  disabled={!shareUrl}
                  onClick={handleCopyLink}
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                  {copied ? 'Copied!' : 'Copy Share Link'}
                </Button>
              ) : (
                <form.Subscribe
                  selector={(s) => [s.isSubmitting, s.isDirty]}
                  children={([isSubmitting, isDirty]) => (
                    <Button
                      type="submit"
                      className="flex w-full text-[12px] text-white! uppercase md:w-auto"
                      disabled={isSubmitting || !isDirty}
                    >
                      <SaveIcon /> Save Changes
                    </Button>
                  )}
                />
              )}
            </div>
          </form>

          <SectionCard
            variant="copilot"
            title="Application Summary"
            order="summary"
          >
            <ApplicationSummary data={application} />
          </SectionCard>
        </div>
        <div className="flex-1 space-y-4">
          <FilePreview
            documents={documents}
            history={history}
            showRetailorButton={application.stage === 'spotted'}
            onRetailor={handleRetailorDocument}
            applicationId={applicationId}
          />
          <SectionCard
            variant="copilot"
            title="Delete Application"
            order="danger"
            className="border-border-danger! bg-surface-danger!"
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
                onClick={() =>
                  open('deleteApplication', {
                    id: application.id,
                    company: application.company,
                    role: application.role,
                    stage: application.stage,
                    appliedAt: application.appliedAt,
                  })
                }
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
