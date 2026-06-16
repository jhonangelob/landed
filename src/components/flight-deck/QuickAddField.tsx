import type { QuickApplicationInput } from '#/types'
import { PlusIcon } from 'lucide-react'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface QuickAddFieldProps {
  onSubmit: () => void
  value: QuickApplicationInput
  onChange: (data: QuickApplicationInput) => void
}

export default function QuickAddField({
  onSubmit,
  value,
  onChange,
}: QuickAddFieldProps) {
  return (
    <div className="mb-2 flex h-10 min-h-10 w-full flex-row items-center rounded-lg border bg-white pr-2">
      <Input
        className="h-6! w-22! border-none bg-white! px-2 placeholder:text-[13px]"
        placeholder="Company..."
        value={value.company}
        onChange={(e) =>
          onChange({
            company: e.target.value,
            role: value.role,
          })
        }
      />
      <Input
        className="h-6! flex-1 rounded-none border-t-0! border-r-0! border-b-0! border-l! bg-white! px-2 placeholder:text-[13px]"
        placeholder="Role..."
        value={value.role}
        onChange={(e) =>
          onChange({
            company: value.company,
            role: e.target.value,
          })
        }
      />
      <Button variant="outline" className="h-6 w-6" onClick={onSubmit}>
        <PlusIcon className="text-muted" />
      </Button>
    </div>
  )
}
