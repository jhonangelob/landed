import SectionHeader from '#/components/layout/SectionHeader'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import { SparklesIcon } from 'lucide-react'
import { createApplicationSchema } from '#/validators/application'
import { SectionCard } from '#/components/layout/SectionCard'
import { getProfile } from '#/server/profile'
import { useSuspenseQuery } from '@tanstack/react-query'

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

  console.log({ profile })

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
      console.log(value)
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
          className="space-y-8 w-full lg:w-3/5"
        >
          <SectionCard title="Application Information">
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
          </SectionCard>

          <div className="py-3 px-4 flex-col-reverse md:flex-row bg-white rounded-md flex  justify-between items-center gap-4 border">
            <p className="font-sans text-[12px] text-muted-foreground text-center md:text-left">
              {profile.length
                ? 'Co-Pilot will match your Pilot Profile to this exact role.'
                : 'You need to setup your pilot profile first.'}
            </p>
            {profile.length ? (
              <Button
                type="submit"
                className="text-[12px] cursor-pointer w-full md:w-auto uppercase"
              >
                <SparklesIcon /> Generate Documents
              </Button>
            ) : (
              <Button
                type="button"
                className="text-[12px] cursor-pointer w-full md:w-auto uppercase"
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
