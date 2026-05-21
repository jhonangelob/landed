import { SparklesIcon } from 'lucide-react'

import { useForm } from '@tanstack/react-form'
import { useMutation, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'

import { SectionCard } from '#/components/layout/SectionCard'
import SectionHeader from '#/components/layout/SectionHeader'

import { generateDocuments } from '#/server/co-pilot'
import { getProfile } from '#/server/profile'

import { createApplicationSchema } from '#/validators/application'

export const Route = createFileRoute('/(app)/co-pilot')({
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({
      queryKey: ['profile'],
      queryFn: () => getProfile(),
    }),
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()

  const { data: profile } = useSuspenseQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
  })

  const { mutateAsync: generateDocument } = useMutation({
    mutationFn: async (value: typeof form.state.values) => {
      return await generateDocuments({ data: value })
    },
    onSuccess: (data) => {
      console.log(data)
    },
    onError: () => {
      form.reset()
    },
  })

  const form = useForm({
    defaultValues: {
      companyName: '',
      jobTitle: '',
      jobDescription: '',
    },
    validators: {
      onSubmit: createApplicationSchema,
    },
    onSubmit: async ({ value }) => {
      const docs = generateDocument(value)
      console.log(docs)
    },
  })

  const handleSetupProfile = () => {
    router.navigate({ to: '/profile' })
  }

  return (
    <div className="section">
      <SectionHeader
        title="Co-Pilot"
        description="Paste a job posting and we'll tailor your CV and cover letter using your Pilot Profile."
      />
      <div className="flex flex-row gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="w-full space-y-8 lg:w-3/5"
        >
          <SectionCard title="Application Information">
            <div className="flex flex-row space-x-4">
              <form.Field
                name="companyName"
                children={(field) => (
                  <div className="w-full space-y-1.5">
                    <Label
                      htmlFor="companyName"
                      className="text-muted-foreground font-sans text-[12px] font-medium"
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
                    <Label
                      htmlFor="jobTitle"
                      className="text-muted-foreground font-sans text-[12px] font-medium"
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
                    rows={14}
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
          </SectionCard>

          <div className="flex flex-col-reverse items-center justify-between gap-4 rounded-md border bg-white px-4 py-3 md:flex-row">
            <p className="text-muted-foreground text-center font-sans text-[12px] md:text-left">
              {profile.id
                ? 'Co-Pilot will match your Pilot Profile to this exact role.'
                : 'You need to setup your pilot profile first.'}
            </p>
            {profile.id ? (
              <Button
                type="submit"
                className="w-full cursor-pointer text-[12px] uppercase md:w-auto"
              >
                <SparklesIcon /> Generate Documents
              </Button>
            ) : (
              <Button
                type="button"
                className="w-full cursor-pointer text-[12px] uppercase md:w-auto"
                onClick={handleSetupProfile}
              >
                Setup Pilot Profile
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
