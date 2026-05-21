import { ChevronDown, Trash2Icon } from 'lucide-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu'
import { Button } from '#/components/ui/button'

import { updateApplicationStatus } from '#/server/applications'
import { applicationStatusSchema } from '#/validators/application'
import type { Application } from '#/lib/db/schema'
import type { KanbanItemBadgeProps } from '../flight-deck/KanbanItem'
import DeleteApplicationDialog from './DeleteApplicationDialog'

interface ApplicationSummaryProps {
  data: Application
}

const styles = {
  container: 'flex flex-row items-center justify-between border-b px-4 py-3',
  label: 'text-muted-foreground font-mono text-[12px]',
  value: 'text-primary-text text-[13px] font-medium',
}

const variantStyles: Record<KanbanItemBadgeProps['variant'], string> = {
  spotted:
    'border-none bg-status-spotted/10 text-status-spotted hover:text-status-spotted font-semibold hover:bg-status-spotted/10',
  applied:
    'border-none bg-status-applied/10 text-status-applied hover:text-status-applied font-semibold hover:bg-status-applied/10',
  in_flight:
    'border-none bg-status-in-flight/10 text-status-in-flight hover:text-status-in-flight font-semibold hover:bg-status-in-flight/10',
  interview:
    'border-none bg-primary text-white hover:text-white font-semibold hover:bg-primary',
  offer:
    'border-none bg-status-offer/10 text-status-offer hover:text-status-offer font-semibold hover:bg-status-offer/10',
  landed:
    'border-none bg-transparent text-status-landed hover:text-status-landed font-bold hover:bg-transparent',
  rejected:
    'border-none bg-destructive/10 text-destructive hover:text-destructive font-semibold hover:bg-destructive/10',
  withdrawn:
    'border-none bg-muted text-muted-foreground hover:text-muted-foreground font-semibold hover:bg-muted',
}

const statusItemClass: Record<
  (typeof applicationStatusSchema.options)[number],
  string
> = {
  spotted: 'text-status-spotted font-medium',
  applied: 'text-status-applied font-medium',
  in_flight: 'text-status-in-flight font-medium',
  interview: 'text-status-interviewing font-medium',
  offer: 'text-status-offer font-medium',
  landed: 'text-status-landed font-medium',
  rejected: 'text-destructive font-medium',
  withdrawn: 'text-muted-foreground font-medium',
}

function formatDate(date: Date | string | null): string {
  if (!date) return 'Not set'
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function ApplicationSummary({ data }: ApplicationSummaryProps) {
  const queryClient = useQueryClient()

  const { mutateAsync: updateStatus, isPending } = useMutation({
    mutationFn: (status: (typeof applicationStatusSchema.options)[number]) =>
      updateApplicationStatus({ data: { id: data.id, status } }),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['application', data.id] })
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },

    onError: (err) => {
      console.log(err)
    },
  })

  return (
    <div className="min-w-full overflow-hidden rounded-lg border bg-white shadow-none!">
      <div className="flex flex-row items-center justify-between border-b p-4">
        <p className="text-[14px] font-medium">Application Summary</p>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              disabled={isPending}
              className={`h-6 min-h-0 cursor-pointer rounded-full border-none p-0 py-0 font-mono text-[10px] shadow-none ${variantStyles[data.status]}`}
            >
              {data.status} <ChevronDown className="size-3" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuGroup>
              {applicationStatusSchema.options.map((item) => (
                <DropdownMenuItem
                  key={item}
                  className={statusItemClass[item]}
                  disabled={data.status === item}
                  onClick={async (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    await updateStatus(item)
                  }}
                >
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className={styles.container}>
        <p className={styles.label}>Company</p>
        <div className={styles.value}>{data.company}</div>
      </div>

      <div className={styles.container}>
        <p className={styles.label}>Role</p>
        <div className={styles.value}>{data.role}</div>
      </div>

      {data.location && (
        <div className={styles.container}>
          <p className={styles.label}>Location</p>
          <div className={styles.value}>{data.location}</div>
        </div>
      )}

      {data.salaryRange && (
        <div className={styles.container}>
          <p className={styles.label}>Salary</p>
          <div className={styles.value}>{data.salaryRange}</div>
        </div>
      )}

      <div className={styles.container}>
        <p className={styles.label}>Applied</p>
        <div className={styles.value}>{formatDate(data.appliedAt)}</div>
      </div>

      <div className={styles.container}>
        <p className={styles.label}>Created</p>
        <div className={styles.value}>{formatDate(data.createdAt)}</div>
      </div>

      <div className="bg-destructive/90 flex flex-row items-center justify-between gap-4 px-4 py-3">
        <div className="space-y-0.5">
          <p className="font-mono text-[12px] text-white uppercase">
            Danger Zone
          </p>
          <p className="font-sans text-[12px] text-white/80">
            Permanently removes this application and all generated documents.
          </p>
        </div>

        <DeleteApplicationDialog data={data}>
          <Button
            variant="outline"
            size="sm"
            className="bg-destructive/90 cursor-pointer border-white font-mono text-[11px] text-white uppercase hover:bg-white/20 hover:text-white"
          >
            <Trash2Icon className="size-3.5" />
            Delete
          </Button>
        </DeleteApplicationDialog>
      </div>
    </div>
  )
}
