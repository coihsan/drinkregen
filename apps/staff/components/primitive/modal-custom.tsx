'use client'

import { useModal } from "@/providers/modal-provider";
import { Dialog } from "@workspace/ui/components/dialog";

type Props = {
  title: string
  description: string
  onAction: () => void
  children: React.ReactNode
}

const ModalCustom = ({ children }: Props) => {
    const { isOpen, setOpen } = useModal()
  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      {children}
    </Dialog>
  )
}
export default ModalCustom;
