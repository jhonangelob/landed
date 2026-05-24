import type React from 'react'
import { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '#/components/ui/dialog'

import { ACCOUNT_DELETION_WARNING_LIST } from '#/constants/account'

import { Button } from '../ui/button'
import { Input } from '../ui/input'

interface DeleteAccountDialogProps {
  children: React.ReactNode
  onDelete: () => void
}

export default function DeleteAccountDialog({
  children,
  onDelete,
}: DeleteAccountDialogProps) {
  const [input, setInput] = useState('')

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-110 space-y-0">
        <DialogHeader>
          <DialogTitle className="font-mono text-[11px] leading-[1.4] font-normal tracking-[1.5px] text-[#d2484a] uppercase">
            Final Descent
          </DialogTitle>
          <DialogDescription className="font display text-primary-text text-[24px] leading-[1.2] font-semibold tracking-[-0.6px]">
            Delete your account?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-1">
          <p className="text-primary-text font-sans text-[14px] leading-[1.55]">
            This will permanently delete
          </p>
          {ACCOUNT_DELETION_WARNING_LIST.map((item) => (
            <div className="text-primary-text pl-1 font-sans text-[14px] leading-[1.55]">
              • {item}
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-primary-text flex items-end gap-1 font-sans text-[14px] leading-[1.55]">
            Type
            <span className="font-mono font-bold">DELETE</span>
            to confirm
          </p>
          <Input
            placeholder="DELETE"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="shadow-none"
          />
        </div>
        <div className="flex flex-row items-center justify-end gap-2">
          <Button
            variant="outline"
            className="w-fit cursor-pointer text-[13px] uppercase"
            disabled={input !== 'DELETE'}
            onClick={onDelete}
          >
            Keep Account
          </Button>
          <Button
            variant="destructive"
            className="w-fit cursor-pointer text-[13px] uppercase"
            disabled={input !== 'DELETE'}
            onClick={onDelete}
          >
            Delete Account
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
