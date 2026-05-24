import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { SparklesIcon } from 'lucide-react'
import z from 'zod'

import { useForm } from '@tanstack/react-form'
import { useMutation, useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'

import ApplicationSummary from '#/components/co-pilot/ApplicationSummary'
import StageTimeline from '#/components/co-pilot/StageTimeline'
import SectionCard from '#/components/layout/SectionCard'
import SectionHeader from '#/components/layout/SectionHeader'

import {
  getApplicationDetails,
  saveApplication,
  updateApplication,
} from '#/server/applications'
import { generateDocuments, getDocuments } from '#/server/co-pilot'
import { getProfile } from '#/server/profile'

import { createApplicationSchema } from '#/validators/application'

export const Route = createFileRoute('/(app)/co-pilot')({
  validateSearch: z.object({
    applicationId: z.string().uuid().optional(),
  }),
  loader: ({ context: { queryClient }, location }) => {
    const { applicationId } = location.search as { applicationId?: string }

    const queries = [
      queryClient.ensureQueryData({
        queryKey: ['profile'],
        queryFn: () => getProfile(),
      }),
    ]

    if (applicationId) {
      queries.push(
        queryClient.ensureQueryData({
          queryKey: ['application', applicationId],
          queryFn: () => getApplicationDetails({ data: { id: applicationId } }),
        }),
      )
      queries.push(
        queryClient.ensureQueryData({
          queryKey: ['generated_docs', applicationId],
          queryFn: () => getDocuments({ data: { id: applicationId } }),
        }),
      )
    }

    return Promise.all(queries)
  },
  component: RouteComponent,
})

function RouteComponent() {
  const router = useRouter()
  const { applicationId } = Route.useSearch()

  const isEditMode = !!applicationId

  const { data: profile } = useSuspenseQuery({
    queryKey: ['profile'],
    queryFn: () => getProfile(),
  })

  const { data: documents } = useQuery({
    queryKey: ['documents', applicationId ?? 'skip'],
    queryFn: () => {
      if (!applicationId) return Promise.resolve(null)
      return getDocuments({ data: { id: applicationId } })
    },
    enabled: isEditMode,
  })

  const { data: application } = useQuery({
    queryKey: ['application', applicationId ?? 'skip'],
    queryFn: () => {
      if (!applicationId) return Promise.resolve(null)
      return getApplicationDetails({ data: { id: applicationId } })
    },
    enabled: isEditMode,
  })

  const { mutateAsync: generateDocument } = useMutation({
    mutationFn: async (value: typeof form.state.values) => {
      return await generateDocuments({ data: value })
    },
    onSuccess: (data) => {
      router.navigate({
        to: '/co-pilot',
        search: { applicationId: data.id },
      })
    },
    onError: () => {
      form.reset()
    },
  })

  const { mutateAsync: updateApplicationDetails } = useMutation({
    mutationFn: async (value: typeof form.state.values) => {
      return await updateApplication({
        data: {
          id: applicationId!,
          companyName: value.companyName,
          jobTitle: value.jobTitle,
          jobUrl: value.jobUrl || null,
          location: application?.location ?? null,
          salaryRange: value.salaryRange || null,
          notes: application?.notes ?? null,
          status: application?.status ?? 'spotted',
        },
      })
    },
    onError: () => {
      form.reset()
    },
  })

  const { mutateAsync: saveApplicationDetails } = useMutation({
    mutationFn: async (value: typeof form.state.values) => {
      return await saveApplication({ data: value })
    },
    onSuccess: (data) => {
      router.navigate({
        to: '/co-pilot',
        search: { applicationId: data.id },
      })
    },
    onError: () => {
      form.reset()
    },
  })

  const form = useForm({
    defaultValues: {
      companyName: application?.company || '',
      jobTitle: application?.role || '',
      jobDescription: application?.jobPostText || '',
      jobUrl: application?.jobUrl || '',
      salaryRange: application?.salaryRange || '',
    },
    validators: {
      onSubmit: createApplicationSchema,
    },
    onSubmit: ({ value }) => {
      if (isEditMode) {
        updateApplicationDetails(value)
      } else {
        saveApplicationDetails(value)
      }
    },
  })

  const handleGenerateDocuments = () => {
    generateDocument(form.state.values)
  }

  const handleSetupProfile = () => {
    router.navigate({ to: '/profile' })
  }

  const pageDescription = isEditMode
    ? 'Editing existing application. Changes saved here will update this application on your Flight Deck.'
    : "Paste a job posting and we'll tailor your CV and cover letter using your Pilot Profile."

  return (
    <div className="section">
      <SectionHeader
        subTitle="Ai Document Generator"
        title1="Co-"
        title2="Pilot"
        description={pageDescription}
      />
      <div className="flex flex-row gap-3">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="w-full space-y-4 lg:w-3/5"
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

            {isEditMode && (
              <div className="flex flex-row space-x-4">
                <form.Field
                  name="jobUrl"
                  children={(field) => (
                    <div className="w-full space-y-1.5">
                      <Label
                        htmlFor="jobUrl"
                        className="text-muted-foreground font-sans text-[12px] font-medium"
                      >
                        Job URL
                      </Label>
                      <Input
                        id="jobUrl"
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
                  name="salaryRange"
                  children={(field) => (
                    <div className="w-full space-y-1.5">
                      <Label
                        htmlFor="salaryRange"
                        className="text-muted-foreground font-sans text-[12px] font-medium"
                      >
                        Salary Range
                      </Label>
                      <Input
                        id="salaryRange"
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
            )}

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
                    rows={12}
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

            {profile && isEditMode && (
              <Button
                type="submit"
                className="w-full cursor-pointer text-[12px] uppercase md:w-auto"
              >
                Update Application
              </Button>
            )}
          </SectionCard>

          <div className="flex flex-col-reverse items-center justify-between gap-4 rounded-md border bg-white px-4 py-3 md:flex-row">
            <p className="text-muted-foreground text-center font-sans text-[12px] md:text-left">
              {profile
                ? 'Co-Pilot will match your Pilot Profile to this exact role.'
                : 'You need to setup your pilot profile first.'}
            </p>

            {profile ? (
              <form.Subscribe
                selector={(s) => [s.isSubmitting, s.isDirty]}
                children={([isSubmitting, isDirty]) => (
                  <Button
                    type="button"
                    className="w-full cursor-pointer text-[12px] uppercase md:w-auto"
                    onClick={handleGenerateDocuments}
                    disabled={isSubmitting || !isDirty}
                  >
                    <SparklesIcon />{' '}
                    {isEditMode
                      ? 'Re-Generate Documents'
                      : 'Generate Documents'}
                  </Button>
                )}
              />
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
        <div className="flex flex-1 flex-col gap-4">
          {application && <ApplicationSummary data={application} />}
          {application && <StageTimeline data={application} />}
        </div>
      </div>

      {application && documents && (
        <div>
          <Tabs defaultValue="cv" className="w-full">
            <TabsList>
              <TabsTrigger value="cv">CV</TabsTrigger>
              <TabsTrigger value="cl">Cover Letter</TabsTrigger>
            </TabsList>
            <TabsContent value="cv"></TabsContent>
            <TabsContent value="cl"></TabsContent>
          </Tabs>
        </div>
      )}
    </div>
  )
}
