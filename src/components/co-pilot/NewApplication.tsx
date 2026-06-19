import { useCreateApplicationMutation } from '#/hooks/useApplicationQueries'
import type { ApplicationInput, ApplicationStage, PilotProfile } from '#/types'
import { PlusIcon } from 'lucide-react'

import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'

import { newApplicationSchema } from '#/validators/application'

import SectionHeader from '../layout/SectionHeader'
import FilePreview from './FilePreview'

interface NewApplicationProps {
  profile?: PilotProfile | null
  stage?: ApplicationStage
}

export default function NewApplication({
  stage = 'spotted',
}: NewApplicationProps) {
  const navigate = useNavigate()

  const { mutateAsync: createApplication } = useCreateApplicationMutation()

  const form = useForm({
    defaultValues: {
      company: '',
      role: '',
      description: '',
      stage,
    } satisfies ApplicationInput,
    validators: { onSubmit: newApplicationSchema },
    onSubmit: async ({ value }) => {
      const application = await createApplication(value)
      form.reset()
      navigate({
        to: '/app/co-pilot',
        search: { applicationId: application.id },
      })
    },
  })

  return (
    <>
      <SectionHeader
        subTitle="Ai Document Generator"
        title1="Co-"
        title2="Pilot"
        description="Paste a job posting and we'll tailor your CV and Cover Letter using your Pilot Profile."
      />
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex h-fit min-w-1/2 flex-col gap-4 rounded-lg border bg-white p-6">
          <div className="flex flex-row items-center justify-between border-b border-dashed pb-3.5">
            <p className="text-muted font-mono text-[11px] leading-[1.4] font-normal tracking-[1.5px] uppercase">
              Job Posting
            </p>
            <p className="text-primary-text font-mono text-[11px] leading-[1.4] font-normal">
              Auto saved - Just now
            </p>
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              form.handleSubmit()
            }}
            className="w-full space-y-4"
          >
            <div className="flex flex-col gap-4 lg:flex-row">
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
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Paste the full job requirements and role description here..."
                    rows={12}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                  <p className="text-muted font-mono text-[12px] leading-[1.4]">
                    {field.state.value.length} chars -{' '}
                    {field.state.value.trim() === ''
                      ? 0
                      : field.state.value.trim().split(/\s+/).length}{' '}
                    words
                  </p>
                  {field.state.meta.errors.map((err, i) => (
                    <p key={i} className="text-destructive text-xs">
                      {err?.message as string}
                    </p>
                  ))}
                </div>
              )}
            />
            <div className="flex justify-end border-t border-dashed pt-3.5">
              {/* {!profile ? (
                <Button type="button" onClick={handleSetupProfile}>
                  Setup Profile
                </Button>
              ) : ( */}
              <form.Subscribe
                selector={(s) => [s.isSubmitting, s.isDirty]}
                children={([isSubmitting, isDirty]) => (
                  <Button
                    type="submit"
                    className="w-full text-[12px] text-white! uppercase md:w-auto"
                    disabled={isSubmitting || !isDirty}
                  >
                    <PlusIcon /> Create Application
                  </Button>
                )}
              />
              {/* )} */}
            </div>
          </form>
        </div>

        <div className="w-full md:w-1/2">
          <FilePreview />
        </div>
      </div>
    </>
  )
}
