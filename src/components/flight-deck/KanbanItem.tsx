import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { ChevronDown } from 'lucide-react'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { Button } from '#/components/ui/button'

import { updateApplicationStatus } from '#/server/applications'

import { applicationStatusSchema } from '#/validators/application'

import type { Application } from '#/types/application'

export interface KanbanItemProps {
  data: Application
}

export type KanbanItemBadgeProps = {
  label: string
  variant: string
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

export default function KanbanItem({ data }: KanbanItemProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const { mutateAsync: updateStatus } = useMutation({
    mutationFn: (value: (typeof applicationStatusSchema.options)[number]) =>
      updateApplicationStatus({ data: { id: data.id, status: value } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['applications'] })
    },
    onError: (err) => {
      console.log(err)
    },
  })

  const handleClickApplicationItem = () => {
    navigate({
      to: '/co-pilot',
      search: { applicationId: data.id },
    })
  }

  return (
    <div
      className="hover:border-primary flex w-73 cursor-pointer flex-col space-y-1.5 rounded-lg border bg-white p-4"
      onClick={handleClickApplicationItem}
    >
      <div className="flex flex-row items-center justify-between">
        <p className="text-muted-foreground font-mono text-[12px] font-medium">
          {new Date(data.createdAt).toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
          })}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className={`h-6 min-h-0 cursor-pointer rounded-full border-none p-0 py-0 font-mono text-[10px] shadow-none ${variantStyles[data.status]}`}
            >
              {data.status} <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuGroup>
              {applicationStatusSchema.options.map((item) => (
                <DropdownMenuItem
                  className={`${statusItemClass[item]}`}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    updateStatus(item)
                  }}
                  disabled={data.status === item}
                >
                  {item}
                </DropdownMenuItem>
              ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <p className="font-display text-primary-text text-left text-[12px] font-bold">
        {data.role}
      </p>
      <p className="text-muted-foreground text-left font-sans text-[12px] font-medium">
        {data.company}
      </p>
    </div>
  )
}
