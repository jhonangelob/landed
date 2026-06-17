import { useState } from 'react'

import { useQuickApplicationMutation } from '#/hooks/useApplicationQueries'
import type { QuickApplicationInput } from '#/types'
import { PlusIcon } from 'lucide-react'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

export default function QuickAddField() {
  const [fields, setFields] = useState<QuickApplicationInput>({
    company: '',
    role: '',
  })

  const { mutateAsync: createApplication } = useQuickApplicationMutation()

  const handleSubmit = () => {
    createApplication(fields)
    setFields({
      company: '',
      role: '',
    })
  }

  return (
    <div className="mb-2 flex h-10 min-h-10 w-full flex-row items-center rounded-lg border bg-white pr-2">
      <Input
        className="h-6! w-1/3 border-none bg-white! px-2 placeholder:text-[13px]"
        placeholder="Company..."
        value={fields.company}
        onChange={(e) =>
          setFields({
            company: e.target.value,
            role: fields.role,
          })
        }
      />
      <Input
        className="h-6! flex-1 rounded-none border-t-0! border-r-0! border-b-0! border-l! bg-white! px-2 placeholder:text-[13px]"
        placeholder="Role..."
        value={fields.role}
        onChange={(e) =>
          setFields({
            company: fields.company,
            role: e.target.value,
          })
        }
      />
      <Button variant="outline" className="h-6 w-6" onClick={handleSubmit}>
        <PlusIcon className="text-muted" />
      </Button>
    </div>
  )
}
