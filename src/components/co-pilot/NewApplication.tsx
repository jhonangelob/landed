import { SparklesIcon } from 'lucide-react'

import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'

import { createApplicationSchema } from '#/validators/application'

import SectionHeader from '../layout/SectionHeader'
import FilePreview from './FilePreview'

interface NewApplicationProps {
  hasProfile: boolean
}

export default function NewApplication({ hasProfile }: NewApplicationProps) {
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: {
      companyName: '',
      jobTitle: '',
      jobDescription: '',
      jobUrl: '',
      salaryRange: '',
    },
    validators: createApplicationSchema,
    onSubmit: ({ value }) => {
      console.log(value)
    },
  })

  const handleSetupProfile = () => {
    navigate({ to: '/profile' })
  }

  return (
    <>
      <SectionHeader
        subTitle="Ai Document Generator"
        title1="Co-"
        title2="Pilot"
        description="Paste a job posting and we'll tailor your CV and cover letter using your Pilot Profile."
      />
      <div className="flex flex-row gap-4">
        <div className="flex min-w-1/2 flex-col gap-4 rounded-lg border bg-white p-6">
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
            <div className="flex flex-row space-x-4">
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
                  <Label htmlFor="jobDescription">Job Description</Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste the full job requirements and role description here..."
                    rows={12}
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="bg-white shadow-none placeholder:text-sm"
                  />
                  <p className="text-muted font-mono text-[12px] leading-[1.4]">
                    0 chars - 0 words
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
              {!hasProfile ? (
                <Button className="" onClick={handleSetupProfile}>
                  Setup Profile
                </Button>
              ) : (
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
                          <SparklesIcon /> Generate Documents
                        </Button>
                      )}
                    />
                  </Button>
                </form.Subscribe>
              )}
            </div>
          </form>
        </div>

        <FilePreview />
      </div>
    </>
  )
}
