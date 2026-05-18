import SectionHeader from '#/components/layout/SectionHeader'
import { createFileRoute } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import z from 'zod'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import { SparklesIcon } from 'lucide-react'

export const Route = createFileRoute('/(app)/co-pilot')({
  component: RouteComponent,
})

const schema = z.object({
  companyName: z.string().min(1, 'Company name is required'),
  jobTitle: z.string().min(1, 'Job title is required'),
  jobDescription: z.string().min(1, 'Job description is required'),
})

function RouteComponent() {
  const form = useForm({
    defaultValues: {
      companyName: '',
      jobTitle: '',
      jobDescription: '',
    },
    validators: {
      onSubmit: schema,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
    <div className="section">
      <SectionHeader
        title="Co-Pilot"
        description="Automated document crafting for your next career ascent."
      />
      <div className="flex flex-row gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="space-y-8 w-full lg:w-3/5"
        >
          <div className="flex flex-row space-x-4">
            <form.Field
              name="companyName"
              children={(field) => (
                <div className="space-y-1.5 w-full">
                  <Label
                    htmlFor="companyName"
                    className="font-sans font-medium text-[12px] text-muted-foreground"
                  >
                    Company Name
                  </Label>
                  <Input
                    id="companyName"
                    placeholder="e.g. Acme Corp"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="bg-white shadow-none placeholder:text-sm"
                  />
                  {field.state.meta.errors.map((err, i) => (
                    <p key={i} className="text-sm text-destructive">
                      {err?.message as string}
                    </p>
                  ))}
                </div>
              )}
            />

            <form.Field
              name="jobTitle"
              children={(field) => (
                <div className="space-y-1.5 w-full">
                  <Label
                    htmlFor="jobTitle"
                    className="font-sans font-medium text-[12px] text-muted-foreground"
                  >
                    Job Title
                  </Label>
                  <Input
                    id="jobTitle"
                    placeholder="e.g. Software Engineer"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    className="bg-white shadow-none placeholder:text-sm"
                  />
                  {field.state.meta.errors.map((err, i) => (
                    <p key={i} className="text-sm text-destructive">
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
                  className="font-sans font-medium text-[12px] text-muted-foreground"
                >
                  Job Description
                </Label>
                <Textarea
                  id="jobDescription"
                  placeholder="Paste the full job requirements and role description here..."
                  rows={14}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="bg-white shadow-none placeholder:text-sm"
                />
                {field.state.meta.errors.map((err, i) => (
                  <p key={i} className="text-sm text-destructive">
                    {err?.message as string}
                  </p>
                ))}
              </div>
            )}
          />

          <div className="py-3 px-4 flex-col-reverse md:flex-row bg-white rounded-md flex  justify-between items-center gap-4 border">
            <p className="font-sans text-[12px] text-muted-foreground text-center md:text-left">
              Co-Pilot will match your Pilot Profile to this exact role.
            </p>
            <Button
              type="submit"
              className="text-[12px] cursor-pointer w-full md:w-auto"
            >
              <SparklesIcon /> GENERATE DOCUMENTS
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
