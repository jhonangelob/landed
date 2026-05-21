import type { Application } from '#/dummy/data'

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

import { updateApplicationSchema } from '#/validators/application'

import type { ApplicationStatusEnum } from '#/types/application'

import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'

export interface KanbanItemProps {
  data: Application
}

export type KanbanItemBadgeProps = {
  label: string
  variant: ApplicationStatusEnum
}

const variantStyles: Record<KanbanItemBadgeProps['variant'], string> = {
  spotted: 'border-none bg-status-spotted/10 text-status-spotted font-semibold',
  applied: 'border-none bg-status-applied/10 text-status-applied font-semibold',
  in_flight:
    'border-none bg-status-in-flight/10 text-status-in-flight font-semibold',
  interview: 'border-none bg-primary text-white font-semibold',
  offer: 'border-none bg-status-offer/10 text-status-offer font-semibold',
  landed: 'border-none bg-transparent text-status-landed font-bold',
}

const STATUS_OPTIONS = [
  'spotted',
  'applied',
  'in_flight',
  'interview',
  'offer',
  'landed',
  'rejected',
  'withdrawn',
] as const

const statusItemClass: Record<(typeof STATUS_OPTIONS)[number], string> = {
  spotted: 'text-status-spotted',
  applied: 'text-status-applied',
  in_flight: 'text-status-in-flight',
  interview: 'text-status-interviewing',
  offer: 'text-status-offer',
  landed: 'text-status-landed',
  rejected: 'text-destructive',
  withdrawn: 'text-muted-foreground',
}

function KanbanItemBadge({ label, variant }: KanbanItemBadgeProps) {
  return (
    <div
      className={`w-fit rounded-md border px-1.5 py-0.5 font-sans text-[10px] leading-3.75 uppercase ${variantStyles[variant]}`}
    >
      {label}
    </div>
  )
}

export default function KanbanItem({ data, ...rest }: KanbanItemProps) {
  const form = useForm({
    defaultValues: {
      id: data.id,
      companyName: data.company,
      jobTitle: data.role,
      jobUrl: data.job_url ?? '',
      location: data.location,
      isRemote: data.is_remote,
      salaryRange: data.salary_range ?? '',
      notes: data.notes ?? '',
      status: data.status,
    },
    validators: {
      onSubmit: updateApplicationSchema,
    },
    onSubmit: async ({ value }) => {
      console.log(value)
    },
  })

  return (
    <Sheet>
      <SheetTrigger>
        <div className="hover:border-primary flex w-73 cursor-pointer flex-col space-y-1.5 rounded-lg border bg-white p-4">
          <div className="flex flex-row items-center justify-between">
            <p className="text-muted-foreground font-mono text-[12px] font-medium">
              {new Date(data.created_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
              })}
            </p>
            <KanbanItemBadge
              label="NEW ENTRY"
              variant={data.status as ApplicationStatusEnum}
              {...rest}
            />
          </div>
          <p className="font-display text-primary-text text-left text-[12px] font-bold">
            {data.role}
          </p>
          <p className="text-muted-foreground text-left font-sans text-[12px] font-medium">
            {data.company}
          </p>
        </div>
      </SheetTrigger>
      <SheetContent className="flex flex-col overflow-y-auto bg-white px-8 pt-12 pb-8">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex w-full flex-1 flex-col gap-4"
        >
          <div className="flex flex-col gap-4 md:flex-row">
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
                    className="bg-white text-sm shadow-none"
                  />
                  {field.state.meta.errors.map((err, i) => (
                    <p key={i} className="text-destructive text-sm">
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
                    className="bg-white text-sm shadow-none"
                  />
                  {field.state.meta.errors.map((err, i) => (
                    <p key={i} className="text-destructive text-sm">
                      {err?.message as string}
                    </p>
                  ))}
                </div>
              )}
            />
          </div>

          <form.Field
            name="status"
            children={(field) => (
              <div className="space-y-1.5">
                <Label className="text-muted-foreground font-sans text-[12px] font-medium">
                  Status
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(v as (typeof STATUS_OPTIONS)[number])
                  }
                >
                  <SelectTrigger className="w-1/2 bg-white font-sans text-sm capitalize shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem
                        key={s}
                        value={s}
                        className={`font-sans text-sm font-medium capitalize ${statusItemClass[s]}`}
                      >
                        {s.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          />

          <form.Field
            name="location"
            children={(field) => (
              <div className="w-full space-y-1.5">
                <Label
                  htmlFor="location"
                  className="text-muted-foreground font-sans text-[12px] font-medium"
                >
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g. Remote"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="bg-white text-sm shadow-none"
                />
              </div>
            )}
          />

          <form.Field
            name="salaryRange"
            children={(field) => (
              <div className="space-y-1.5">
                <Label
                  htmlFor="salaryRange"
                  className="text-muted-foreground font-sans text-[12px] font-medium"
                >
                  Salary Range
                </Label>
                <Input
                  id="salaryRange"
                  placeholder="e.g. $120k – $150k"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="bg-white text-sm shadow-none"
                />
              </div>
            )}
          />

          <form.Field
            name="jobUrl"
            children={(field) => (
              <div className="space-y-1.5">
                <Label
                  htmlFor="jobUrl"
                  className="text-muted-foreground font-sans text-[12px] font-medium"
                >
                  Job URL
                </Label>
                <Input
                  id="jobUrl"
                  placeholder="https://..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="bg-white text-sm shadow-none"
                />
                {field.state.meta.errors.map((err, i) => (
                  <p key={i} className="text-destructive text-sm">
                    {err?.message as string}
                  </p>
                ))}
              </div>
            )}
          />

          <div className="space-y-1.5">
            <p className="text-muted-foreground font-sans text-[12px] font-medium">
              Dates
            </p>
            <div className="divide-border divide-y rounded-md border bg-white">
              {(
                [
                  { label: 'Applied', value: data.applied_at },
                  { label: 'Interview', value: data.interview_at },
                  { label: 'Offer', value: data.offer_at },
                  { label: 'Landed', value: data.landed_at },
                  { label: 'Rejected', value: data.rejected_at },
                ] as const
              ).map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-3 py-2"
                >
                  <p className="text-muted-foreground font-sans text-[12px] font-medium">
                    {label}
                  </p>
                  <p className="text-primary-text font-mono text-[12px]">
                    {value
                      ? new Date(value).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })
                      : '—'}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <form.Field
            name="notes"
            children={(field) => (
              <div className="space-y-1.5">
                <Label
                  htmlFor="notes"
                  className="text-muted-foreground font-sans text-[12px] font-medium"
                >
                  Notes
                </Label>
                <Textarea
                  id="notes"
                  placeholder="Add notes..."
                  rows={4}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="bg-white text-sm shadow-none"
                />
              </div>
            )}
          />

          <div className="mt-auto flex flex-row items-center gap-4">
            <Button
              className="flex-1 cursor-pointer text-[12px]"
              variant={'destructive'}
            >
              Delete Application
            </Button>

            <Button type="submit" className="flex-1 cursor-pointer text-[12px]">
              Save Changes
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
