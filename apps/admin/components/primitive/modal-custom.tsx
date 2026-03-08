'use client'

import { useModal } from "@/providers/modal-provider";
import { Button } from "@workspace/ui/components/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@workspace/ui/components/dialog";

type Props = {
  title: string
  description: string
  onAction: () => void
  openDialog: React.ReactNode
}

const ModalCustom = ({ title, description, onAction, openDialog }: Props) => {
    const { isOpen, setOpen, onCancel } = useModal()
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger>{openDialog}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
            <Button variant="outline" onClick={onCancel}>Cancel</Button>
            <Button onClick={onAction}>Continue</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
export default ModalCustom;
