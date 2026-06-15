import { useState } from 'react'

import { CopyIcon } from 'lucide-react'

import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select'

import {
  useCreateCodesMutation,
  useSubscriptionCodesQuery,
} from '#/hooks/useAdminQueries'

import { notify } from '#/lib/toast'
import { cn } from '#/lib/utils'

import type { CodePlanId } from '#/validators/admin'

const PLAN_LABEL: Record<string, string> = {
  economy: 'Economy',
  premium: 'Premium',
  business: 'Business',
}

export default function SubscriptionCodes() {
  const { data: codes } = useSubscriptionCodesQuery()
  const { mutate: createCodes, isPending } = useCreateCodesMutation()

  const [planId, setPlanId] = useState<CodePlanId>('premium')
  const [quantity, setQuantity] = useState('10')

  const handleGenerate = () => {
    const qty = Math.min(100, Math.max(1, Number(quantity) || 1))
    createCodes({ planId, quantity: qty })
  }

  const handleCopy = (code: string) => {
    void navigator.clipboard.writeText(code)
    notify.success('Code copied to clipboard')
  }

  return (
    <div className="bg-card rounded-xl border">
      <div className="border-b px-5 py-4">
        <p className="font-mono text-[11px] font-medium tracking-[1.3px] text-muted-foreground uppercase">
          Comp Codes
        </p>
        <p className="text-muted mt-0.5 font-sans text-[13px]">
          Generate single-use codes that grant a paid plan for free.
        </p>
      </div>

      <div className="space-y-5 px-5 py-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
              Plan
            </label>
            <Select
              value={planId}
              onValueChange={(value) => setPlanId(value as CodePlanId)}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="premium">Premium · 30 days</SelectItem>
                <SelectItem value="business">Business · 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1.5">
            <label className="font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
              Quantity
            </label>
            <Input
              type="number"
              min={1}
              max={100}
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-28"
            />
          </div>

          <Button onClick={handleGenerate} disabled={isPending}>
            {isPending ? 'Generating…' : 'Generate'}
          </Button>
        </div>

        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-muted/40 text-muted-foreground font-mono text-[10px] tracking-[0.08em] uppercase">
              <tr>
                <th className="px-4 py-2.5 font-medium">Code</th>
                <th className="px-4 py-2.5 font-medium">Plan</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium">Created</th>
                <th className="px-4 py-2.5 font-medium"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {codes && codes.length > 0 ? (
                codes.map((row) => {
                  const redeemed = !!row.redeemedAt
                  return (
                    <tr key={row.id} className="hover:bg-muted/20">
                      <td className="px-4 py-2.5 font-mono font-medium tracking-wide">
                        {row.code}
                      </td>
                      <td className="text-muted-foreground px-4 py-2.5">
                        {PLAN_LABEL[row.planId] ?? row.planId} · {row.durationDays}
                        d
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={cn(
                            'inline-flex rounded-full px-2 py-0.5 font-mono text-[10.5px] font-medium',
                            redeemed
                              ? 'bg-muted text-muted-foreground'
                              : 'bg-emerald-50 text-emerald-600',
                          )}
                        >
                          {redeemed
                            ? `Redeemed${row.redeemerEmail ? ` · ${row.redeemerEmail}` : ''}`
                            : 'Active'}
                        </span>
                      </td>
                      <td className="text-muted-foreground px-4 py-2.5">
                        {new Date(row.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        {!redeemed && (
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={() => handleCopy(row.code)}
                          >
                            <CopyIcon className="size-3.5" />
                          </Button>
                        )}
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="text-muted-foreground px-4 py-8 text-center font-sans text-[13px]"
                  >
                    No codes yet. Generate a batch above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
