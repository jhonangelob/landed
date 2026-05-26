import { SaveIcon } from 'lucide-react'
import z from 'zod'

import { useForm } from '@tanstack/react-form'
import { useMutation, useQueryClient } from '@tanstack/react-query'

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

import { updateApplication } from '#/server/applications'

import { applicationStatusSchema } from '#/validators/application'

import type { Application } from '#/types/application'

import ApplicationSummary from './ApplicationSummary'
import DeleteApplicationDialog from './DeleteApplicationDialog'
import FilePreview from './FilePreview'
import SectionCard from './SectionCard'
import StageBar from './StageBar'

const updateFormSchema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  jobUrl: z.string().url('Must be a valid URL').or(z.literal('')),
  salaryRange: z.string(),
  location: z.string(),
  notes: z.string(),
  status: applicationStatusSchema,
})

interface UpdateApplicationProps {
  applicationId: string
  application?: Application
}

export default function UpdateApplication({
  applicationId,
  application,
}: UpdateApplicationProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: update } = useMutation({
    mutationFn: async (values: z.infer<typeof updateFormSchema>) => {
      return await updateApplication({
        data: {
          id: applicationId,
          companyName: values.companyName,
          jobTitle: values.jobTitle,
          jobUrl: values.jobUrl || null,
          location: values.location || null,
          salaryRange: values.salaryRange || null,
          notes: values.notes || null,
          status: values.status,
          subStatus: application?.subStatus ?? null,
        },
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['application', applicationId],
      })
    },
  })

  const form = useForm({
    defaultValues: {
      companyName: application?.company ?? '',
      jobTitle: application?.role ?? '',
      jobUrl: application?.jobUrl ?? '',
      salaryRange: application?.salaryRange ?? '',
      location: application?.location ?? '',
      notes: application?.notes ?? '',
      status: application?.status ?? 'spotted',
    },
    validators: {
      onSubmit: updateFormSchema,
    },
    onSubmit: ({ value }) => {
      update(value)
    },
  })

  return (
    <>
      <SectionHeader
        subTitle="Edit Application"
        title1="Update"
        title2="Application"
        description="Changes saved here will update this application on your Flight Deck."
      />
      <StageBar status="spotted" onChangeStatus={() => console.log('first')} />
      <div className="flex flex-row gap-4">
        <div className="w-1/2 space-y-4">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="w-full space-y-4"
          >
            <SectionCard title="Application details" subTitle="details">
              <div className="space-y-4">
                <div className="flex gap-4">
                  <form.Field
                    name="companyName"
                    children={(field) => (
                      <div className="w-full space-y-1.5">
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
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
                    name="jobTitle"
                    children={(field) => (
                      <div className="w-full space-y-1.5">
                        <Label htmlFor="jobTitle">Job Title</Label>
                        <Input
                          id="jobTitle"
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
                  name="jobUrl"
                  children={(field) => (
                    <div className="w-full space-y-1.5">
                      <Label htmlFor="jobUrl">Job URL</Label>
                      <Input
                        id="jobUrl"
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
                <div className="flex gap-4">
                  <form.Field
                    name="salaryRange"
                    children={(field) => (
                      <div className="w-full space-y-1.5">
                        <Label htmlFor="salaryRange">Salary Range</Label>
                        <Input
                          id="salaryRange"
                          placeholder="e.g. $80k – $100k"
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
                  name="jobDescription"
                  children={(field) => (
                    <div className="space-y-1.5">
                      <Label
                        htmlFor="jobDescription"
                        className="text-muted-foreground font-sans text-[12px] font-medium"
                      >
                        Job Description
                      </Label>
                      <Textarea
                        id="jobDescription"
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
                  name="subStatus"
                  children={(field) => (
                    <div className="w-full space-y-1.5">
                      <Label htmlFor="subStatus">Sub-Status</Label>
                      <Input
                        id="subStatus"
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
                  name="status"
                  children={(field) => (
                    <div className="w-full space-y-1.5">
                      <Label htmlFor="status">Stage</Label>
                      <Select
                        value={field.state.value}
                        onValueChange={(v) => field.handleChange(v)}
                      >
                        <SelectTrigger
                          id="status"
                          onBlur={field.handleBlur}
                          className="h-10.5! w-full bg-[#f5f6f8]! shadow-none!"
                        >
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          {applicationStatusSchema.options.map((s) => (
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

            <div className="flex justify-end rounded-lg border bg-white p-4 pt-3.5">
              <form.Subscribe>
                <Button>
                  <form.Subscribe
                    selector={(s) => [s.isSubmitting, s.isDirty]}
                    children={([isSubmitting, isDirty]) => (
                      <Button
                        type="button"
                        className="w-full text-[12px] text-white! uppercase md:w-auto"
                        onClick={() => console.log('red')}
                        disabled={isSubmitting || !isDirty}
                      >
                        <SaveIcon /> Save Changes
                      </Button>
                    )}
                  />
                </Button>
              </form.Subscribe>
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
            <div className="space-y-2">
              <p className="text-primary-text font-sans text-[14px] leading-[1.4]">
                Permanently removes this application from your Flight Deck along
                with any generated CV/cover letter for it. This cannot be
                undone.
              </p>
              <DeleteApplicationDialog data={application}>
                <Button className="bg-destructive hover:bg-destructive/80 h-8.75 font-mono text-[12px] leading-[1.4] uppercase">
                  Delete Application...
                </Button>
              </DeleteApplicationDialog>
            </div>
          </SectionCard>
        </div>
        <div className="w-1/2">
          <FilePreview />
        </div>
      </div>
    </>
  )
}
