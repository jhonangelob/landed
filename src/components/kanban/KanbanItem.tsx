import type { Application } from '#/dummy/data'
import type { ApplicationStatusEnum } from '#/types/application'
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
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { updateApplicationSchema } from '#/validators/application'

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
      className={`border w-fit rounded-md py-0.5 px-1.5 font-sans uppercase text-[10px] leading-3.75 ${variantStyles[variant]}`}
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
        <div className="rounded-lg border hover:border-primary bg-white p-4 w-73 flex flex-col space-y-1.5 cursor-pointer">
          <div className="flex flex-row justify-between items-center">
            <p className="font-mono text-[12px] font-medium text-muted-foreground">
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
          <p className="font-display text-[12px] text-left font-bold text-primary-text">
            {data.role}
          </p>
          <p className="font-sans text-[12px] text-left font-medium text-muted-foreground">
            {data.company}
          </p>
        </div>
      </SheetTrigger>
      <SheetContent className="pt-12 px-8 pb-8 overflow-y-auto bg-white flex flex-col">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            form.handleSubmit()
          }}
          className="flex flex-col gap-4 w-full flex-1"
        >
          <div className="flex md:flex-row flex-col gap-4">
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
                    className="bg-white shadow-none text-sm"
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
                    className="bg-white shadow-none text-sm"
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
            name="status"
            children={(field) => (
              <div className="space-y-1.5">
                <Label className="font-sans font-medium text-[12px] text-muted-foreground">
                  Status
                </Label>
                <Select
                  value={field.state.value}
                  onValueChange={(v) =>
                    field.handleChange(v as (typeof STATUS_OPTIONS)[number])
                  }
                >
                  <SelectTrigger className="bg-white shadow-none w-1/2 capitalize text-sm font-sans">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((s) => (
                      <SelectItem
                        key={s}
                        value={s}
                        className={`font-medium text-sm capitalize font-sans ${statusItemClass[s]}`}
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
              <div className="space-y-1.5 w-full">
                <Label
                  htmlFor="location"
                  className="font-sans font-medium text-[12px] text-muted-foreground"
                >
                  Location
                </Label>
                <Input
                  id="location"
                  placeholder="e.g. Remote"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="bg-white shadow-none text-sm"
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
                  className="font-sans font-medium text-[12px] text-muted-foreground"
                >
                  Salary Range
                </Label>
                <Input
                  id="salaryRange"
                  placeholder="e.g. $120k – $150k"
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="bg-white shadow-none text-sm"
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
                  className="font-sans font-medium text-[12px] text-muted-foreground"
                >
                  Job URL
                </Label>
                <Input
                  id="jobUrl"
                  placeholder="https://..."
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="bg-white shadow-none text-sm"
                />
                {field.state.meta.errors.map((err, i) => (
                  <p key={i} className="text-sm text-destructive">
                    {err?.message as string}
                  </p>
                ))}
              </div>
            )}
          />

          <div className="space-y-1.5">
            <p className="font-sans font-medium text-[12px] text-muted-foreground">
              Dates
            </p>
            <div className="divide-y divide-border rounded-md border bg-white">
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
                  <p className="font-sans text-[12px] font-medium text-muted-foreground">
                    {label}
                  </p>
                  <p className="font-mono text-[12px] text-primary-text">
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
                  className="font-sans font-medium text-[12px] text-muted-foreground"
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
                  className="bg-white shadow-none text-sm"
                />
              </div>
            )}
          />

          <div className="flex flex-row gap-4 items-center mt-auto">
            <Button
              className="text-[12px] cursor-pointer flex-1"
              variant={'destructive'}
            >
              Delete Application
            </Button>

            <Button type="submit" className="text-[12px] cursor-pointer flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  )
}
