import { formatNumber, parseNumber } from '#/helper/number'
import {
  useUpdateApplicationMutation,
  useUpdateApplicationStageMutation,
} from '#/hooks/useApplicationQueries'
import { useGenerateDocumentsMutation } from '#/hooks/useDocumentQueries'
import { SaveIcon } from 'lucide-react'

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

import SectionHeader from '#/components/layout/SectionHeader'

import {
  applicationStageSchema,
  updateApplicationSchema,
} from '#/validators/application'
import type { Application, ApplicationStage } from '#/validators/application'
import type { Document } from '#/validators/documents'

import ApplicationSummary from './ApplicationSummary'
import DeleteApplicationDialog from './DeleteApplicationDialog'
import FilePreview from './FilePreview'
import SectionCard from './SectionCard'
import StageBar from './StageBar'

interface UpdateApplicationProps {
  applicationId: string
  application?: Application
  documents?: Document[]
}

export default function UpdateApplication({
  applicationId,
  application,
  documents,
}: UpdateApplicationProps) {
  const { mutateAsync: updateStage } =
    useUpdateApplicationStageMutation(applicationId)
  const { mutateAsync: updateApplicationDetails } =
    useUpdateApplicationMutation(applicationId)
  const { mutateAsync: generateDocuments } =
    useGenerateDocumentsMutation(applicationId)

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
    },
    validators: {
      onSubmit: updateApplicationSchema,
    },
    onSubmit: ({ value }) => {
      updateApplicationDetails(value)
    },
  })

  const handleUpdateStage = (stage: ApplicationStage) => {
    updateStage({ id: applicationId, stage })
  }

  const handleRetailorDocument = () => {
    generateDocuments({ applicationId })
  }

  if (!application) return null

  return (
    <>
      <SectionHeader
        subTitle="Edit Application"
        title1="Update"
        title2="Application"
        description="Changes saved here will update this application on your Flight Deck."
      />
      <StageBar stage={application.stage} onUpdateStage={handleUpdateStage} />
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-full space-y-4 md:w-1/2">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="w-full space-y-4"
          >
            <SectionCard title="Application details" subTitle="details">
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
                          className="bg-white shadow-none placeholder:text-sm"
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
                        className="bg-white shadow-none placeholder:text-sm"
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

            <SectionCard title="Status update" subTitle="status">
              <div className="flex gap-4">
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
                          className="h-10.5! w-full bg-[#f5f6f8]! shadow-none!"
                        >
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          {applicationStageSchema.options.map((s) => (
                            <SelectItem key={s} value={s}>
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

            <SectionCard title="Notes" subTitle="notes">
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

            <div className="sticky bottom-4 flex justify-end rounded-lg border bg-white p-4 pt-3.5">
              <form.Subscribe
                selector={(s) => [s.isSubmitting, s.isDirty]}
                children={([isSubmitting, isDirty]) => (
                  <Button
                    type="submit"
                    className="w-full text-[12px] text-white! uppercase md:w-auto"
                    disabled={isSubmitting || !isDirty}
                  >
                    <SaveIcon /> Save Changes
                  </Button>
                )}
              />
            </div>
          </form>

          <SectionCard title="Application Summary" subTitle="summary">
            <ApplicationSummary data={application} />
          </SectionCard>

          <SectionCard
            title="Delete Application"
            subTitle="danger"
            variant="destructive"
          >
            <div className="flex flex-col space-y-2">
              <p className="text-primary-text font-sans text-[14px] leading-[1.4]">
                Permanently removes this application from your Flight Deck along
                with any generated CV/cover letter for it. This cannot be
                undone.
              </p>
              <DeleteApplicationDialog data={application}>
                <Button className="bg-destructive hover:bg-destructive/80 ml-auto h-8.75 w-fit font-mono text-[12px] leading-[1.4] uppercase">
                  Delete Application...
                </Button>
              </DeleteApplicationDialog>
            </div>
          </SectionCard>
        </div>
        <div className="w-full md:w-1/2">
          <FilePreview
            documents={documents}
            showRegenerateButton
            onRetailor={handleRetailorDocument}
          />
        </div>
      </div>
    </>
  )
}
